import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Session } from "@/entities/Session";
import { Search, Filter, Activity, TrendingUp } from "lucide-react";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        // Load sessions that are not cancelled
        const allSessions = await Session.list("-createdAt", 50);
        setSessions(allSessions.filter(s => s.status !== "cancelled"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredSessions = sessions.filter(s => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" /> Action Marketplace
          </h1>
          <p className="text-gray-500 mt-2">Find fish table action to back from top players.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${filter === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            All Action
          </button>
          <button
            onClick={() => setFilter("funding")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${filter === "funding" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Funding Now
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${filter === "completed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 text-gray-500">Loading Sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Sessions Found</h3>
          <p className="text-gray-500">There are currently no sessions matching your filter.</p>
          <Link to="/seller" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
            Be the First to Sell Action
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col">
              <div className="bg-blue-50/50 p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-blue-700 text-xs font-bold rounded-full shadow-sm border border-blue-100">
                    🐟 {session.platform}
                  </span>
                  <h3 className="font-extrabold text-xl text-gray-900 mt-3">{session.sellerName || "Unknown Seller"}</h3>
                  <p className="text-sm text-gray-500">CashTag: <span className="font-mono text-gray-700">{session.sellerCashTag}</span></p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  session.status === 'funding' ? 'bg-green-100 text-green-700 border border-green-200' : 
                  session.status === 'active' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                  'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  {session.status.toUpperCase()}
                </div>
              </div>
              
              <div className="p-5 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Buy-In</span>
                    <span className="block text-xl font-bold text-gray-900">${session.totalBuyIn}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Markup</span>
                    <span className="block text-xl font-bold text-gray-900">{session.markup}x</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Available to Back</span>
                    <span className="text-blue-600 font-bold">{session.availableShares}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${100 - session.availableShares}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right text-gray-400 font-medium">
                    {100 - session.availableShares}% Sold
                  </div>
                </div>
                
                {session.status === 'completed' && session.cashOut !== undefined && (
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Final Cashout:</span>
                    <span className={`font-bold ${session.cashOut > session.totalBuyIn ? 'text-green-600' : 'text-gray-900'}`}>
                      ${session.cashOut}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-5 pt-0 mt-auto">
                <Link 
                  to={`/session/${session.id}`} 
                  className="block w-full text-center py-3 bg-gray-50 hover:bg-gray-100 text-blue-700 font-bold rounded-xl transition border border-gray-200"
                >
                  {session.status === 'funding' ? 'Buy Action' : 'View Details'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}