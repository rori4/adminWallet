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
* [ ] make nonces and gas prices dynamic (bugfixes)
  * [ ] enable deletion of transactions from the queue, add trash can button to empty queue completely
  * [ ] if a transaction is removed from the queue, adjust nonces of following transactions from that tx's sender
  * [ ] set gas estimate and sign just before sending; store the unsigned tx instead of `signedTx`
* [ ] send transactions through Flashbots
  * maybe just make it easy for the user to switch networks and use the Flashbots RPC endpoint
  * but how would bundles work if we were using flashbots RPC? Would the transactions still be mined atomically if we sent them individually?
    * Doesn't sound like a good idea because if we send independent transactions right around the time a block is mined, some transactions could be split across 2 blocks, which defeats the purpose.
  * CONCLUSION: No Flashbots RPC; send bundles via flashbots relay.
