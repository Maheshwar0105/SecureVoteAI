const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem Smart Contract", function () {
  let votingSystem;
  let admin, officer, voter1, voter2;

  beforeEach(async function () {
    [admin, officer, voter1, voter2] = await ethers.getSigners();

    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
    await votingSystem.waitForDeployment();

    // Setup officer role
    const ELECTION_OFFICER_ROLE = await votingSystem.ELECTION_OFFICER_ROLE();
    await votingSystem.grantRole(ELECTION_OFFICER_ROLE, officer.address);
  });

  describe("Access Control", function () {
    it("should grant Admin role to deployer", async function () {
      expect(await votingSystem.isAdmin(admin.address)).to.be.true;
    });

    it("should allow Admin to assign and remove Officer role", async function () {
      await votingSystem.addOfficer(voter1.address);
      expect(await votingSystem.isOfficer(voter1.address)).to.be.true;

      await votingSystem.removeOfficer(voter1.address);
      expect(await votingSystem.isOfficer(voter1.address)).to.be.false;
    });
  });

  describe("Election Lifecycle", function () {
    it("should allow officers to create scheduled elections", async function () {
      const start = Math.floor(Date.now() / 1000) + 100;
      const end = start + 3600;

      await expect(votingSystem.connect(officer).createElection("Presidential Runoff", start, end))
        .to.emit(votingSystem, "ElectionCreated")
        .withArgs(1, "Presidential Runoff", start, end);

      const election = await votingSystem.elections(1);
      expect(election.title).to.equal("Presidential Runoff");
      expect(election.status).to.equal(0); // Scheduled status
    });

    it("should reject invalid election dates", async function () {
      const start = Math.floor(Date.now() / 1000) + 1000;
      const end = start - 100; // End time before start time

      await expect(votingSystem.connect(officer).createElection("Invalid dates", start, end))
        .to.be.revertedWith("End time must be after start time");
    });
  });

  describe("Ballot Casting & Tallying", function () {
    let start, end;

    beforeEach(async function () {
      start = Math.floor(Date.now() / 1000) - 3600; // set to 1h ago to bypass timing checks
      end = start + 7200;

      await votingSystem.connect(officer).createElection("Student Council", start, end);
      await votingSystem.connect(officer).registerCandidate(1, "Sarah Connor", "Tech Alliance");
      await votingSystem.connect(officer).registerCandidate(1, "John Connor", "Future Front");
    });

    it("should prevent voting if the election has not been marked Active", async function () {
      await expect(votingSystem.connect(voter1).vote(1, 1))
        .to.be.revertedWith("Election is not active");
    });

    it("should record votes and prevent double voting when Active", async function () {
      await votingSystem.connect(officer).startElection(1);

      // Cast vote
      await expect(votingSystem.connect(voter1).vote(1, 1))
        .to.emit(votingSystem, "VoteCasted")
        .withArgs(1, voter1.address, 1);

      expect(await votingSystem.hasVoted(1, voter1.address)).to.be.true;

      // Double vote block check
      await expect(votingSystem.connect(voter1).vote(1, 2))
        .to.be.revertedWith("You have already casted a vote in this election");
    });

    it("should calculate correct winner after ending election", async function () {
      await votingSystem.connect(officer).startElection(1);

      // Voter1 votes for Sarah (candidate 1)
      await votingSystem.connect(voter1).vote(1, 1);
      // Voter2 votes for Sarah (candidate 1)
      await votingSystem.connect(voter2).vote(1, 1);

      await expect(votingSystem.connect(officer).endElection(1))
        .to.emit(votingSystem, "ElectionEnded")
        .withArgs(1, 1, "Sarah Connor", 2);

      const winner = await votingSystem.getWinner(1);
      expect(winner.name).to.equal("Sarah Connor");
      expect(winner.voteCount).to.equal(2);
    });
  });
});
