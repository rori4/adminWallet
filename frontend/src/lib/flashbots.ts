import axios from "axios";
import { Wallet } from "ethers";

// lib
import { QueuedTx } from "../components/TxQueue";

/// Sends bundle to backend, which sends it to flashbots.
export const sendFlashbotsBundle = async (queuedTxs: QueuedTx[], sponsorWallet: Wallet, simulationOnly: boolean) => {
    // map queuedTx params (includes frontend display data) to raw tx params (tx data only)
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
      simulationOnly,
    };
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    if (backendUrl) {
      try {
        const res = await axios.post(`${backendUrl}/flashbots`, reqData);
        if (res.status === 200) {
          return res.data;
        } else {
          console.error("flashbots bundle was not accepted", res);
          return undefined;
        }        
      } catch (e) {
        console.error("failed to send flashbots bundle", e);
      }
    } else {
      return undefined;
    }
}
