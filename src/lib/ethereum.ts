import { BigNumber, Contract, Wallet, providers } from "ethers";

// lib
import { getProvider } from "./provider";
import { QueuedTx } from "../components/TxQueue";

export type EthProvider = providers.BaseProvider | providers.JsonRpcProvider;

export const getTrueName = (contract: Contract, functionName: string) => (
    contract.interface.getFunction(functionName).name
);

export const triggerCall = async (contract: Contract, functionName: string, args: any[], setResult: Function, provider: EthProvider) => {
    const name = getTrueName(contract, functionName);
    const tx = await contract.populateTransaction[name](...args);
    const res = await provider.call(tx);
    const frag = contract.interface.getFunction(functionName);
    const decodedRes = contract.interface.decodeFunctionResult(frag, res)[0];

    setResult(decodedRes.toString());
};

type AppTransactionRequest = {
    args: string[], 
    contract: Contract, 
    functionName: string, 
    gasLimitOverride?: BigNumber, // override for state-dependent transactions (tx that requires state update from a previous tx in the bundle)
    gasPriceOverride?: BigNumber, // override for state-dependent transactions (tx that requires state update from a previous tx in the bundle)
    nonceDelta: number, 
    value: BigNumber,
    wallet: Wallet, 
}

/// Builds a raw TransactionRequest.
export const buildUnsignedTransaction = async (params: AppTransactionRequest): Promise<providers.TransactionRequest> => {
    const {contract,
        functionName,
        args,
        wallet,
        nonceDelta,
        gasLimitOverride,
        value
    } = params;
    const name = getTrueName(contract, functionName);
    let tx = await contract.populateTransaction[name](...args);
    const provider = getProvider();
    const startNonce = await wallet.connect(provider).getTransactionCount();
    const gasLimit = gasLimitOverride ?? (await provider.estimateGas(tx)).mul(2);
    tx = {
        ...tx,
        from: tx.from || wallet.address,
        nonce: startNonce + nonceDelta,
        gasLimit,
        value,
    };
    console.log("tx", tx);
    return tx;
};

/// Gets latest gas price from provider.
const getLatestGasPrice = async () => {
    const provider = getProvider();
    const extra_gas = BigNumber.from(1e9).mul(20); // add 20 gwei to gas price
    return (await provider.getBlock(provider.getBlockNumber())).baseFeePerGas?.add(extra_gas);
}

/// Gets latest gas price and returns transactions with updated gas prices.
export const updateGasPrices = async (queuedTxs: QueuedTx[], gasPriceOverride?: BigNumber) => {
    const gasPrice = gasPriceOverride ?? await getLatestGasPrice();
    return queuedTxs.map(qtx => (
        {
            ...qtx,
            tx: {
                ...qtx.tx,
                gasPrice,
            }
        }
    ));
}

/// Sends transactions straight to the mempool (non-atomic).
export const sendMempoolBundle = async (queuedTxs: QueuedTx[], gasPriceOverride?: BigNumber) => {
    // assign fresh gas prices
    const updatedTransactions = await updateGasPrices(queuedTxs, gasPriceOverride);
    // TODO: update nonces to all transactions here as well

    // sign transactions
    const signedTransactionsPromises = updatedTransactions.map(tx => tx.wallet.wallet.signTransaction(tx.tx));
    Promise.all(signedTransactionsPromises).then(signedTransactions => {
        const provider = getProvider();
        // send each transaction asynchronously
        const txPromises = signedTransactions.map(tx => {
            return provider.sendTransaction(tx);
        });
    
        Promise.all(txPromises).then(txResults => {
            console.log(txResults);
        });
    });
};
