// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {ERC20, EIP712, ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import {IMultiSigWallet} from './IMultiSigWallet.sol';

/// @title Multisignature wallet - Allows multiple parties to agree on transactions before execution.
/// @author Stefan George - <stefan.george@consensys.net>
contract StablecoinImpl is ERC20Permit {
    IMultiSigWallet multiSigWallet;
    mapping(address => bool)  isFrozen;

    event FrozenStatus(address indexed from, address indexed who, bool status);

    constructor(string memory _name, string memory _symbol, address _wallet) ERC20(_name, _symbol) ERC20Permit(_name) {
        multiSigWallet = IMultiSigWallet(_wallet);
    }



    modifier onlyMultisigOwner () {
        require(multiSigWallet.isOwner(msg.sender), "only multisig owner");
        _;
    }

    modifier onlyMultisig () {
        require(address(multiSigWallet) == msg.sender, "only multisig");
        _;
    }



    function mint(address _who, uint256 amount) onlyMultisig external {
        _mint(_who, amount);
    }


    function burn(address _who, uint256 amount) onlyMultisig  external {
        _burn(_who, amount);
    }


    function freeze(address _who) onlyMultisigOwner external {
        isFrozen[_who] = true;
        emit FrozenStatus(msg.sender, _who, true);
    }


    function unfreeze(address _who) onlyMultisigOwner external  {
        isFrozen[_who] = false;
        emit FrozenStatus(msg.sender, _who, false);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(!isFrozen[from], "from frozen");
        require(!isFrozen[to], "to frozen");
    }
}
