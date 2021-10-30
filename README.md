# adminWallet

* web app; basically etherscan but with multiple transactions and flashbots integration
* enter contract address and get buttons that allow you to send transactions or add them to an orderd list
* transactions in the list can then be sent as a flashbots bundle or a normal (mempool) nonce-sequenced array of transactions

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
* [ ] send transactions through Flashbots
  * [x] send bundles via flashbots relay.
  * [ ] fuckin' CORS
