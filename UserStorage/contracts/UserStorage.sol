// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;
contract UserStorage {

   struct User {
       address userAddress;
       string userPublicKey;

       bool set; // This boolean is used to differentiate between unset and zero struct values
   }

   mapping(string => User) public users;

   function createUser(address _userAddress, string memory _username, string memory _userPublicKey) public {
       User storage user = users[_username];

       // Check that the user did not already exist:
       require(!user.set);

       //Store the user
       users[_username] = User({
           userAddress: _userAddress,
           userPublicKey: _userPublicKey,
           set: true
       });
   }

}
