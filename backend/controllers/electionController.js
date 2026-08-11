const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// Create Election (Admin/Officer only)
exports.createElection = async (req, res) => {
  const {
    title,
    description,
    startTime,
    endTime,
    rules,
    electionType,
    organizationName,
    category,
    contestedPositions,
    eligibleDepartments,
    eligibleYearsOrGrades
  } = req.body;

  try {
    if (!title || !description || !startTime || !endTime) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const election = await Election.create({
      title,
      description,
      startTime: start,
      endTime: end,
      electionType: electionType || 'general',
      organizationName: organizationName || 'SecureVote Global Network',
      category: category || 'General Election',
      contestedPositions: contestedPositions && contestedPositions.length > 0 ? contestedPositions : ['Representative'],
      eligibleDepartments: eligibleDepartments || ['All'],
      eligibleYearsOrGrades: eligibleYearsOrGrades || ['All'],
      rules: rules || [],
      createdBy: req.user._id,
      status: 'active'
    });

    res.status(201).json({ message: 'Election created successfully', election });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Seed sample multi-domain elections if empty
const seedDefaultElectionsIfEmpty = async () => {
  const count = await Election.countDocuments();
  if (count > 0) return;

  const mockAdminId = '666000000000000000000001';
  const now = new Date();
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const collegeElection = await Election.create({
    _id: '666111111111111111111101',
    title: 'Apex Tech University Student Council & Mess Committee 2026',
    description: 'Annual election for Student Body President, Vice President, Cultural Head, and Cafeteria/Food Mess Secretary.',
    startTime: now,
    endTime: nextMonth,
    status: 'active',
    electionType: 'college',
    organizationName: 'Apex Institute of Technology & Research',
    category: 'University Student Council',
    contestedPositions: ['Student Council President', 'Food & Mess Secretary', 'Cultural Head'],
    eligibleDepartments: ['Computer Science', 'Electronics', 'Mechanical', 'Biotech', 'Business'],
    createdBy: mockAdminId,
    rules: [
      'Must possess valid College Student Roll Number & Department ID',
      'One ballot per authenticated student wallet',
      'Live AI biometric face verification active'
    ]
  });

  const companyElection = await Election.create({
    _id: '666222222222222222222201',
    title: 'Nexus Global Workplace & Food Department Welfare Board 2026',
    description: 'Elect representatives for the Employee Cafeteria Menu Governance, Food Quality Committee & Workplace Welfare.',
    startTime: now,
    endTime: nextMonth,
    status: 'active',
    electionType: 'company',
    organizationName: 'Nexus Global Enterprises Ltd.',
    category: 'Corporate Employee Governance',
    contestedPositions: ['Food Department & Cafeteria Chair', 'Workplace Culture Representative'],
    eligibleDepartments: ['Engineering', 'Product & Design', 'Human Resources', 'Operations', 'Food & Cafeteria'],
    createdBy: mockAdminId,
    rules: [
      'Open to all verified full-time enterprise employees',
      'Biometric cryptographic signature enforced'
    ]
  });

  const schoolElection = await Election.create({
    _id: '666333333333333333333301',
    title: 'Greenwood Academy Senior Prefect Council Elections 2026',
    description: 'Elect the Head Boy, Head Girl, Sports Captain, and House Prefects for the academic session.',
    startTime: now,
    endTime: nextMonth,
    status: 'active',
    electionType: 'school',
    organizationName: 'Greenwood International Academy',
    category: 'School Prefect Council',
    contestedPositions: ['Head Boy', 'Head Girl', 'Sports Captain'],
    eligibleDepartments: ['Senior Wing (Classes 9-12)'],
    createdBy: mockAdminId,
    rules: [
      'Vote using Student Admission Number and House affiliation',
      'House points & audit trail permanently sealed on ledger'
    ]
  });

  const civicElection = await Election.create({
    _id: '666444444444444444444401',
    title: 'National Democratic Assembly - Metropolitan Constituency 42',
    description: 'General legislative assembly civic election powered by AI anomaly detection and zero-knowledge ledger.',
    startTime: now,
    endTime: nextMonth,
    status: 'active',
    electionType: 'general',
    organizationName: 'National Democratic Election Commission',
    category: 'National Civic Assembly',
    contestedPositions: ['Member of Legislative Assembly (MLA)'],
    eligibleDepartments: ['Constituency 42'],
    createdBy: mockAdminId,
    rules: [
      'National EPIC Voter ID & registered mobile OTP mandatory',
      'Zero-trust cryptographic decentralization on Ethereum testnet'
    ]
  });

  // Add sample candidates for each election
  await Candidate.create([
    // College Candidates
    {
      electionId: collegeElection._id,
      name: 'Aditya Kashyap',
      position: 'Student Council President',
      party: 'Tech Innovators Coalition',
      partyOrAffiliation: 'Tech Innovators Coalition',
      organizationType: 'college',
      departmentOrHouse: 'Computer Science (3rd Year)',
      symbolBadge: '⚡',
      biography: '3rd Year CSE lead developer, organizer of HackApex 2025, student mentor.',
      manifesto: '24x7 High-speed campus Wi-Fi, modern GPU labs, automated student grievance portal.',
      promises: ['Open 24/7 AI computing lab', 'Subsidized technical certifications', 'Semester fee transparency']
    },
    {
      electionId: collegeElection._id,
      name: 'Ananya Deshmukh',
      position: 'Student Council President',
      party: 'Green & Progressive Campus Union',
      partyOrAffiliation: 'Green & Progressive Campus Union',
      organizationType: 'college',
      departmentOrHouse: 'Electronics & Comm (3rd Year)',
      symbolBadge: '🌿',
      biography: 'Vice President of Robotics Club, national badminton champion, environmental advocate.',
      manifesto: 'Solar powered campus, expanded student exchange fellowships, transparent club fundings.',
      promises: ['100% solar library & study rooms', 'Inter-university travel grants', 'Better campus healthcare']
    },
    {
      electionId: collegeElection._id,
      name: 'Vikram Singhania',
      position: 'Food & Mess Secretary',
      party: 'Student Nutrition & Quality Alliance',
      partyOrAffiliation: 'Student Nutrition & Quality Alliance',
      organizationType: 'college',
      departmentOrHouse: 'Mechanical Engg (2nd Year)',
      symbolBadge: '🥗',
      biography: 'Hostel mess committee member for 2 terms, organized hygienic audits and weekend feasts.',
      manifesto: 'Multi-cuisine nutritious menu, weekly hygiene audits, zero food wastage compost initiative.',
      promises: ['Dynamic monthly student menu voting', 'Organic local food sourcing', 'Extended evening snack hours']
    },
    // Company Candidates
    {
      electionId: companyElection._id,
      name: 'Rajesh Raman',
      position: 'Food Department & Cafeteria Chair',
      party: 'Health & Gourmet Guild',
      partyOrAffiliation: 'Health & Gourmet Guild',
      organizationType: 'company',
      departmentOrHouse: 'Food & Cafeteria Welfare Committee',
      symbolBadge: '☕',
      biography: '7 years at Nexus Global, passionate about healthy workplace diet and specialty coffee bars.',
      manifesto: 'Introduce subsidized organic lunch bars, 24/7 barista coffee hubs, and dietary allergen labeling.',
      promises: ['Expanded vegan & keto menu lines', 'On-site freshly brewed artisan coffee', 'Real-time cafeteria rush counter']
    },
    {
      electionId: companyElection._id,
      name: 'Elena Rostova',
      position: 'Workplace Culture Representative',
      party: 'Wellness & Inclusive Workplace',
      partyOrAffiliation: 'Wellness & Inclusive Workplace',
      organizationType: 'company',
      departmentOrHouse: 'Product Design Team',
      symbolBadge: '🚀',
      biography: 'Senior UX Lead advocating ergonomic workstations, flexible hybrid policies, and mental health workshops.',
      manifesto: 'Annual ergonomics stipend, wellness recharge Fridays, and transparent performance appraisals.',
      promises: ['Ergonomic desk upgrades for all employees', 'Quarterly mental health stipends', 'Transparent internal mobility']
    },
    // School Candidates
    {
      electionId: schoolElection._id,
      name: 'Kabir Mehta',
      position: 'Head Boy',
      party: 'Sapphire House',
      partyOrAffiliation: 'Sapphire House',
      organizationType: 'school',
      departmentOrHouse: 'Sapphire House (Grade 12-A)',
      symbolBadge: '💎',
      biography: 'House Captain, debate team anchor, school soccer squad leader.',
      manifesto: 'Inter-house coding tournaments, peer tutoring programs, student mentor circles.',
      promises: ['Weekly inter-house sports league', 'Student innovation club', 'Discipline through positive rewards']
    },
    {
      electionId: schoolElection._id,
      name: 'Meera Iyer',
      position: 'Head Girl',
      party: 'Emerald House',
      partyOrAffiliation: 'Emerald House',
      organizationType: 'school',
      departmentOrHouse: 'Emerald House (Grade 12-B)',
      symbolBadge: '🌟',
      biography: 'Model UN Secretary-General, school orchestra violinist, science olympiad medalist.',
      manifesto: 'Empowering young leaders, modern school library digital catalog, environmental eco-clubs.',
      promises: ['School eco-garden and recycling drive', 'Annual inter-school cultural fest', 'Student suggestion box on blockchain']
    },
    // Civic Candidates
    {
      electionId: civicElection._id,
      name: 'Dr. Sunita Rao',
      position: 'Member of Legislative Assembly (MLA)',
      party: 'Civic Progress Alliance',
      partyOrAffiliation: 'Civic Progress Alliance',
      organizationType: 'general',
      departmentOrHouse: 'Metropolitan District',
      symbolBadge: '🏛️',
      biography: 'Public health administrator, environmental policy advisor, community organizer.',
      manifesto: 'Smart public transit, 100% clean tap water, municipal digital transparency.',
      promises: ['Green metro transit expansion', 'Affordable community health clinics', 'Public budget tracking on blockchain']
    }
  ]);
};

// Get All Elections (Supports Filtering by Domain Type)
exports.getAllElections = async (req, res) => {
  const { type, department } = req.query;

  try {
    // Check and seed if empty
    await seedDefaultElectionsIfEmpty().catch((err) => console.log('Seed check:', err.message));

    const filter = {};
    if (type && type !== 'all') {
      filter.electionType = type;
    }
    if (department && department !== 'All') {
      filter.eligibleDepartments = { $in: [department, 'All'] };
    }

    const elections = await Election.find(filter).sort({ startTime: -1 });
    res.status(200).json({ elections });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Single Election by ID
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Include candidates for this election
    const candidates = await Candidate.find({ electionId: election._id });

    res.status(200).json({ election, candidates });
  } catch (error) {
    console.error('Get election by ID error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Election (Admin/Officer only)
exports.updateElection = async (req, res) => {
  const { title, description, startTime, endTime, rules, status, contractAddress } = req.body;

  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (title) election.title = title;
    if (description) election.description = description;
    if (startTime) election.startTime = new Date(startTime);
    if (endTime) election.endTime = new Date(endTime);
    if (rules) election.rules = rules;
    if (status) election.status = status;
    if (contractAddress) election.contractAddress = contractAddress;

    if (election.endTime <= election.startTime) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    await election.save();
    res.status(200).json({ message: 'Election updated successfully', election });
  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Election (Admin/Officer only - Soft Delete)
exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    election.isDeleted = true;
    election.deletedAt = new Date();
    await election.save();

    // Soft delete all candidates associated with this election
    await Candidate.updateMany({ electionId: election._id }, { isDeleted: true, deletedAt: new Date() });

    res.status(200).json({ message: 'Election and its candidates deleted successfully' });
  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
