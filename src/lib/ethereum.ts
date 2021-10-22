import { Contract, Wallet, providers, utils } from "ethers";

export type EthProvider = providers.BaseProvider | providers.JsonRpcProvider;

const getTrueName = (contract: Contract, functionName: string) => (
    contract.interface.getFunction(functionName).name
);

const triggerCall = async (contract: Contract, functionName: string, args: any[], setResult: Function, provider: providers.BaseProvider) => {
    const name = getTrueName(contract, functionName);
    const tx = await contract.populateTransaction[name](...args);
    const res = await provider.call(tx);
    try {
      setResult(utils.toUtf8String(res));
    } catch (e) {
      setResult(res.toString());
    }
};

const buildSignedTransaction = async (contract: Contract, functionName: string, args: string[], wallet: Wallet, nonceDelta: number) => {
    const name = getTrueName(contract, functionName);
    let tx = await contract.populateTransaction[name](...args);
    const startNonce = await wallet.getTransactionCount();
    tx = {
        ...tx,
        from: tx.from || wallet.address,
        nonce: startNonce + nonceDelta,
    };
    console.log(tx);
    return await wallet.signTransaction(tx);
};

export { triggerCall, buildSignedTransaction };
