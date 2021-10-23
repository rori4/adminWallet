# ETH tx bundler app

* web app; basically etherscan but with multiple transactions and flashbots integration
* enter contract address and get buttons that allow you to send transactions or add them to an orderd list
* transactions in the list can then be sent as a flashbots bundle or a normal (mempool) nonce-sequenced array of transactions

## TODO

* [x] build contracts from contract address & Etherscan ABI
* [x] enable param detection & inputs
* [x] enable use of multiple signers (e.g. "donor", "bundle signer")
* [x] enable type detection for calls
* [x] create an ordered list for transactions
* [x] enable sends (add wallets)
* [x] send transactions from the ordered list in nonce-assigned order
* [ ] send transactions through Flashbots (maybe just make it easy for the user to switch networks and use the Flashbots RPC endpoint)
