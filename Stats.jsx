import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Session } from "@/entities/Session";
import { TrendingUp, Trophy, Target, Activity, Users } from "lucide-react";

export default function Stats() {
  const [topProfitSellers, setTopProfitSellers] = useState([]);
  const [topWinRateSellers, setTopWinRateSellers] = useState([]);
  const [globalStats, setGlobalStats] = useState({ totalPlayed: 0, totalWinnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch users sorted by profit
        const byProfit = await User.list("-totalProfit", 10);
        // Filter out those with 0 profit to make leaderboard meaningful
        setTopProfitSellers(byProfit.filter(u => u.totalProfit > 0));

        // Fetch users sorted by win percentage
        const byWinRate = await User.list("-winPercentage", 10);
        // Only include those who have actually played (totalBuyIn > 0)
        setTopWinRateSellers(byWinRate.filter(u => u.totalBuyIn > 0 && u.winPercentage > 0));

        // Aggregate some basic global stats
        const allSessions = await Session.filter({ status: "completed" });
        const totalWinnings = allSessions.reduce((acc, sess) => acc + (sess.cashOut || 0), 0);
        setGlobalStats({ totalPlayed: allSessions.length, totalWinnings });
        
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Leaderboards...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Activity className="w-12 h-12 text-yellow-400 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-extrabold">Data & Leaderboards</h1>
          <p className="text-blue-200 text-lg">Track the most profitable players, biggest win percentages, and overall platform stats.</p>
        </div>
      </div>

      {/* Global Overview Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Winnings Generated</p>
            <p className="text-3xl font-black text-gray-900">${globalStats.totalWinnings.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Sessions Completed</p>
            <p className="text-3xl font-black text-gray-900">{globalStats.totalPlayed}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Top Earners Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Top Sellers (By Profit)</h2>
          </div>
          {topProfitSellers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Not enough data to generate leaderboard.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {topProfitSellers.map((seller, idx) => (
                <li key={seller.id} className="p-4 flex items-center hover:bg-gray-50 transition">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-black text-lg bg-gray-100 text-gray-500 rounded-full mr-4">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{seller.fullName || seller.email.split('@')[0]}</p>
                    <p className="text-xs text-gray-500 font-mono">{seller.cashTag}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-600 text-xl">+${seller.totalProfit}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Profit</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Win Rate Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-3">
            <Target className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Highest Win Percentage</h2>
          </div>
          {topWinRateSellers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Not enough data to generate leaderboard.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {topWinRateSellers.map((seller, idx) => (
                <li key={seller.id} className="p-4 flex items-center hover:bg-gray-50 transition">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center font-black text-lg bg-gray-100 text-gray-500 rounded-full mr-4">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{seller.fullName || seller.email.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">Volume: ${seller.totalBuyIn}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600 text-xl">{seller.winPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">Win Rate</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}