# Crowdjury Demo

Demo web app for crowdjury platform.

## Install

`npm install`

##Submodules

### Go-Ethereum

If you need to use the blockchain operations you can build from source the go-ethereum app, follow the instructions here: https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum

### Solcompiler-js

Is an app that runs a script that build teh contracts.json file, for more information go here: https://github.com/AugustoL/solcompiler-js

To use solcompiler-js you will need to set config.json file inside the solcompiler-js folder, specifying the output file and contracts folder, example:

```
{
    "output": "/home/user/crowdjury/src/contracts.json",
    "contractsDir": "/home/user/crowdjury/contracts/"
}
```

## Blockchain Operations

#### Console

This command will gave you access to the geth console, to run this you need to at least have one account generated.

`npm run geth-console`

#### Init

Run this command only once and before you start mining, this will init the blockchain with you genesis.json.

`npm run bkc-init`

#### Mine

`npm run bkc-mine`

You should be running this command meanwhile the app is running, this will mine the transactions on your private network.

#### Accounts

`npm run bkc-accounts [QUANTITY_TO_GENERATE]`

This task create the amount of accounts requested in the same way it does on the app, all the accounts are saved in the accounts.json file inside the blockchain folder, it will also create an admin account that will be use as admin on the simulation of election on the app.

#### Clean

`npm run bkc-clean`

This command will delete all the blockchain data, use it if you want to start a new blockchain from genesis block, after running this command you will need to init the blockchain before start mining with `npm run bkc-init && npm run bkc-mine`.

## Develop

Run `npm start` to develop and enable the hot reloading.

## Build

Run `npm run build` to build the production version.
