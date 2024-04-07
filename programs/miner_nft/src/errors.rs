use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrors {
    // 6000 0x1770
    #[msg("Total supply exceeded")]
    TotalSupplyExceeded,

    // 6001 0x1771
    #[msg("NFT already minted")]
    NFTAlreadyMinted,
}
