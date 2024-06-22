import express, { Express, Request, Response } from 'express'
import { config } from './utils/wagmi/config.js'
import { watchContractEvent } from '@wagmi/core'
import { prizePoolABI } from '@generationsoftware/hyperstructure-client-js'
import { getPooler } from './utils/pooler/getPooler.js'
import { PrizePool, Recipient, suPrzUSDC } from './utils/constants/addresses.js'
import { createSmartAccount, smartUserOP } from './utils/biconomy/smartUserOP.js'
import { sendEmail } from './utils/mail/sendEmail.js'
import { formatUnits } from 'viem'
import { postPoolerReward } from './utils/pooler/postPoolerReward.js'


const app: Express = express();
const port = process.env.PORT || 8000;
let unwatch: (() => void) | undefined;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const ckeckWinnerSwapRewardPoolDepositSendEmail = async (log: any, index: number) => {
  const winner = log.args.winner
  const reward = log.args.payout
  if (reward! === BigInt(0)) return;
  const recipient = log.args.recipient
  console.log(`doing log ${index}`)
  console.log(log)

  //get user from pta db
  const pooler = await getPooler(winner!)

  //ckeck log info for address mathcing one from PTA db
  //if match send winning info to db and send email
  if (pooler?.address === winner) {
    console.log('winner on susu.club')
    //swap and deposit for winner
    const sendRewardTx = await smartUserOP(
      reward!,
      winner!
    )
    console.log(sendRewardTx)
    //send email
    console.log(pooler?.email)
    const amountPrzUSDC = formatUnits(sendRewardTx?.amountUSDC!, 6)
    if (sendRewardTx?.txnHash) {
      await sendEmail(pooler?.email!, pooler?.ens!, Number(amountPrzUSDC).toFixed(2))
      //post reward info to susu.club DB
      await postPoolerReward(winner!, recipient!, sendRewardTx?.txnHash!, Number(amountPrzUSDC).toFixed(2), 'reward')
    }
  } 
  /*
  else {
    console.log('winner not on susu.club')
    const sendRewardTx = await smartUserOP(
      reward!,
      winner!
    )
    console.log(sendRewardTx)
  }
  */
}
const loopLogs = async(logs: any) => {
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    await ckeckWinnerSwapRewardPoolDepositSendEmail(log, i)
  }
}

const startEventWatcher = async() => {
  // Unwatch previous events if already watching
  if (unwatch) {
    unwatch();
    console.log("Stopped previous event watcher");
  }

  unwatch = watchContractEvent(config, {
    abi: prizePoolABI,
    chainId: 8453,
    address: PrizePool,
    eventName: 'ClaimedPrize',
    args: {
      recipient: Recipient //static AA wallet address
    },
    onLogs(logs) {
      
      //loop logs
      loopLogs(logs)
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
  createSmartAccount()
});
