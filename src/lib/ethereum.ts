import { BigNumber, Contract, Wallet, providers } from "ethers";
import { getProvider } from "./provider";

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

type SignedTransactionRequest = {
    args: string[], 
    contract: Contract, 
    functionName: string, 
    gasLimitOverride?: BigNumber, // override for state-dependent transactions (tx that requires state update from a previous tx in the bundle)
    gasPriceOverride?: BigNumber, // override for state-dependent transactions (tx that requires state update from a previous tx in the bundle)
    nonceDelta: number, 
    value: BigNumber,
    wallet: Wallet, 
}

export const buildSignedTransaction = async (params: SignedTransactionRequest) => {
    const {contract,
        functionName,
        args,
        wallet,
        nonceDelta,
        gasLimitOverride,
        gasPriceOverride,
        value
    } = params;
    const name = getTrueName(contract, functionName);
    let tx = await contract.populateTransaction[name](...args);
    const startNonce = await wallet.getTransactionCount();
    const provider = getProvider();
    const extra_gas = BigNumber.from(1e9).mul(20); // add 20 gwei to gas price
    const gasPrice = gasPriceOverride ?? (await provider.getBlock(provider.getBlockNumber())).baseFeePerGas?.add(extra_gas);
    const gasLimit = gasLimitOverride ?? (await provider.estimateGas(tx)).mul(2);
    console.log("gas price", gasPrice);
    tx = {
        ...tx,
        from: tx.from || wallet.address,
        nonce: startNonce + nonceDelta,
        gasPrice,
        gasLimit,
        value,
    };
    console.log("tx", tx);
    return await wallet.signTransaction(tx);
};

export const sendMempoolBundle = async (signedTransactions: string[]) => {
  const provider = getProvider();
  // send each transaction asynchronously
  const txPromises = signedTransactions.map(tx => {
    return provider.sendTransaction(tx);
  });

  Promise.all(txPromises).then(txResults => {
    console.log(txResults);
  })
};