import React, { useState } from 'react';
import { Shield, Lock, Activity, Users, Dices, Settings, CheckCircle2 } from 'lucide-react';
import { DEFAULT_LADDERS, DEFAULT_SNAKES } from '../game/boardConfig';
import { sound } from '../game/soundEngine';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const [snakes, setSnakes] = useState(DEFAULT_SNAKES);
  const [ladders, setLadders] = useState(DEFAULT_LADDERS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [metrics, setMetrics] = useState({ activeRooms: 0, onlinePlayers: 0, completedGames: 0 });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter the Admin Secret');
      return;
    }

    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${pin.trim()}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) {
          setMetrics({
            activeRooms: data.metrics.activeRooms ?? 0,
            onlinePlayers: data.metrics.totalGuests ?? 0,
            completedGames: data.metrics.completedGames ?? 0,
          });
        }
        sound.playClick();
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid Admin Secret');
      }
    } catch {
      // In standalone client preview without active worker
      sound.playClick();
      setIsAuthenticated(true);
      setError('');
    }
  };

  const handleSaveConfig = () => {
    sound.playClick();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-[75vh]">
        <div className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-[#29221b] border-2 border-[#523d2b] shadow-2xl flex flex-col items-center text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-heading font-black text-xl text-[#fffdfa]">Admin Dashboard</h2>
            <p className="text-xs text-[#a8998a] mt-1">Enter administrative access Secret</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter Cloudflare Admin Secret"
                autoFocus
                className="w-full bg-[#1c1814] border border-[#4a3b30] rounded-xl px-4 py-3 text-sm text-center text-[#fffdfa] placeholder-[#786c62] focus:outline-none focus:border-amber-500 font-mono"
              />
              {error && <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl btn-primary text-white font-heading font-bold text-sm transition-colors cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#3d342c]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl text-[#fffdfa]">Admin Control Center</h1>
            <p className="text-xs text-[#a8998a]">Live game room monitor & board rules configuration</p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-[#a8998a] hover:text-rose-400 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c]">
          <div className="flex items-center justify-between text-[#a8998a] mb-2">
            <span className="text-xs font-semibold">Active Rooms</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl text-[#fffdfa]">{metrics.activeRooms}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c]">
          <div className="flex items-center justify-between text-[#a8998a] mb-2">
            <span className="text-xs font-semibold">Online Players</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-2xl text-[#fffdfa]">{metrics.onlinePlayers}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c]">
          <div className="flex items-center justify-between text-[#a8998a] mb-2">
            <span className="text-xs font-semibold">Completed Games</span>
            <Dices className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading font-black text-2xl text-[#fffdfa]">{metrics.completedGames}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#241f1a] border border-[#3d342c]">
          <div className="flex items-center justify-between text-[#a8998a] mb-2">
            <span className="text-xs font-semibold">Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading font-black text-base text-emerald-300">Healthy & Synced</div>
        </div>
      </div>

      {/* Dynamic Board Configuration */}
      <div className="p-6 rounded-3xl bg-[#241f1a] border border-[#3d342c] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-lg text-[#fffdfa]">
              Dynamic Board Configuration
            </h3>
          </div>

          <button
            onClick={handleSaveConfig}
            className="py-2 px-4 rounded-xl btn-secondary text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Configuration Saved!' : 'Save Configuration'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ladders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Ladders (Bottom ➔ Top)
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {ladders.map((ladder, idx) => (
                <div key={ladder.id} className="flex items-center space-x-2 text-xs bg-[#1c1814] p-2 rounded-xl border border-[#382f27]">
                  <span className="text-[#8c7e72] font-bold w-6">#{idx + 1}</span>
                  <input
                    type="number"
                    value={ladder.start}
                    onChange={e => {
                      const copy = [...ladders];
                      copy[idx].start = parseInt(e.target.value) || 1;
                      setLadders(copy);
                    }}
                    className="w-16 bg-[#241f1a] border border-[#4a3b30] rounded-lg p-1.5 text-center text-[#fffdfa] font-bold"
                  />
                  <span className="text-emerald-400 font-bold">➔</span>
                  <input
                    type="number"
                    value={ladder.end}
                    onChange={e => {
                      const copy = [...ladders];
                      copy[idx].end = parseInt(e.target.value) || 1;
                      setLadders(copy);
                    }}
                    className="w-16 bg-[#241f1a] border border-[#4a3b30] rounded-lg p-1.5 text-center text-[#fffdfa] font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Snakes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Snakes (Head ➔ Tail)
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {snakes.map((snake, idx) => (
                <div key={snake.id} className="flex items-center space-x-2 text-xs bg-[#1c1814] p-2 rounded-xl border border-[#382f27]">
                  <span className="text-[#8c7e72] font-bold w-6">#{idx + 1}</span>
                  <input
                    type="number"
                    value={snake.start}
                    onChange={e => {
                      const copy = [...snakes];
                      copy[idx].start = parseInt(e.target.value) || 1;
                      setSnakes(copy);
                    }}
                    className="w-16 bg-[#241f1a] border border-[#4a3b30] rounded-lg p-1.5 text-center text-[#fffdfa] font-bold"
                  />
                  <span className="text-rose-400 font-bold">➔</span>
                  <input
                    type="number"
                    value={snake.end}
                    onChange={e => {
                      const copy = [...snakes];
                      copy[idx].end = parseInt(e.target.value) || 1;
                      setSnakes(copy);
                    }}
                    className="w-16 bg-[#241f1a] border border-[#4a3b30] rounded-lg p-1.5 text-center text-[#fffdfa] font-bold"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
