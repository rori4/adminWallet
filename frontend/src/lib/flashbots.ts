import axios from "axios";
import { Wallet } from "ethers";

// lib
import { QueuedTx } from "../components/TxQueue";

/// Sends bundle to backend, which sends it to flashbots.
export const sendFlashbotsBundle = async (queuedTxs: QueuedTx[], sponsorWallet: Wallet) => {
    // map queuedTx to IQueuedTx (map wallet to wallet.privateKey)
    const transactions = queuedTxs.map(tx => (
      {
        tx: {
          ...tx.tx,
          gasLimit: tx.tx.gasLimit?.toString(),
          value: tx.tx.value?.toString(),
        },
        walletKey: tx.wallet.wallet.privateKey,
      }
    ));
    const sponsorWalletKey = sponsorWallet.privateKey;
    const reqData = {
      sponsorWalletKey,
      transactions,
    };
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (backendUrl) {
      const res = await axios.post(`${backendUrl}/flashbots`, reqData);
      console.log("res", res);
    }
}
