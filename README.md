# Miner-NFT

## Getting Started

To use this fork, you need to have [yarn](https://yarnpkg.com/getting-started/install), [Anchor](https://www.anchor-lang.com/docs/installation) and the [Solana cli suite](https://solana.com/developers/guides/getstarted/setup-local-development) installed on your machine.

It is highly recommended that you start this project from scratch, following along with the tutorial.

To use the fork, follow the steps outlined below:

1. Connect to the devnet Cluster using the Solana CLI:

```bash
solana config set --url https://api.devnet.solana.com
```

2. Create a file system wallet

```bash
solana-keygen new
```

By default, the `solana-keygen` command will create a new file system wallet located at `~/.config/solana/id.json`. You can manually specify the output file location using the `--outfile /path` option.

3. Set your new wallet as the default

```bash
solana config set -k ~/.config/solana/id.json
```

4. Airdrop SOL tokens to your wallet

Once your new wallet is set as the default, you can request a free airdrop of SOL tokens to it:

```bash
solana airdrop 2
```

or using Web Faucet: https://faucet.solana.com/.

You can check your current wallet's address or SOL balance any time:

```bash
solana address
```

```bash
solana balance
```

5. Clone your forked repo.

```bash
git clone https://github.com/<YOUR-USERNAME>/miner-nft
```

6. Change directory into the root of your cloned repo and install missing node packages

```bash
yarn install
```

**NOTE:** You must use yarn to install the dependencies. If you use a different package manager, you will run into issues minting the NFT.

7. Build your anchor project.

```bash
anchor build
```

8. List the project deployment keys and copy the address to a clipboard

```bash
anchor keys list
```

9. Update your [`Anchor.toml`](Anchor.toml) file, by using the address generated in the previous step.

```toml
[programs.devnet]
miner_nft = "<REPLACE WITH YOUR ADDRESS HERE>"
```

10. Update your [`lib.rs`](programs/miner_nft/src/lib.rs) file by adding the the address generated in step 4 to the `declare_id!()` macro

```rust
    // snip
use mpl_token_metadata::{
    pda::{find_master_edition_account, find_metadata_account},
    state::DataV2,
};

declare_id!("<REPLACE WITH YOUR ADDRESS HERE>");
#[program]
pub mod miner_nft {
    // snip
```

11. Build your anchor project.

```bash
anchor build
```

12. Deploy the program

```bash
anchor deploy
```

13. Initialize the program

Update your [`initialize.ts`](scripts/initialize.ts: line 22) file with Total Supply (default: 6700).

```bash
anchor run initialize
```

14. Get IDL

Follow `target/idl/miner_nft.json` to get program IDL for the development purposes.
