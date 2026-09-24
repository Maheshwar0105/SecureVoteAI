import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card, { CardHeader, CardTitle } from '../components/Card';
import Badge from '../components/Badge';
import {
  Calendar,
  UserPlus,
  Users,
  Cpu
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Create Election Form
  const [elType, setElType] = useState<'college' | 'company' | 'school' | 'general'>('college');
  const [elTitle, setElTitle] = useState('');
  const [elOrgName, setElOrgName] = useState('Apex Institute of Technology & Research');
  const [elCategory, setElCategory] = useState('University Student Council');
  const [elDesc, setElDesc] = useState('');
  const [elPositions, setElPositions] = useState('President, Vice President, Food & Mess Secretary');
  const [elStart, setElStart] = useState('');
  const [elEnd, setElEnd] = useState('');

  // Add Candidate Form
  const [selectedElection, setSelectedElection] = useState('');
  const [candName, setCandName] = useState('');
  const [candPosition, setCandPosition] = useState('Student Council President');
  const [candParty, setCandParty] = useState('');
  const [candDept, setCandDept] = useState('');
  const [candSymbol, setCandSymbol] = useState('⚡');
  const [candBio, setCandBio] = useState('');
  const [candMan, setCandMan] = useState('');
  const [candPromises, setCandPromises] = useState('');

  const [aiAlerts, setAiAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const elRes = await api.get('/elections');
      setElections(elRes.data.elections);
      if (elRes.data.elections.length > 0) {
        setSelectedElection(elRes.data.elections[0]._id);
      }

      const usersRes = await api.get('/users');
      setUsers(usersRes.data.users);

      // Real-time AI Anomaly Telemetry
      setAiAlerts([
        {
          id: 1,
          voter: 'Device Hash #9981-A',
          reason: 'Abnormal voting speed (0.35s) — potential bot script',
          score: 0.88,
          ip: '192.168.1.102',
          type: 'Bot Rate-Limit'
        },
        {
          id: 2,
          voter: 'Device Hash #4412-B',
          reason: 'Rapid MetaMask wallet switching from identical client fingerprint',
          score: 0.74,
          ip: '10.0.0.4',
          type: 'Sybil Attempt'
        },
        {
          id: 3,
          voter: 'Session ID #8812',
          reason: 'Face verification liveness anomaly: static photo frame rejected',
          score: 0.95,
          ip: '172.16.2.19',
          type: 'Spoof Detection'
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (type: 'college' | 'company' | 'school' | 'general') => {
    setElType(type);
    if (type === 'college') {
      setElTitle('Apex Tech University Student Council & Mess Board 2026');
      setElOrgName('Apex Institute of Technology & Research');
      setElCategory('University Student Council');
      setElDesc('Elect the campus President, Vice President, and Cafeteria Food Quality Lead.');
      setElPositions('President, Vice President, Food & Mess Secretary');
    } else if (type === 'company') {
      setElTitle('Nexus Global Cafeteria Governance & Employee Welfare 2026');
      setElOrgName('Nexus Global Enterprise Ltd.');
      setElCategory('Corporate Employee Governance');
      setElDesc('Elect representatives for the Employee Cafeteria Menu Governance & Health Board.');
      setElPositions('Food Department & Cafeteria Chair, Workplace Culture Representative');
    } else if (type === 'school') {
      setElTitle('Greenwood Academy Senior Prefect Council Elections 2026');
      setElOrgName('Greenwood International Academy');
      setElCategory('School Prefect Council');
      setElDesc('Elect the Head Boy, Head Girl, and Sports Captain for the upcoming session.');
      setElPositions('Head Boy, Head Girl, Sports Captain');
    } else {
      setElTitle('National Democratic Legislative Assembly 2026');
      setElOrgName('National Democratic Election Commission');
      setElCategory('National Civic Assembly');
      setElDesc('Metropolitan Constituency 42 general parliamentary ballot.');
      setElPositions('Member of Legislative Assembly (MLA)');
    }
  };

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const positionsArray = elPositions
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      const res = await api.post('/elections', {
        title: elTitle,
        description: elDesc,
        organizationName: elOrgName,
        category: elCategory,
        electionType: elType,
        contestedPositions: positionsArray,
        startTime: elStart || new Date().toISOString(),
        endTime: elEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      setMessage('Election created and deployed successfully to distributed registry!');
      setElections([res.data.election, ...elections]);
      setElTitle('');
      setElDesc('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create election');
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const promisesList = candPromises
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      await api.post('/candidates', {
        electionId: selectedElection,
        name: candName,
        position: candPosition,
        party: candParty,
        partyOrAffiliation: candParty,
        organizationType: elType,
        departmentOrHouse: candDept,
        symbolBadge: candSymbol,
        biography: candBio,
        manifesto: candMan,
        promises: promisesList
      });

      setMessage('Candidate profile registered successfully!');
      setCandName('');
      setCandParty('');
      setCandBio('');
      setCandMan('');
      setCandPromises('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add candidate');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-12 w-full max-w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="primary" size="sm">
            ADMINISTRATIVE CONSOLE
          </Badge>
          <Badge variant="success" dot size="sm">
            LEDGER SYNC ONLINE
          </Badge>
        </div>
        <h1 className="heading-lg">Chief Election Administration</h1>
        <p className="text-slate-400 text-xs mt-1">
          Deploy multi-domain elections, configure candidate slots (Head Boy/Girl, Food Dept, President), and monitor AI fraud alerts.
        </p>
      </div>

      {message && <div className="text-xs bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl text-emerald-300 mb-6 font-mono">{message}</div>}
      {error && <div className="text-xs bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl text-rose-300 mb-6 font-mono">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Election & Add Candidate */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Create Multi-Domain Election */}
          <Card>
            <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" /> Deploy Multi-Domain Election
            </h3>

            {/* Template Presets */}
            <div className="mb-4">
              <p className="text-[10px] font-mono text-slate-400 uppercase mb-2">Select Domain Preset</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'college', label: '🎓 College', type: 'college' },
                  { id: 'company', label: '🏢 Corporate', type: 'company' },
                  { id: 'school', label: '🏫 School', type: 'school' },
                  { id: 'general', label: '🏛️ Civic', type: 'general' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleTemplateSelect(preset.type as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      elType === preset.type
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateElection} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Election Title</label>
                <input
                  type="text"
                  required
                  value={elTitle}
                  onChange={(e) => setElTitle(e.target.value)}
                  placeholder="e.g. Apex Tech Student Council 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Institution Name</label>
                <input
                  type="text"
                  required
                  value={elOrgName}
                  onChange={(e) => setElOrgName(e.target.value)}
                  placeholder="Apex University / Nexus Global"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Contested Positions</label>
                <input
                  type="text"
                  required
                  value={elPositions}
                  onChange={(e) => setElPositions(e.target.value)}
                  placeholder="Head Boy, Head Girl, President"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Description</label>
                <textarea
                  required
                  value={elDesc}
                  onChange={(e) => setElDesc(e.target.value)}
                  placeholder="Provide scope, guidelines, and eligible voting departments..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 h-16 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Start Date</label>
                <input
                  type="datetime-local"
                  value={elStart}
                  onChange={(e) => setElStart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">End Date</label>
                <input
                  type="datetime-local"
                  value={elEnd}
                  onChange={(e) => setElEnd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-md shadow-purple-500/20"
              >
                Schedule & Deploy Election
              </button>
            </form>
          </Card>

          {/* Add Candidate Profile */}
          <Card>
            <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-teal-400" /> Add Candidate to Election
            </h3>

            <form onSubmit={handleAddCandidate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Target Election</label>
                <select
                  value={selectedElection}
                  onChange={(e) => setSelectedElection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                >
                  {elections.map((el) => (
                    <option key={el._id} value={el._id}>
                      [{el.electionType?.toUpperCase()}] {el.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Contested Position</label>
                <input
                  type="text"
                  required
                  value={candPosition}
                  onChange={(e) => setCandPosition(e.target.value)}
                  placeholder="e.g. Food & Mess Secretary / Head Boy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Party / Slate / House</label>
                <input
                  type="text"
                  required
                  value={candParty}
                  onChange={(e) => setCandParty(e.target.value)}
                  placeholder="e.g. Student Nutrition Alliance / Sapphire House"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Department & Symbol</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={candDept}
                    onChange={(e) => setCandDept(e.target.value)}
                    placeholder="e.g. Mechanical 2nd Year"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                  />
                  <input
                    type="text"
                    value={candSymbol}
                    onChange={(e) => setCandSymbol(e.target.value)}
                    placeholder="🥗"
                    className="w-14 text-center bg-slate-950 border border-slate-800 rounded-xl py-2.5 text-slate-200 text-lg focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Manifesto Pledges</label>
                <textarea
                  required
                  value={candMan}
                  onChange={(e) => setCandMan(e.target.value)}
                  placeholder="Commitment overview and student/employee promises..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 h-16 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                Register Candidate Profile
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: AI Security Alerts & Registered Credentials Manager */}
        <div className="lg:col-span-5 space-y-8">
          {/* AI Threat Alerts */}
          <Card>
            <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-teal-400" /> AI Anomaly Detection Engine
            </h3>
            <div className="space-y-3">
              {aiAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-slate-950/80 border border-rose-500/30 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white font-mono">{alert.voter}</span>
                    <Badge variant="danger" size="sm">
                      Risk: {alert.score * 100}%
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">{alert.reason}</p>
                  <p className="text-[9px] text-slate-500 font-mono">IP: {alert.ip} • Threat: {alert.type}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Multi-Domain Voter Directory */}
          <Card>
            <h3 className="font-extrabold text-white text-base mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" /> Multi-Domain Voter Credentials
            </h3>
            <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto pr-1">
              {users.slice(0, 8).map((u) => (
                <div key={u._id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-200">{u.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {u.organizationId || u.voterId || u.phoneNumber || u.email}
                    </p>
                    <p className="text-[9px] text-purple-400">{u.organizationName || u.department || 'General'}</p>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {u.organizationType || u.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
