// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract VotingAccessControl is AccessControl {
    bytes32 public constant ELECTION_OFFICER_ROLE = keccak256("ELECTION_OFFICER_ROLE");

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ELECTION_OFFICER_ROLE, admin);
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    modifier onlyOfficer() {
        require(hasRole(ELECTION_OFFICER_ROLE, msg.sender), "Caller is not an officer");
        _;
    }

    function addOfficer(address officer) external onlyAdmin {
        grantRole(ELECTION_OFFICER_ROLE, officer);
    }

    function removeOfficer(address officer) external onlyAdmin {
        revokeRole(ELECTION_OFFICER_ROLE, officer);
    }

    function isAdmin(address account) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isOfficer(address account) public view returns (bool) {
        return hasRole(ELECTION_OFFICER_ROLE, account);
    }
}
