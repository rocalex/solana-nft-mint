import * as dotenv from 'dotenv'
import * as bs58 from 'bs58'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { actions, NodeWallet } from '@metaplex/js';
import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata';

dotenv.config();

(async () => {
  const connection = new Connection(process.env.RPC_URL || "http://127.0.0.1:8899", "confirmed")

  const userKeypair = Keypair.fromSecretKey(
    bs58.decode(process.env.ACCOUNT_PK || "")
  )

  console.log(`${(await connection.getBalance(userKeypair.publicKey)) / LAMPORTS_PER_SOL} SOL`)

  const mintAccount = await Token.createMint(
    connection,
    userKeypair,
    userKeypair.publicKey,
    null,
    0,
    TOKEN_PROGRAM_ID
  )

  console.log(mintAccount.publicKey.toString())

  const userAssosciatedAccount = await mintAccount.getOrCreateAssociatedAccountInfo(
    userKeypair.publicKey
  )

  await mintAccount.mintTo(
    userAssosciatedAccount.address,
    userKeypair.publicKey,
    [],
    1
  )
  
  let metadataData = new MetadataDataData({
    name: "Test",
    symbol: "FOO",
    uri: "https://v6ahotwazrvostarjcejqieltkiy5ireq7rwlqss4iezbgngakla.arweave.net/r4B3TsDMaulMEUiImCCLmpGOoiSH42XCUuIJkJmmApY/",
    sellerFeeBasisPoints: 500,
    creators: null
  })

  const res = await actions.createMetadata({
    connection,
    wallet: new NodeWallet(userKeypair),
    metadataData,
    editionMint: mintAccount.publicKey
  })

  console.log(res)

  await mintAccount.setAuthority(
    mintAccount.publicKey,
    null,
    "MintTokens",
    userKeypair.publicKey,
    []
  )

})();