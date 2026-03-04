import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User } from "@/entities/User";
import { Session } from "@/entities/Session";
import { Stake } from "@/entities/Stake";
import * as RechartsPrimitive from "recharts";
import { AlertCircle, CheckCircle, Shield, ArrowLeft } from "lucide-react";

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [stakes, setStakes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyPercent, setBuyPercent] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Extract session ID from URL using query parameters parsing if necessary, 
        // but react-router useParams() provides it directly.
        // Fallback for agentUI routing environment which might use URLSearchParams
        let sessionId = id;
        if (!sessionId) {
          const urlParams = new URLSearchParams(window.location.search);
          sessionId = urlParams.get("id");
        }
        
        if (!sessionId) return;
        
        const sess = await Session.get(sessionId);
        setSession(sess);
        
        const sessionStakes = await Stake.filter({ sessionId: sess.id });
        setStakes(sessionStakes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, window.location.search]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Session Details...</div>;
  if (!session) return <div className="p-8 text-center text-gray-500">Session not found.</div>;

  const cost = ((session.totalBuyIn * session.markup) * (buyPercent / 100)).toFixed(2);
  const percentSold = 100 - session.availableShares;
  
  // Pie Chart Data
  const pieData = [
    { name: "Available", value: session.availableShares, fill: "#3b82f6" },
    { name: "Sold", value: percentSold, fill: "#d1d5db" }
  ];

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!user.isSubscribed) {
      setError("You must have an active $1.99 subscription to buy action.");
      return;
    }
    if (buyPercent > session.availableShares) {
      setError(`Only ${session.availableShares}% is available.`);
      return;
    }
    if (buyPercent <= 0) {
      setError("Please select a valid percentage.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Create Stake
      const newStake = await Stake.create({
        sessionId: session.id,
        buyerId: user.id,
        buyerName: user.fullName || user.email,
        buyerCashTag: user.cashTag,
        percentage: Number(buyPercent),
        amountPaid: Number(cost),
        status: "pending"
      });
      
      // Update session availability (optimistic)
      const updatedShares = session.availableShares - buyPercent;
      await Session.update(session.id, { availableShares: updatedShares });
      
      setSession(prev => ({ ...prev, availableShares: updatedShares }));
      setStakes(prev => [...prev, newStake]);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to reserve your shares.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Link to="/sessions" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Action
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Session Details & Pie Chart */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                    {session.platform}
                  </span>
                  <h1 className="text-4xl font-extrabold mb-2">{session.sellerName || "Seller"}</h1>
                  <p className="text-blue-200 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Verified Player
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                  session.status === 'funding' ? 'bg-green-500 text-white' : 
                  session.status === 'active' ? 'bg-yellow-500 text-white' : 
                  'bg-gray-500 text-white'
                }`}>
                  {session.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Buy-In</span>
                  <span className="text-2xl font-black text-gray-900">${session.totalBuyIn}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Markup</span>
                  <span className="text-2xl font-black text-gray-900">{session.markup}x</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Available</span>
                  <span className="text-2xl font-black text-blue-600">{session.availableShares}%</span>
                </div>
                {session.status === 'completed' && (
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Final Cashout</span>
                    <span className={`text-2xl font-black ${session.cashOut > session.totalBuyIn ? 'text-green-600' : 'text-gray-900'}`}>
                      ${session.cashOut}
                    </span>
                  </div>
                )}
              </div>

              {session.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Rules & Description</h3>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100">
                    {session.description}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center gap-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="w-48 h-48 flex-shrink-0 relative">
                  <RechartsPrimitive.PieChart width={192} height={192}>
                    <RechartsPrimitive.Pie 
                      data={pieData} 
                      dataKey="value" 
                      cx="50%" cy="50%" 
                      innerRadius={60} 
                      outerRadius={80} 
                      stroke="none"
                    />
                  </RechartsPrimitive.PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-gray-900">{session.availableShares}%</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Left</span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Share Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-blue-900">Available to Buy</span>
                      </div>
                      <span className="font-bold text-blue-700">{session.availableShares}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span className="font-medium text-gray-600">Already Sold</span>
                      </div>
                      <span className="font-bold text-gray-600">{percentSold}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Buy Action Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Buy Action</h2>
            </div>
            
            <div className="p-6">
              {session.status !== "funding" ? (
                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-gray-600 font-medium">This session is no longer funding.</p>
                  <p className="text-sm text-gray-500 mt-2">Current Status: <span className="uppercase font-bold">{session.status}</span></p>
                </div>
              ) : success ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Shares Reserved!</h3>
                  <p className="text-gray-600">You must now send <strong className="text-gray-900">${cost}</strong> to the seller to confirm your stake.</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                    <p className="text-sm text-gray-500 mb-1">Seller's CashTag:</p>
                    <p className="font-mono text-xl font-bold text-blue-600 bg-blue-50 p-2 rounded">{session.sellerCashTag}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBuy} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">How much action do you want?</label>
                    <div className="flex items-center gap-4 mb-2">
                      <input 
                        type="range" 
                        min="1" 
                        max={session.availableShares || 1} 
                        value={buyPercent} 
                        onChange={(e) => setBuyPercent(Number(e.target.value))}
                        className="flex-1"
                      />
                      <div className="w-20 relative">
                        <input 
                          type="number" 
                          value={buyPercent}
                          onChange={(e) => setBuyPercent(Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-center font-bold"
                          min="1" max={session.availableShares}
                        />
                        <span className="absolute right-2 top-2.5 text-gray-500 font-bold">%</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      {[5, 10, 20, 50].map(val => (
                        val <= session.availableShares && (
                          <button 
                            key={val} type="button" 
                            onClick={() => setBuyPercent(val)}
                            className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded transition"
                          >
                            {val}%
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Cost:</span>
                      <span className="font-medium text-gray-900">${((session.totalBuyIn) * (buyPercent / 100)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Markup ({session.markup}x):</span>
                      <span className="font-medium text-gray-900">${(((session.totalBuyIn * session.markup) - session.totalBuyIn) * (buyPercent / 100)).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between items-center">
                      <span className="font-bold text-blue-900">Total Price:</span>
                      <span className="text-2xl font-black text-blue-600">${cost}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting || session.availableShares === 0}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                  >
                    {submitting ? "Processing..." : `Reserve ${buyPercent}% Action`}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    After reserving, you will need to send ${cost} via Cash App to the seller.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stakes List */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Backers ({stakes.length})</h2>
        </div>
        {stakes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No action has been sold yet. Be the first!</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Backer</th>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Paid</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stakes.map(stake => (
                <tr key={stake.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {stake.buyerName || 'Anonymous'}
                    {user && stake.buyerId === user.id && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">YOU</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{stake.percentage}%</td>
                  <td className="px-6 py-4 font-medium text-gray-700">${stake.amountPaid}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      stake.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {stake.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}