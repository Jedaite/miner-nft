import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MinerNft } from "../target/types/miner_nft";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("miner-nft", async () => {
  // Configured the client to use the devnet cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MinerNft as Program<MinerNft>;

  const signer = provider.wallet; // wallet addr user PK

  const mint = anchor.web3.Keypair.generate();

  // Derive the associated token address account for the mint
  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    signer.publicKey
  );

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const metadataPDA = ({
    mint,
  }: {
    mint: anchor.web3.PublicKey;
  }): [anchor.web3.PublicKey, number] =>
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

  const masterEditionPDA = ({
    mint,
  }: {
    mint: anchor.web3.PublicKey;
  }): [anchor.web3.PublicKey, number] =>
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

  // derive the metadata account
  const metadataAccount = metadataPDA({
    mint: mint.publicKey,
  })[0];

  //derive the master edition pda
  const masterEditionAccount = masterEditionPDA({
    mint: mint.publicKey,
  })[0];

  const metadata = {
    name: "Miner",
    symbol: "MNR",
    description: "Miner-citizen",
    uri: "https://ipfs.io/ipfs/QmVd1vycX55yBiADtoizVTyctLM1ziU7vfoRdxQEwbxioS",
  };

  const contractDataPDA = (): [anchor.web3.PublicKey, number] => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("contractdata")],
      program.programId
    );
  };

  const userDataPDA = (
    walletAddress: anchor.web3.PublicKey
  ): [anchor.web3.PublicKey, number] => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("userdata"), walletAddress.toBuffer()],
      program.programId
    );
  };

  it("Initialize", async () => {
    const tx = await program.methods
      .initialize(6700)
      .accounts({
        contractData: contractDataPDA()[0],
        authority: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);
    console.log("Contract data:", await program.account.contractData.all());
  });

  it("Mint NFT", async () => {
    const tx = await program.methods
      .mintNft(metadata.name, metadata.symbol, metadata.uri)
      .accounts({
        signer: signer.publicKey,
        mint: mint.publicKey,
        associatedTokenAccount,
        metadataAccount,
        masterEditionAccount,
        contractData: contractDataPDA()[0],
        userData: userDataPDA(signer.publicKey)[0],
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();

    console.log(
      `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
  });
});
