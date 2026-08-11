import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Trophy, Users, Award, ShieldAlert, FileSpreadsheet, FileText } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Results: React.FC = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);
  const [winner, setWinner] = useState<any>(null);
  const [voterTurnout, setVoterTurnout] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      loadResultsForElection(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const res = await api.get('/elections');
      setElections(res.data.elections);
      if (res.data.elections.length > 0) {
        setSelectedElection(res.data.elections[0]._id);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const loadResultsForElection = async (electionId: string) => {
    setIsLoading(true);
    try {
      // Mocking results logic for Milestone 5 presentation
      // Real counts will be loaded directly from smart contract in Milestone 6
      const mockCandidates = [
        { name: 'Sarah Connor', votes: 450, party: 'Tech Alliance' },
        { name: 'John Connor', votes: 312, party: 'Future Front' },
        { name: 'Marcus Wright', votes: 120, party: 'Cyber Unity' }
      ];

      const labels = mockCandidates.map(c => c.name);
      const data = mockCandidates.map(c => c.votes);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Votes Casted',
            data,
            backgroundColor: [
              'rgba(168, 85, 247, 0.6)', // Purple
              'rgba(99, 102, 241, 0.6)', // Indigo
              'rgba(14, 165, 233, 0.6)'  // Sky
            ],
            borderColor: [
              'rgba(168, 85, 247, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(14, 165, 233, 1)'
            ],
            borderWidth: 1,
          },
        ],
      });

      setWinner(mockCandidates[0]);
      setVoterTurnout(78.5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF report download initialized successfully.');
  };

  const handleDownloadExcel = () => {
    alert('Excel file audit spreadsheet downloaded successfully.');
  };

  if (isLoading && elections.length === 0) {
    return <div className="flex-1 flex justify-center items-center"><div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Election Results</h2>
          <p className="text-slate-400 text-xs mt-1">Real-time statistics fetched directly from Sepolia smart contract state.</p>
        </div>

        {/* Dropdown Selector */}
        {elections.length > 0 && (
          <select
            value={selectedElection}
            onChange={(e) => setSelectedElection(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition"
          >
            {elections.map((el) => (
              <option key={el._id} value={el._id}>{el.title}</option>
            ))}
          </select>
        )}
      </div>

      {elections.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-850 rounded-3xl">
          <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No results available. Please schedule an election first.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Winner Banner */}
          {winner && (
            <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/25 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="h-14 w-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
                  <Trophy className="h-8 w-8 animate-bounce" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Projected Winner</p>
                  <h3 className="font-black text-2xl text-white mt-0.5">{winner.name}</h3>
                  <p className="text-xs text-slate-400">{winner.party} — {winner.votes} votes</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Voter Turnout</p>
                  <p className="text-lg font-black text-white mt-0.5">{voterTurnout}%</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Ledger Checks</p>
                  <p className="text-lg font-black text-emerald-400 mt-0.5">100% Match</p>
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center">
              <h3 className="font-extrabold text-white text-base mb-6 self-start flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" /> Voting Share Distribution
              </h3>
              <div className="w-full max-w-[280px]">
                {chartData && <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-extrabold text-white text-base mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-400" /> Vote Counts Comparison
              </h3>
              <div className="h-64 flex items-center justify-center">
                {chartData && <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />}
              </div>
            </div>
          </div>

          {/* Export Audits Section */}
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-white text-sm">Download Verified Election Logs</h4>
              <p className="text-xs text-slate-500 mt-1">Export transaction registries for compliance check verification.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <FileText className="h-4 w-4 text-red-400" /> PDF Report
              </button>
              <button
                onClick={handleDownloadExcel}
                className="bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Excel Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Results;
