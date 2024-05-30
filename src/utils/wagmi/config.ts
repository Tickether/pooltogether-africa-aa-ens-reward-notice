import { http, createConfig } from '@wagmi/core'
import { Chain, base } from '@wagmi/core/chains'
import dotenv from 'dotenv'

dotenv.config();

export const config = createConfig({
  chains: [ base as Chain],
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
  },
})

