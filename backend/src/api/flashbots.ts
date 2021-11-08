import { BigNumber, Wallet } from 'ethers';
import { Request, Response, NextFunction } from 'express';

// lib
import { sendFlashbotsBundle } from "../lib/flashbots";
import { IQueuedTx } from '../lib/interfaces';

type SendBundleRequest = {
    sponsorWalletKey: string,
    transactions: IQueuedTx[],
    simulationOnly: boolean,
}

/// send bundle to flashbots
export const sendBundle = async (req: Request, res: Response, _next: NextFunction) => {
    let data: SendBundleRequest = req.body;
    const transactions = data.transactions.map(txReq => ({
        ...txReq,
        tx: {
            ...txReq.tx,
            gasLimit: txReq.tx.gasLimit ? BigNumber.from(txReq.tx.gasLimit) : undefined,
            value: txReq.tx.value ? BigNumber.from(txReq.tx.value) : undefined,
        },
    }));
    const flashbotsRes = await sendFlashbotsBundle(transactions, new Wallet(data.sponsorWalletKey), data.simulationOnly);
    res.status(200).send(flashbotsRes);
}
