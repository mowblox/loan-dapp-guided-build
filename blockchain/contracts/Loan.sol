// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract Loan is ERC2771Recipient {
    // Collateral Rate 135%
    // uint _collateralRate = 135;

    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    event LoanDisbursed(address indexed, uint);

    // User to take loan
    function takeLoan(uint _loanAmount) public payable {
        // Check If Loan Can be given
        require(address(this).balance > _loanAmount, "No Money at the bank");
        // Check if user has collateral
        require(
            msg.value >= ((_loanAmount * 135) / 100),
            "Not enough collateral"
        );
        // Give the loan
        payable(_msgSender()).transfer(_loanAmount);
        emit LoanDisbursed(_msgSender(), _loanAmount);
    }

    // User to repay loan

    fallback() external payable {}

    receive() external payable {}
}
