import express, { Express, Request, Response } from 'express'
import { config } from './utils/wagmi/config.js'
import { watchContractEvent } from '@wagmi/core'
import { prizePoolABI } from '@generationsoftware/hyperstructure-client-js'
import { getPooler } from './utils/pooler/getPooler.js'
import { PrizePool, Recipient, WETH, przUSDC } from './utils/constants/addresses.js'
import { createSmartAccount, smartUserOP } from './utils/biconomy/smartUserOP.js'
import { sendEmail } from './utils/mail/sendEmail.js'
import { erc20Abi, formatUnits } from 'viem'
import { postPoolerReward } from './utils/pooler/postPoolerReward.js'


const app: Express = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const startEventWatcher = async() => {
  const unwatch = watchContractEvent(config, {
    abi: erc20Abi,
    chainId: 8453,
    address: WETH,
    eventName: 'Transfer',
    args: {
      to: Recipient //static AA wallet address
    },
    /*
    address: PrizePool,
    eventName: 'ClaimedPrize',
    args: {
      vault: przUSDC,
      recipient: Recipient //static AA wallet address
    },
    */
    onLogs(logs) {
      console.log('Logs changed!', logs)
      const winner = logs[0].args.from
      const reward = logs[0].args.value
      //const winner = logs[0].args.winner
      //const reward = logs[0].args.payout
      //const recipient = logs[0].args.recipient
      const ckeckWinnerSwapRewardPoolDepositSendEmail = async () => {
        //get user from pta db
        //const pooler = await getPooler(winner!)

        //ckeck log info for address mathcing one from PTA db
        //if match send winning info to db and send email
        //if (pooler?.address === winner) {
          console.log('winner on susu.club')
          //swap and deposit for winner
          const sendRewardTx = await smartUserOP(
            reward!,
            winner!
          )
          console.log(sendRewardTx)
          //send email
          //console.log(pooler?.email)
          //const amountPrzUSDC = formatUnits(sendRewardTx.amountUSDC, 6)
          //await sendEmail(pooler?.email!, pooler?.ens!, Number(amountPrzUSDC).toFixed(2))
          //post reward info to susu.club DB
          //await postPoolerReward(winner!, recipient!, sendRewardTx.txnHash!, Number(amountPrzUSDC).toFixed(2), 'reward')
        //} else {
          //console.log('winner not on susu.club')
        //}
      }
      ckeckWinnerSwapRewardPoolDepositSendEmail()
      
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
