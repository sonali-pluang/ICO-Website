// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract EnvToken {
    
    string public name = "ENV Token";
    string public symbol = "ENV";
    string public standard = "ENV Token v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    
    mapping(address => uint256) public balanceOf;
    
    constructor(uint256 _initialSupply)  { 
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}


