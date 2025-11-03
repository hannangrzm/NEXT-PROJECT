// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DonationMetaTx {
    using ECDSA for bytes32;

    // ---------- STRUCT ----------
    struct Campaign {
        uint256 id;
        string title;
        uint256 targetAmount;
        uint256 currentAmount;
        address creator; 
        uint256 timeCreated;
    }

    function createCampaign(
        uint256 _id,
        string memory _title,
        uint256 _targetAmount,
        address _creator
    ) public {
        require(msg.sender == address(this), "Only meta-tx allowed");
        _createCampaign(_id, _title, _targetAmount, _creator);
    }

    // ---------- STORAGE ----------
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;
    mapping(address => uint256) public nonces;

    // ---------- EVENTS ----------
    event CampaignCreated(
        uint256 indexed id,
        string title,
        uint256 targetAmount,
        address creator,
        uint256 timeCreated
    );

    event MetaTransactionExecuted(
        address indexed user,
        address indexed relayer,
        bytes functionSignature
    );

    // ---------- EIP-712 CONSTANTS ----------
    bytes32 private constant META_TRANSACTION_TYPEHASH =
        keccak256(
            bytes(
                "MetaTransaction(uint256 nonce,address from,bytes functionSignature,uint256 value)"
            )
        );

    bytes32 public DOMAIN_SEPARATOR;

    constructor(string memory name, string memory version) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    bytes(
                        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                    )
                ),
                keccak256(bytes(name)),
                keccak256(bytes(version)),
                chainId,
                address(this)
            )
        );
    }

    // ---------- INTERNAL CREATE CAMPAIGN ----------
    function _createCampaign(
        uint256 _id,
        string memory _title,
        uint256 _targetAmount,
        address _creator
    ) internal {
        require(campaigns[_id].id == 0, "Campaign ID already exists");
        require(_targetAmount > 0, "Target must be > 0");

        campaigns[_id] = Campaign({
            id: _id,
            title: _title,
            targetAmount: _targetAmount,
            currentAmount: 0,
            creator: _creator,
            timeCreated: block.timestamp
        });

        campaignCount++;

        emit CampaignCreated(
            _id,
            _title,
            _targetAmount,
            _creator,
            block.timestamp
        );
    }

    // ---------- META TRANSACTION EXECUTION ----------
    function executeMetaTransaction(
        address user,
        bytes memory functionSignature,
        uint256 value,
        bytes memory signature
    ) public payable returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(
                META_TRANSACTION_TYPEHASH,
                nonces[user],
                user,
                keccak256(functionSignature),
                value
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );

        address signer = digest.recover(signature);
        require(signer == user, "Invalid signature");

        nonces[user]++;

        (bool success, bytes memory result) = address(this).call{
            value: msg.value
        }(functionSignature);

        require(success, "Meta transaction failed");

        emit MetaTransactionExecuted(user, msg.sender, functionSignature);
        return result;
    }

    // ---------- VIEW ----------
    function getCampaign(
        uint256 _id
    )
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            uint256,
            address,
            uint256
        )
    {
        Campaign storage c = campaigns[_id];
        return (
            c.id,
            c.title,
            c.targetAmount,
            c.currentAmount,
            c.creator,
            c.timeCreated
        );
    }
}
