import { Chain, createPublicClient, createWalletClient, http } from 'viem'
import { base } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import dotenv from 'dotenv'

dotenv.config();

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`) 

export const publicClient = createPublicClient({
  chain: base as Chain,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
})

export const walletClient = createWalletClient({
  account,
  chain: base as Chain,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
})
