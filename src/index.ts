import express, { Express, Request, Response } from 'express'
import { config } from './utils/wagmi/config.js'
import { watchContractEvent } from '@wagmi/core'
import { prizePoolABI } from '@generationsoftware/hyperstructure-client-js'
import { getPooler } from './utils/pooler/getPooler.js'
import { PrizePool } from './utils/constants/addresses.js'


const app: Express = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const startEventWatcher = async() => {
  const unwatch = watchContractEvent(config, {
    abi: prizePoolABI,
    chainId: 8453,
    address: PrizePool,
    eventName: 'ClaimedPrize',
    args: {
      vault: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
      recipient: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9' //static AA wallet address
    },
    onLogs(logs) {
      console.log('Logs changed!', logs)
      const winner = logs[0].args.winner
      const ckeckWinnerSwapRewardPoolDepositSendEmail = async () => {
        //get user from pta db
        const pooler = await getPooler(winner!)

        //ckeck log info for address mathcing one from PTA db
        //if match send winning info to db and send email
        if (pooler?.address === winner) {
          console.log('winner on susu.club')
          //send email
          console.log(pooler?.email)
        } else {
          console.log('winner not on susu.club')
        }
      }
      
    },
    onError(err) {
      console.log('err found!', err)
    }
  })

  // Log that watching has started
  console.log("Started watching contract events");
};


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  startEventWatcher()
  
});
