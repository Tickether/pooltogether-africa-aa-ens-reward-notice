import { encodeFunctionData } from 'viem';
import { przUSDC } from '../constants/addresses.js';
import { vaultABI } from '@generationsoftware/hyperstructure-client-js';

export const deposit = (amount: bigint, address: `0x${string}`) => {
    const depositData = encodeFunctionData({
        abi: vaultABI,
        functionName: 'deposit',
        args: [(amount), (address)]
    })

    // Build the transactions
    const depositTx = {
        to: przUSDC,
        data: depositData,
    };
    return depositTx
}