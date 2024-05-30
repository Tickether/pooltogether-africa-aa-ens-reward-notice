import { walletClient } from '../viem/client.js'
import { BiconomySmartAccountV2, createSmartAccountClient } from '@biconomy/account'
import dotenv from 'dotenv'
import { config } from '../wagmi/config.js';
import { simulateContract } from '@wagmi/core';
import { QUOTER } from '../constants/addresses.js';
import { quoterABI } from '../abis/quoterABI.js';
import { SwapRouterParams } from '../abis/swapRouterABI.js';

dotenv.config();

export const smartUserOP = async(swapRouterParams: SwapRouterParams) => {
    let smartAccount: BiconomySmartAccountV2 | undefined = undefined
    let smartAccountAddress: `0x${string}` | undefined = undefined
    const createSmartAccount = async () => {
        if (!walletClient) return;

        
        const smartAccountFromStaticCreate = await createSmartAccountClient({
            signer: walletClient,
            bundlerUrl: process.env.BICONOMY_BUNDLER_URL as string, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
            biconomyPaymasterApiKey: process.env.BICONOMY_PAYMASTER_API_KEY as string, // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
        });
      
        const address = await smartAccountFromStaticCreate.getAccountAddress();
        smartAccountAddress = (address);
        smartAccount = (smartAccountFromStaticCreate);
    };
    await createSmartAccount()
    //simulate quoter from uniswap
    const quoterParams = {
        tokenIn: (swapRouterParams.tokenIn),
        tokenOut: (swapRouterParams.tokenOut),
        amountIn: (swapRouterParams.amountIn),
        fee: (500),
        sqrtPriceLimitX96: BigInt(0),
    }
    const qoutes = await simulateContract(config, {
        abi: quoterABI,
        address: QUOTER,
        functionName: 'quoteExactInputSingle',
        args: [(quoterParams)],
      })
    const swapRewardPoolDeposit = async() => {

        
    }
    await swapRewardPoolDeposit()
}
