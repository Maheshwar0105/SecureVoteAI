// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./VotingAccessControl.sol";

contract VotingSystem is VotingAccessControl {
    enum Status { Scheduled, Active, Completed }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        Status status;
        uint256 candidatesCount;
        uint256 totalVotes;
    }

    uint256 public electionCount;
    mapping(uint256 => Election) public elections;
    // electionId => candidateId => Candidate
    mapping(uint256 => mapping(uint256 => Candidate)) public electionCandidates;
    // electionId => voterAddress => votedStatus
    mapping(uint256 => mapping(address => bool)) public voted;

    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event CandidateRegistered(uint256 indexed electionId, uint256 indexed candidateId, string name, string party);
    event VoteCasted(uint256 indexed electionId, address indexed voter, uint256 indexed candidateId);
    event ElectionEnded(uint256 indexed electionId, uint256 winnerId, string winnerName, uint256 winningVotes);

    constructor() VotingAccessControl(msg.sender) {}

    function createElection(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyOfficer returns (uint256) {
        require(_endTime > _startTime, "End time must be after start time");
        
        electionCount++;
        elections[electionCount] = Election({
            id: electionCount,
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            status: Status.Scheduled,
            candidatesCount: 0,
            totalVotes: 0
        });

        emit ElectionCreated(electionCount, _title, _startTime, _endTime);
        return electionCount;
    }

    function registerCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _party
    ) external onlyOfficer {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];
        require(election.status == Status.Scheduled, "Can only register candidates during scheduled status");

        election.candidatesCount++;
        electionCandidates[_electionId][election.candidatesCount] = Candidate({
            id: election.candidatesCount,
            name: _name,
            party: _party,
            voteCount: 0
        });

        emit CandidateRegistered(_electionId, election.candidatesCount, _name, _party);
    }

    function startElection(uint256 _electionId) external onlyOfficer {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];
        require(election.status == Status.Scheduled, "Election must be in scheduled status");

        election.status = Status.Active;
    }

    function vote(uint256 _electionId, uint256 _candidateId) external {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];
        
        require(election.status == Status.Active, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started yet");
        require(block.timestamp <= election.endTime, "Election has expired");
        require(!voted[_electionId][msg.sender], "You have already casted a vote in this election");
        require(_candidateId > 0 && _candidateId <= election.candidatesCount, "Invalid candidate selected");

        voted[_electionId][msg.sender] = true;
        electionCandidates[_electionId][_candidateId].voteCount++;
        election.totalVotes++;

        emit VoteCasted(_electionId, msg.sender, _candidateId);
    }

    function endElection(uint256 _electionId) external onlyOfficer {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];
        require(election.status == Status.Active, "Election must be active to end it");

        election.status = Status.Completed;

        // Calculate Winner
        uint256 winningVotes = 0;
        uint256 winnerId = 0;
        string memory winnerName = "";

        for (uint256 i = 1; i <= election.candidatesCount; i++) {
            if (electionCandidates[_electionId][i].voteCount > winningVotes) {
                winningVotes = electionCandidates[_electionId][i].voteCount;
                winnerId = i;
                winnerName = electionCandidates[_electionId][i].name;
            }
        }

        emit ElectionEnded(_electionId, winnerId, winnerName, winningVotes);
    }

    function getCandidate(
        uint256 _electionId,
        uint256 _candidateId
    ) external view returns (uint256 id, string memory name, string memory party, uint256 voteCount) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Candidate memory candidate = electionCandidates[_electionId][_candidateId];
        return (candidate.id, candidate.name, candidate.party, candidate.voteCount);
    }

    function getWinner(uint256 _electionId) external view returns (uint256 id, string memory name, string memory party, uint256 voteCount) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election memory election = elections[_electionId];
        require(election.status == Status.Completed, "Election has not finished yet");

        uint256 winningVotes = 0;
        uint256 winnerId = 0;

        for (uint256 i = 1; i <= election.candidatesCount; i++) {
            if (electionCandidates[_electionId][i].voteCount > winningVotes) {
                winningVotes = electionCandidates[_electionId][i].voteCount;
                winnerId = i;
            }
        }

        Candidate memory candidate = electionCandidates[_electionId][winnerId];
        return (candidate.id, candidate.name, candidate.party, candidate.voteCount);
    }

    function hasVoted(uint256 _electionId, address _voter) external view returns (bool) {
        return voted[_electionId][_voter];
    }

    function electionStatus(uint256 _electionId) external view returns (Status) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].status;
    }
}
