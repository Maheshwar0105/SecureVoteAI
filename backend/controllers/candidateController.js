const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// Add Candidate (Admin/Officer only)
exports.addCandidate = async (req, res) => {
  const {
    name,
    position,
    party,
    partyOrAffiliation,
    organizationType,
    departmentOrHouse,
    symbolBadge,
    biography,
    manifesto,
    promises,
    photoUrl,
    electionId,
    education,
    achievements,
    socialLinks
  } = req.body;

  try {
    if (!name || !biography || !manifesto || !electionId) {
      return res.status(400).json({ error: 'Please provide all required fields (name, biography, manifesto, electionId)' });
    }

    // Verify the election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const candidate = await Candidate.create({
      name,
      position: position || 'Candidate',
      party: party || partyOrAffiliation || 'Independent',
      partyOrAffiliation: partyOrAffiliation || party || 'Independent',
      organizationType: organizationType || election.electionType || 'general',
      departmentOrHouse: departmentOrHouse || '',
      symbolBadge: symbolBadge || '🛡️',
      biography,
      manifesto,
      promises: promises || [],
      photoUrl: photoUrl || '',
      electionId,
      education: education || '',
      achievements: achievements || [],
      socialLinks: socialLinks || { twitter: '', linkedin: '', website: '' }
    });

    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    console.error('Add candidate error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('electionId', 'title startTime endTime status electionType organizationName category');
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.status(200).json({ candidate });
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Candidate (Admin/Officer only)
exports.updateCandidate = async (req, res) => {
  const {
    name,
    position,
    party,
    partyOrAffiliation,
    organizationType,
    departmentOrHouse,
    symbolBadge,
    biography,
    manifesto,
    promises,
    photoUrl,
    education,
    achievements,
    socialLinks
  } = req.body;

  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (name) candidate.name = name;
    if (position) candidate.position = position;
    if (party) candidate.party = party;
    if (partyOrAffiliation) candidate.partyOrAffiliation = partyOrAffiliation;
    if (organizationType) candidate.organizationType = organizationType;
    if (departmentOrHouse) candidate.departmentOrHouse = departmentOrHouse;
    if (symbolBadge) candidate.symbolBadge = symbolBadge;
    if (biography) candidate.biography = biography;
    if (manifesto) candidate.manifesto = manifesto;
    if (promises) candidate.promises = promises;
    if (photoUrl !== undefined) candidate.photoUrl = photoUrl;
    if (education !== undefined) candidate.education = education;
    if (achievements) candidate.achievements = achievements;
    if (socialLinks) candidate.socialLinks = { ...candidate.socialLinks, ...socialLinks };

    await candidate.save();
    res.status(200).json({ message: 'Candidate updated successfully', candidate });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove Candidate (Admin/Officer only - Soft Delete)
exports.removeCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    candidate.isDeleted = true;
    candidate.deletedAt = new Date();
    await candidate.save();

    res.status(200).json({ message: 'Candidate removed successfully' });
  } catch (error) {
    console.error('Remove candidate error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
