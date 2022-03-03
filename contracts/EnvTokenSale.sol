pragma solidity 0.8.11;

import "./EnvToken.sol";

contract EnvTokenSale {
    address admin;
    EnvToken public tokenContract;
    uint256 public tokenPrice;

    constructor (EnvToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}