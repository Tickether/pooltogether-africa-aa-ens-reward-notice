import { encodeFunctionData } from 'viem';
import { vaultABI } from '@generationsoftware/hyperstructure-client-js';
import { przUSDC } from '../constants/addresses.js';

export const transfer = (address: `0x${string}`, amount: bigint ) => {
    const transferData = encodeFunctionData({
        abi: vaultABI,
        functionName: 'transfer',
        args: [(address), (amount)]
    })

    // Build the transactions
    const transferTx = {
        to: przUSDC,
        data: transferData,
    };
    return transferTx
}