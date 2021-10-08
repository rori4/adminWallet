# ETH tx bundler app

* web app; basically etherscan but with multiple transactions and flashbots integration
* enter contract address and get buttons that allow you to send transactions or add them to an orderd list
* transactions in the list can then be sent as a flashbots bundle or a normal (mempool) nonce-sequenced array of transactions

## TODO

* [ ] enable metamask integration
* [ ] enable use of multiple signers (donor, bundle signer)
* [ ] enable type detection for calls
* [ ] enable param input & sends
* [ ] create an ordered list for transactions
* [ ] send transactions from the ordered list in nonce-assigned order
* [ ] send transactions through Flashbots (maybe just make it easy for the user to switch networks and use the Flashbots RPC endpoint)
