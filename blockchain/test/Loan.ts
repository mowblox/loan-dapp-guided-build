import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";

describe("Loan", function () {
    async function deployLoanFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const Loan = await ethers.getContractFactory("Loan");
        const loan = await Loan.deploy();

        return { loan, owner, otherAccount };
    }

    it("User should be able to take loan", async function () {
        const { loan, owner } = await loadFixture(deployLoanFixture);
        await loan.takeLoan(200, { value: 200 * 1.35 });
    });

    it("Loan Disbursed should be emitted", async function () {
        const { loan, owner, otherAccount } = await loadFixture(deployLoanFixture);

        await expect(
            loan.connect(otherAccount).takeLoan(200, { value: 200 * 1.35 })
        )
            .to.emit(loan, "LoanDisbursed")
            .withArgs(otherAccount.address, 300);
    });
})
