// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Loan {
    // Collateral Rate 135%
    // uint _collateralRate = 135;

    event LoanDisbursed(address, uint);

    // User to take loan
    function takeLoan(uint _loanAmount) public payable {
        // Check If Loan Can be given
        // require(address(this).balance > _loanAmount, "No Money at the bank");
        // Check if user has collateral
        require(
            msg.value >= ((_loanAmount * 135) / 100),
            "Not enough collateral"
        );
        // Give the loan
        payable(msg.sender).transfer(_loanAmount);
        emit LoanDisbursed(msg.sender, _loanAmount);
    }

    // User to repay loan
}
