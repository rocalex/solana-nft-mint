import * as dotenv from 'dotenv'
import * as bs58 from 'bs58'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

dotenv.config();

(async () => {
  const connection = new Connection(process.env.RPC_URL || "http://127.0.0.1:8899", "confirmed")

  const keypair = Keypair.fromSecretKey(
    bs58.decode(process.env.ACCOUNT_PK || "")
  )

  console.log(`${(await connection.getBalance(keypair.publicKey)) / LAMPORTS_PER_SOL} SOL`)
})();