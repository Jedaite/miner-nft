use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, Default)]
pub struct ContractData {
    pub bump: u8,
    pub authority: Pubkey,
    pub supply: u16,
    pub total_supply: u16,
}

impl ContractData {
    pub const SEED: &'static [u8] = b"contractdata";
}

#[account]
#[derive(InitSpace, Default)]
pub struct UserData {
    pub nft_mint: Option<Pubkey>,
}

impl UserData {
    pub const SEED: &'static [u8] = b"userdata";
}
