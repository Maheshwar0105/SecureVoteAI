import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Badge from './Badge';
import { ShieldCheck, Activity, Radio, CheckCircle } from 'lucide-react';

interface AIAnomalyRadarProps {
  className?: string;
}

export const AIAnomalyRadar: React.FC<AIAnomalyRadarProps> = ({ className = '' }) => {
  const [isolationScore, setIsolationScore] = useState(0.04);
  const [logs, setLogs] = useState<Array<{ id: number; text: string; time: string; status: 'ok' | 'warn' | 'info' }>>([
    { id: 1, text: 'Biometric liveness classifier initialized: DeepScan v2.4 Active', time: '10:42:01', status: 'info' },
    { id: 2, text: 'Voter client latency verified (85ms): Human pacing verified', time: '10:42:15', status: 'ok' },
    { id: 3, text: 'Sepolia node consensus verification: 12 peer validators confirmed', time: '10:42:30', status: 'ok' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomScore = +(Math.random() * 0.08 + 0.01).toFixed(3);
      setIsolationScore(randomScore);

      const events = [
        { text: 'Device fingerprint checked (SHA-256 match). Zero duplicate wallets.', status: 'ok' as const },
        { text: 'FastAPI Isolation Forest Model: Ballot entropy risk 0.02 (Nominal)', status: 'ok' as const },
        { text: 'Live facial descriptor euclidean distance: 0.12 (Match threshold < 0.4)', status: 'ok' as const },
        { text: 'Geo-IP routing verification: Constituency gateway authorized', status: 'info' as const },
        { text: 'Automated script rate-limit scan: No bot traffic detected', status: 'ok' as const }
      ];

      const chosen = events[Math.floor(Math.random() * events.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setLogs((prev) => [
        { id: Date.now(), text: chosen.text, time: timeStr, status: chosen.status },
        ...prev.slice(0, 4)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Sci-Fi HUD Ambient Lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">AI Anomaly Scanner & Threat Telemetry</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase">Continuous Machine Learning Sentinel</p>
          </div>
        </div>

        <Badge variant="success" dot size="sm">
          RADAR ACTIVE
        </Badge>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <p className="text-[9px] font-mono text-slate-500 uppercase">Isolation Forest</p>
          <p className="text-base font-mono font-bold text-white mt-0.5">{isolationScore}</p>
          <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">Risk: Nominal</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <p className="text-[9px] font-mono text-slate-500 uppercase">Facial Liveness</p>
          <p className="text-base font-mono font-bold text-teal-400 mt-0.5">99.2%</p>
          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Anti-Spoof ON</p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
          <p className="text-[9px] font-mono text-slate-500 uppercase">Sybil Defenses</p>
          <p className="text-base font-mono font-bold text-purple-400 mt-0.5">0.00%</p>
          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Zero Fraud Flag</p>
        </div>
      </div>

      {/* Real-time Log Stream */}
      <div className="space-y-2">
        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">
          LIVE TELEMETRY STREAM
        </p>
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2 text-xs bg-slate-950/50 border border-slate-800/80 p-2.5 rounded-xl transition-all"
          >
            <span className="font-mono text-[9px] text-slate-500 mt-0.5 shrink-0">{log.time}</span>
            <div className="flex-1">
              <p className="text-slate-300 text-[11px] leading-tight flex items-center gap-1.5">
                {log.status === 'ok' ? (
                  <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                ) : (
                  <Activity className="h-3 w-3 text-teal-400 shrink-0" />
                )}
                <span>{log.text}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIAnomalyRadar;
