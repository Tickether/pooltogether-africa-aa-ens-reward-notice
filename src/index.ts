import express, { Express, Request, Response } from 'express'
import { config } from './config.js'
import { erc20Abi } from 'viem'
import { watchContractEvent } from '@wagmi/core'
import { claimerABI, prizePoolABI } from '@generationsoftware/hyperstructure-client-js'


const app: Express = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const startEventWatcher = async() => {
  const unwatch = watchContractEvent(config, {
    abi: prizePoolABI,
    chainId: 8453,
    address: '0x45b2010d8a4f08b53c9fa7544c51dfd9733732cb',
    eventName: 'ClaimedPrize',
    args: {
      vault: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9'
    },
    onLogs(logs) {
      console.log('Logs changed!', logs)
      //get user from pta db
      //getpooler()
      //ckeck log info for address mathcing one from PTA db
      //if match send winning info to db and send email //winner on susu.club
      //winner not on susu club
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
