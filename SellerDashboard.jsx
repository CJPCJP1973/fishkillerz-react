import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Session } from "@/entities/Session";
import { Stake } from "@/entities/Stake";
import { Payout } from "@/entities/Payout";
import { PlusCircle, CheckCircle, Save, LayoutDashboard, Clock } from "lucide-react";

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [stakes, setStakes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Session Form State
  const [showCreate, setShowCreate] = useState(false);
  const [platform, setPlatform] = useState("Golden Dragon");
  const [totalBuyIn, setTotalBuyIn] = useState("");
  const [markup, setMarkup] = useState("1.0");
  const [sharesAvailable, setSharesAvailable] = useState("100");
  const [description, setDescription] = useState("");
  const [cashTag, setCashTag] = useState("");

  // Complete Session Modal
  const [completingSession, setCompletingSession] = useState(null);
  const [cashOut, setCashOut] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await User.me();
        if (!currentUser) {
          window.location.href = "/login";
          return;
        }
        setUser(currentUser);
        setCashTag(currentUser.cashTag || "");

        // Only let subscribed users act as sellers
        if (!currentUser.isSubscribed) {
          window.location.href = "/subscribe";
          return;
        }

        const mySessions = await Session.filter({ sellerId: currentUser.id }, "-createdAt");
        setSessions(mySessions);

        if (mySessions.length > 0) {
          const sessionIds = mySessions.map(s => s.id);
          // Simplified fetch: Fetching all stakes for my sessions
          const allStakes = await Stake.list();
          const myStakes = allStakes.filter(st => sessionIds.includes(st.sessionId));
          setStakes(myStakes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!cashTag.startsWith("$")) return alert("CashTag must start with $");

    try {
      if (user.cashTag !== cashTag) {
        await User.update(user.id, { cashTag });
      }

      const newSession = await Session.create({
        sellerId: user.id,
        sellerName: user.fullName || user.email,
        sellerCashTag: cashTag,
        platform,
        totalBuyIn: Number(totalBuyIn),
        markup: Number(markup),
        availableShares: Number(sharesAvailable),
        status: "funding",
        description
      });

      setSessions([newSession, ...sessions]);
      setShowCreate(false);
      setPlatform("Golden Dragon");
      setTotalBuyIn("");
      setMarkup("1.0");
      setSharesAvailable("100");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to create session");
    }
  };

  const confirmStake = async (stake) => {
    try {
      await Stake.update(stake.id, { status: "confirmed" });
      setStakes(stakes.map(s => s.id === stake.id ? { ...s, status: "confirmed" } : s));
    } catch (error) {
      console.error(error);
    }
  };

  const startSession = async (session) => {
    try {
      await Session.update(session.id, { status: "active" });
      setSessions(sessions.map(s => s.id === session.id ? { ...s, status: "active" } : s));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteSession = async (e) => {
    e.preventDefault();
    if (!cashOut || isNaN(cashOut)) return;

    try {
      const profit = Number(cashOut) - completingSession.totalBuyIn;
      
      // Update the session
      await Session.update(completingSession.id, { 
        status: "completed", 
        cashOut: Number(cashOut), 
        profit 
      });

      // Update user stats (approximate since we just sum up everything, ideally computed via aggregation)
      const newTotalProfit = (user.totalProfit || 0) + profit;
      const newTotalBuyIn = (user.totalBuyIn || 0) + completingSession.totalBuyIn;
      const winPercentage = newTotalProfit > 0 ? (newTotalProfit / newTotalBuyIn) * 100 : 0;
      await User.update(user.id, { totalProfit: newTotalProfit, totalBuyIn: newTotalBuyIn, winPercentage });

      // Calculate automated Payouts for confirmed stakes
      const sessionStakes = stakes.filter(s => s.sessionId === completingSession.id && s.status === "confirmed");
      const payoutPromises = sessionStakes.map(stake => {
        const amountOwed = (stake.percentage / 100) * Number(cashOut);
        return Payout.create({
          sessionId: completingSession.id,
          stakeId: stake.id,
          buyerId: stake.buyerId,
          buyerName: stake.buyerName,
          buyerCashTag: stake.buyerCashTag,
          sellerId: user.id,
          amountOwed: Number(amountOwed.toFixed(2)),
          status: "pending"
        });
      });

      await Promise.all(payoutPromises);

      setSessions(sessions.map(s => s.id === completingSession.id ? { ...s, status: "completed", cashOut: Number(cashOut), profit } : s));
      setCompletingSession(null);
      setCashOut("");
      alert("Session completed! Automated payouts have been generated.");
    } catch (error) {
      console.error(error);
      alert("Failed to complete session");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-600" /> Seller Dashboard
        </h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          {showCreate ? "Cancel" : <><PlusCircle className="w-5 h-5" /> List New Action</>}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">List Action for Sale</h2>
          <form onSubmit={handleCreateSession} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Platform / Game</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl font-medium" required>
                  <option value="Golden Dragon">Golden Dragon</option>
                  <option value="Diamond Dragon">Diamond Dragon</option>
                  <option value="Fire Phoenix">Fire Phoenix</option>
                  <option value="Magic City">Magic City</option>
                  <option value="Other">Other (Custom)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Total Buy-In ($)</label>
                <input type="number" min="1" step="0.01" value={totalBuyIn} onChange={e => setTotalBuyIn(e.target.value)} placeholder="e.g. 500" className="w-full p-3 border border-gray-300 rounded-xl font-medium" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Markup (1.0 = No Markup)</label>
                <input type="number" min="1" step="0.01" value={markup} onChange={e => setMarkup(e.target.value)} placeholder="e.g. 1.2" className="w-full p-3 border border-gray-300 rounded-xl font-medium" required />
                <p className="text-xs text-gray-500 mt-1">Example: A 1.2 markup means a $100 share costs $120.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Shares to Sell (%)</label>
                <input type="number" min="1" max="100" value={sharesAvailable} onChange={e => setSharesAvailable(e.target.value)} placeholder="e.g. 50" className="w-full p-3 border border-gray-300 rounded-xl font-medium" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your CashTag (for receiving payments)</label>
                <input type="text" value={cashTag} onChange={e => setCashTag(e.target.value)} placeholder="$YourCashTag" className="w-full p-3 border border-gray-300 rounded-xl font-medium font-mono text-blue-600" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description / Rules (Optional)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Any special rules or expected play time?" className="w-full p-3 border border-gray-300 rounded-xl font-medium" rows="3" />
              </div>
            </div>

            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
              <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg transition">
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: My Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">My Sessions</h2>
          {sessions.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200 text-gray-500 font-medium">
              You haven't listed any action yet.
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      🐟 {session.platform} <span className="text-gray-400 font-normal">|</span> ${session.totalBuyIn}
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      session.status === 'funding' ? 'bg-green-100 text-green-700 border-green-200' : 
                      session.status === 'active' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="p-4 grid md:grid-cols-2 gap-4 text-sm bg-white">
                    <div>
                      <p className="text-gray-500 mb-1">Available Shares:</p>
                      <p className="font-bold text-blue-600 text-lg">{session.availableShares}%</p>
                    </div>
                    {session.status === 'completed' ? (
                      <div>
                        <p className="text-gray-500 mb-1">Final Result:</p>
                        <p className={`font-bold text-lg ${session.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          Cashout: ${session.cashOut} ({session.profit > 0 ? '+' : ''}{session.profit})
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2 mt-2 md:mt-0">
                        {session.status === 'funding' && (
                          <button onClick={() => startSession(session)} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition text-xs">
                            Start Playing
                          </button>
                        )}
                        {session.status === 'active' && (
                          <button onClick={() => setCompletingSession(session)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition text-xs">
                            Enter Cashout & Finish
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Pending & Confirmed Stakes */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Backer Stakes</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">Pending Payments</h3>
            </div>
            {stakes.filter(s => s.status === 'pending').length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No pending stakes.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {stakes.filter(s => s.status === 'pending').map(stake => (
                  <li key={stake.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{stake.buyerName}</p>
                        <p className="text-xs text-gray-500 font-mono">{stake.buyerCashTag}</p>
                      </div>
                      <span className="font-bold text-blue-600">{stake.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Owes: <strong className="text-gray-900">${stake.amountPaid}</strong></span>
                      <button onClick={() => confirmStake(stake)} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md font-bold transition text-xs">
                        <CheckCircle className="w-4 h-4" /> Confirm Received
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-800">Confirmed Backers</h3>
            </div>
            {stakes.filter(s => s.status === 'confirmed').length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No confirmed stakes yet.</div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {stakes.filter(s => s.status === 'confirmed').map(stake => (
                  <li key={stake.id} className="p-4 bg-white flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-900">{stake.buyerName}</p>
                      <p className="text-xs text-gray-500">{stake.percentage}% Share</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${stake.amountPaid}</p>
                      <p className="text-xs text-green-600 font-bold">Paid</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>

      {/* Complete Session Modal */}
      {completingSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Finalize Session</h2>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Total Buy-In</p>
              <p className="text-3xl font-black text-gray-900">${completingSession.totalBuyIn}</p>
            </div>
            
            <form onSubmit={handleCompleteSession} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Amount Cashed Out ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={cashOut} 
                  onChange={e => setCashOut(e.target.value)} 
                  placeholder="e.g. 1500" 
                  className="w-full p-4 text-xl font-black text-center border-2 border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-100 transition" 
                  required 
                />
                <p className="text-sm text-gray-500 mt-2 text-center">Entering 0 means a complete bust.</p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setCompletingSession(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                  Complete & Generate Payouts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}