import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MinerNft } from "../target/types/miner_nft";

describe("miner-nft", async () => {
  // Configured the client to use the devnet cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MinerNft as Program<MinerNft>;

  // Anchor.toml: wallet = "~/.config/solana/id.json"
  const signer = provider.wallet;

  const contractDataPDA = (): [anchor.web3.PublicKey, number] => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("contractdata")],
      program.programId
    );
  };

  const TOTAL_SUPPLY = 6700; // Specify Total Supply of Miner NFT (max number of NFT can be minted by the program)

  it("Initialize", async () => {
    try {
      const tx = await program.methods
        .initialize(TOTAL_SUPPLY)
        .accounts({
          contractData: contractDataPDA()[0],
          authority: signer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Your transaction signature", tx);
      console.log("Contract data:", await program.account.contractData.all());
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
