
import * as Tx from "ethereumjs-tx";
import * as lodash from "lodash";
import * as web3Func from "../../node_modules/web3/lib/web3/function";
import * as coder from '../../node_modules/web3/lib/solidity/coder';
import async from 'async';
import ethLightwallet from 'eth-lightwallet';
import moreEntropy from 'more-entropy'
var keyStore = ethLightwallet.keyStore;

import Store from "../Store";

var appAccounts = JSON.parse(require('../accounts.json'));

export function getAccounts(callback) {
    Store.web3.eth.getAccounts(callback);
}

export function getNodeInfo(){
    try {
        return {
            block: Store.web3.eth.blockNumber,
            connected: Store.web3.isConnected(),
            hashrate: Store.web3.eth.hashrate,
            peers: Store.web3.net.peerCount,
            syncing: Store.web3.eth.syncing
        }
    } catch (e) {
        console.error(e);
        return {
            block: 0,
            connected: false,
            hashrate: 0,
            peers: 0,
            syncing: false
        }
    }
}

export function waitForBlock(block, callback) {
    var wait = setInterval( function() {
        if (Store.web3.eth.blockNumber >= block) {
            clearInterval(wait);
            callback();
        }
    }, 1000 );
}

function waitForTX(tx, callback) {
    var wait = setInterval( function() {
        if ( isTXMined(tx)) {
            clearInterval(wait);
            callback();
        }
    }, 1000 );
}

function isTXMined(tx){
    if (!Store.web3.eth.getTransaction(tx))
        return false;
    var txBlock = Store.web3.eth.getTransaction(tx).blockNumber;
    if ((txBlock != null) && (parseInt(txBlock) <= parseInt(Store.web3.eth.blockNumber)))
        return true;
    else
        return false;
}


export function getContractEvents(name, callback){
    Store.web3.eth.filter({fromBlock:0, toBlock: 'latest', address: Store.contracts[name].address, topics: []}).get(function(err, result) {
        if (err)
            console.error(err)
        for (var i = 0; i < result.length; i++)
            console.log(result[i]);
        callback(err, result);
    })
}

export function sendContractTX(pvKey, from, to, ABI, functionName, args, value, callback) {
    var payloadData = buildFunctionData(args, functionName, ABI)
    var tx = buildTX({
        to: to,
        from : from,
        value: value,
        data: payloadData
    });
    var serializedTx = signTX(tx, pvKey);
    sendTXs([serializedTx], callback);
}

export function sendToAddress(pvKey, from, to, value, callback) {
    var tx = buildTX({
        to: to,
        from : from,
        value: value,
    });
    var serializedTx = signTX(tx, pvKey);
    sendTXs([serializedTx], callback);
}

export function buildFunctionData(args, functionName, ABI){
    for (var i = 0; i < args.length; i++)
        args[i] = Store.web3.toHex(args[i]);
    var solidityFunction = new web3Func.default('', lodash.default.find(ABI, { name: functionName }), '');
    var payloadData = solidityFunction.toPayload(args).data;
    return payloadData;
}

export function buildTX(data){
    var estimatedGas = Store.web3.eth.estimateGas({
        nonce: data.nonce ? Store.web3.toHex(data.nonce) : Store.web3.toHex(parseInt(Store.web3.eth.getTransactionCount(data.from))),
        gasPrice: Store.web3.toHex(Store.web3.eth.gasPrice),
        gasLimit: Store.web3.toHex(estimatedGas),
        to: data.to || '0x0000000000000000000000000000000000000000',
        from: data.from,
        value: data.value ? Store.web3.toHex(data.value) : '0x0',
        data: data.data ? Store.web3.toHex(data.data) : '0x0'
    }) + 50000;
    var rawTx = {
        nonce: data.nonce ? Store.web3.toHex(data.nonce) : Store.web3.toHex(parseInt(Store.web3.eth.getTransactionCount(data.from))),
        gasPrice: Store.web3.toHex(Store.web3.eth.gasPrice),
        gasLimit: Store.web3.toHex(estimatedGas),
        to: data.to || '0x0000000000000000000000000000000000000000',
        from: data.from,
        value: data.value ? Store.web3.toHex(data.value) : '0x0',
        data: data.data ? Store.web3.toHex(data.data) : '0x0'
    };
    console.log('TX:',rawTx);
    var tx = new Tx.default(rawTx);
    return tx;
}

export function signTX(tx, pvKey){
    tx.sign(new Buffer(pvKey, 'hex'));
    var serializedTx = '0x'+tx.serialize().toString('hex');
    console.log('Serialized TX:',serializedTx);
    return serializedTx;
}

export function sendTXs(txs, callback){
    async.eachOfLimit(txs, 10, function(tx, key, sendCallback){
        Store.web3.eth.sendRawTransaction(tx, function(err, hash){
            if (err){
                console.error(err);
                sendCallback(err, null);
            } else {
                console.log('Hash:', hash);
                waitForTX(hash, function(){
                    Store.web3.eth.getTransactionReceipt(hash, function(err, receipt){
                        console.log('Receipt:', receipt);
                        if (receipt.logs.length > 0)
                            switch (receipt.logs[0].data) {
                                case '0x0000000000000000000000000000000000000000000000000000000000000000':
                                    sendCallback('Unauthorized Access', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000001':
                                    sendCallback('Invalid Block Access', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000002':
                                    sendCallback('Invalid Address', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000003':
                                    sendCallback('Insufficent Balance', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000004':
                                    sendCallback('Vote aldready done', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000005':
                                    sendCallback('Vote already verified', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000006':
                                    sendCallback('Vote not done', receipt);
                                break;
                                case '0x0000000000000000000000000000000000000000000000000000000000000007':
                                    sendCallback('Verifier not set', receipt);
                                break;
                                default:
                                    sendCallback(null, receipt);
                                break;
                            }
                        else
                            sendCallback(null, receipt);
                    })
                })
            }
        });
    },
    callback);
}

export function deployContract(pvKey, from, contractData, abi, params, value, callback) {
    var bytes = abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.default.encodeParams(types, params);
    })[0] || '';
    contractData += bytes;
    var estimatedGas = Store.web3.eth.estimateGas({
        data : contractData
    }) + 50000;
    var rawTx = {
        nonce: Store.web3.toHex(parseInt(Store.web3.eth.getTransactionCount(from))),
        gasPrice: Store.web3.toHex(Store.web3.eth.gasPrice),
        gasLimit: Store.web3.toHex(estimatedGas),
        from: from,
        value: Store.web3.toHex(value),
        data: contractData
    };
    console.log('TX:',rawTx);
    var tx = new Tx.default(rawTx);
    var serializedTx = signTX(tx, pvKey);
    Store.web3.eth.sendRawTransaction(serializedTx, function(err, hash){
        if (err){
            console.error(err);
            callback(err, null);
        } else {
            console.log('Hash:', hash);
            waitForTX(hash, function(){
                Store.web3.eth.getTransactionReceipt(hash, function(err, receipt){
                    console.log('Receipt:', receipt);
                    callback(err, receipt);
                })
            })
        }
    });
}
