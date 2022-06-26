//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./gnosis/GnosisSafeProxyFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BleepJarContract {
    address constant safeContractFactory = 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2;
    address constant safeMasterContract = 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552;

    struct BleepJar {
        string name;
        address tokenAddress; // where token will be taken from
        uint256 tokenAmount; // amount of token to take per fup
    }

    // Map of gnosis safe address to internal storage
    mapping (address => BleepJar) jars;
    // Map of wallets to jars
    mapping (address => address[]) myJars;

    function createJar(string memory name, address[] memory members, uint threshold) external returns (address) {
        // create a jar and gnosis safe to store funds
        BleepJar memory jar;
        jar.name = name;
        GnosisSafeProxyFactory factory = GnosisSafeProxyFactory(safeContractFactory);
        address gnosisProxy = address(uint160(uint(keccak256(abi.encodePacked(block.timestamp))))); //address(factory.createProxy(safeMasterContract, ""));
        jars[gnosisProxy] = jar;

        // add jar to all members
        uint arrayLength = members.length;
        for (uint i=0; i<arrayLength; i++) {
            myJars[members[i]].push(gnosisProxy);
        }
        return gnosisProxy;
    }

    function getMyJars() public view returns (address[] memory) {
        return myJars[msg.sender];
    }

    function getJar(address jar) public view returns (BleepJar memory) {
        return jars[jar];
    }

    function iFedUp(address jar) external {
        theyFedUp(msg.sender, jar);
    }

    function theyFedUp(address they, address jar) public {
        ERC20 source = ERC20(jars[jar].tokenAddress);
        source.transferFrom(they, jar, jars[jar].tokenAmount);
    }

}
