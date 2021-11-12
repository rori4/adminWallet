# adminWallet

* web app; basically etherscan but with multiple transactions and flashbots integration
* enter contract address and get buttons that allow you to send transactions or add them to an orderd list
* transactions in the list can then be sent as a flashbots bundle or a normal (mempool) nonce-sequenced array of transactions

## how to use

First, create and fill in all your .env files.

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp hardhat/.env.example hardhat/.env

# use vim because it's better
```

You'll need 2-3 separate terminals to run the system, depending on whether you want to run local mainnet simulations with hardhat.

Terminal 1

```sh
cd backend

# first time only
yarn install

yarn dev
```

Terminal 2

```sh
cd frontend

# first time only
yarn install

yarn start
```

Terminal 3 (Optional)

```sh
cd hardhat
npx hardhat node
```

## TODO

* [x] build contracts from contract address & Etherscan ABI
* [x] enable param detection & inputs
* [x] enable use of multiple signers (e.g. "donor", "bundle signer")
* [x] enable type detection (calls/sends)
* [x] create an ordered list for transactions
* [x] enable sends (add wallets)
* [x] send transactions from the ordered list in nonce-assigned order
* [x] add trash can button to empty queue
* [x] make gas prices dynamic
  * [x] set gas estimate and sign just before sending; store the unsigned tx instead of `signedTx`
* [ ] make nonces dynamic
  * [ ] allow user to manually assign nonces in transaction queue (and/or a "refresh" button that auto-assigns all nonces based on tx count from provider)
* [x] allow user to send ETH
* [ ] backend take PROVIDER_URL from frontend (except when sending to Flashbots) (replace .env var)
* [x] send transactions through Flashbots
  * [x] send bundles via flashbots relay.
  * [x] skirt CORS by using a locally-hosted backend
* [ ] handle exceptions when submitting bad transactions

## future features (hard mode)

* [ ] deploy/use flash loans in bundle
* [ ] run burner(s) in background, 
* [ ] monitor bundle status in frontend

## neat

**First successful bundle sent with adminWallet:**

1. [Deposit ETH to Hardhat Address 13](https://etherscan.io/tx/0xa48974d218d7ccd904e20143f39791f5f093b0aba9fdc0ad915833bc4b5b2370)
2. [Mint wETH with Hardhat Address 13](https://etherscan.io/tx/0xb3448a5a35f9c4df9fa3cdcaaa4f101f98fc177edcb3f9cdbe686099de02cdab)

There are plenty of sweepers on the hardhat accounts, so this would be impossible without Flashbots.
