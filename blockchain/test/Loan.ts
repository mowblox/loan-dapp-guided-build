import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("Loan", function () {
    async function deployLoanFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const Loan = await ethers.getContractFactory("Loan");
        const loan = await Loan.deploy();

        // Send Some Initial Funds to the Bank
        await owner.sendTransaction({ to: await loan.getAddress(), value: 500 })

        return { loan, owner, otherAccount };
    }

    it("There should be 100000 in the bank", async function () {
        const { loan, owner } = await loadFixture(deployLoanFixture);
        expect(await ethers.provider.getBalance(await loan.getAddress()))
            .to.equal(500);
    });

    it("User should be able to take loan", async function () {
        const { loan, owner } = await loadFixture(deployLoanFixture);
        await loan.takeLoan(200, { value: 200 * 1.35 });

        expect(await ethers.provider.getBalance(await loan.getAddress()))
            .to.equal(500 + (0.35 * 200));
    });

    it("Loan Disbursed should be emitted", async function () {
        const { loan, owner, otherAccount } = await loadFixture(deployLoanFixture);

        await expect(loan.connect(otherAccount).takeLoan(200, { value: 200 * 1.35 }))
            .to.emit(loan, "LoanDisbursed")
            .withArgs(otherAccount.address, 200);
    });
})
