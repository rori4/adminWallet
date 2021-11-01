import { providers } from "ethers";

export type IQueuedTx = {
    walletKey: string,
    tx: providers.TransactionRequest,
}
