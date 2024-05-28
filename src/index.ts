import express, { Express, Request, Response } from 'express'
import { config } from './config.js'
import { erc20Abi } from 'viem'
import { watchContractEvent } from '@wagmi/core'


const app: Express = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const startEventWatcher = () => {
  const unwatch = watchContractEvent(config, {
    abi: erc20Abi,
    chainId: 8453,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    eventName: 'Transfer',
    onLogs(logs) {
      console.log('Logs changed!', logs)
      //get users from pta db
      //ckeck log info for address mathcing one from PTA db
      //if match send winning info to db
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
