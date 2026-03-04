import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "@/entities/User";
import { Session } from "@/entities/Session";
import { TrendingUp, Users, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await User.me().catch(() => null);
        setUser(currentUser);
        
        const sessions = await Session.list("-createdAt", 3);
        setRecentSessions(sessions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl p-8 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            The Premier <span className="text-yellow-400">Fish Table</span> Staking Platform
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            Buy and sell action for Golden Dragon, Diamond Dragon, Fire Phoenix, and Magic City. 
            Automated payouts, deep stats, and total transparency.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/sessions" className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-transform hover:scale-105 shadow-lg">
                  Browse Sessions
                </Link>
                <Link to="/seller" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold rounded-full transition-transform hover:scale-105">
                  Sell Action
                </Link>
              </>
            ) : (
              <a href="/login" className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-full transition-transform hover:scale-105 shadow-lg">
                Get Started
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Buy & Sell Action</h3>
          <p className="text-gray-600">List your gameplay sessions, sell percentages, and let backers fund your buy-ins with secure tracking.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Automated Payouts</h3>
          <p className="text-gray-600">No more manual math. When a session ends, the system calculates exact amounts owed to each backer instantly.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Stats & Leaderboards</h3>
          <p className="text-gray-600">Track ROI, win percentages, and total profit. Climb the leaderboards and prove you're the best player.</p>
        </div>
      </section>

      {/* Recent Activity (Preview) */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" /> Recent Action
          </h2>
          <Link to="/sessions" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-40 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ) : recentSessions.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recentSessions.map(session => (
              <div key={session.id} className="bg-white rounded-xl shadow border border-gray-100 p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                      {session.platform}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2">{session.sellerName || 'Unknown Seller'}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    session.status === 'funding' ? 'bg-green-100 text-green-800' : 
                    session.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Buy-In:</span>
                    <span className="font-semibold text-gray-900">${session.totalBuyIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Markup:</span>
                    <span className="font-semibold text-gray-900">{session.markup}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available:</span>
                    <span className="font-semibold text-blue-600">{session.availableShares}%</span>
                  </div>
                </div>
                
                <Link to={`/sessions/${session.id}`} className="block w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-blue-700 font-medium rounded-lg transition">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100 text-gray-500">
            No active sessions found. Be the first to list one!
          </div>
        )}
      </section>
    </div>
  );
}