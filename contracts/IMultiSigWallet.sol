// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IMultiSigWallet {
    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Revocation(address indexed sender, uint256 indexed transactionId);
    event Submission(uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    event Deposit(address indexed sender, uint256 value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint256 required);

    function addOwner(address owner) external;

    function isOwner(address owner) external returns (bool);

    function removeOwner(address owner) external;

    function replaceOwner(address owner, address newOwner) external;

    function changeRequirement(uint256 _required) external;

    function submitTransaction(
        address destination,
        uint256 value,
        bytes memory data
    ) external;

    function confirmTransaction(uint256 transactionId) external;

    function revokeConfirmation(uint256 transactionId) external;

    function executeTransaction(uint256 transactionId) external;

    function isConfirmed(uint256 transactionId) external view returns (bool);

    function getConfirmationCount(uint256 transactionId)
        external
        view
        returns (uint256 count);

    function getTransactionCount(bool pending, bool executed) external view;

    function getOwners() external view returns (address[] memory);

    function getConfirmations(uint256 transactionId)
        external
        view
        returns (address[] memory _confirmations);

    function getTransactionIds(
        uint256 from,
        uint256 to,
        bool pending,
        bool executed
    ) external view returns (uint256[] memory _transactionIds);
}
