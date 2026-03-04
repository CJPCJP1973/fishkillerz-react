import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Payout } from "@/entities/Payout";
import { Session } from "@/entities/Session";
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function Payouts() {
  const [user, setUser] = useState(null);
  const [owedToMe, setOwedToMe] = useState([]);
  const [owedByMe, setOwedByMe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await User.me();
        if (!currentUser) {
          window.location.href = "/login";
          return;
        }
        setUser(currentUser);

        // Fetch payouts where user is buyer
        const myWinnings = await Payout.filter({ buyerId: currentUser.id }, "-createdAt");
        setOwedToMe(myWinnings);

        // Fetch payouts where user is seller
        const myDebts = await Payout.filter({ sellerId: currentUser.id }, "-createdAt");
        setOwedByMe(myDebts);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkPaid = async (payout) => {
    if (!window.confirm(`Did you successfully send $${payout.amountOwed} to ${payout.buyerCashTag}?`)) return;

    try {
      await Payout.update(payout.id, { status: "paid" });
      setOwedByMe(owedByMe.map(p => p.id === payout.id ? { ...p, status: "paid" } : p));
    } catch (error) {
      console.error(error);
      alert("Failed to mark as paid");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Payouts...</div>;

  const totalOwedToMe = owedToMe.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amountOwed, 0);
  const totalOwedByMe = owedByMe.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amountOwed, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-400" /> Automated Payouts
          </h1>
          <p className="text-green-100 mt-2">Manage your winnings and settle your action with backers.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-center min-w-[150px]">
            <p className="text-sm font-medium text-green-100 uppercase tracking-wider mb-1">Incoming</p>
            <p className="text-3xl font-black text-green-400">${totalOwedToMe.toFixed(2)}</p>
          </div>
          {user?.isSubscribed && (
            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-center min-w-[150px]">
              <p className="text-sm font-medium text-red-200 uppercase tracking-wider mb-1">Outgoing</p>
              <p className="text-3xl font-black text-white">${totalOwedByMe.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Incoming Payouts (Owed to User) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              My Winnings
            </h2>
          </div>
          
          {owedToMe.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No winnings to display yet.</p>
              <p className="text-sm text-gray-400 mt-1">Back some action to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {owedToMe.map((payout) => (
                <li key={payout.id} className="p-6 hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-lg">${payout.amountOwed}</span>
                      <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                        payout.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payout.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      from <span className="font-medium text-gray-700">Session #{payout.sessionId.slice(-6)}</span>
                    </p>
                  </div>
                  {payout.status === 'pending' ? (
                    <div className="text-right text-sm">
                      <p className="text-gray-500 mb-1">Awaiting payment to:</p>
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        {user.cashTag}
                      </span>
                    </div>
                  ) : (
                    <div className="text-right flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-4 h-4" /> Paid
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Outgoing Payouts (Owed by User - Sellers Only) */}
        {user?.isSubscribed && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Backer Payouts <span className="text-sm font-normal text-gray-500">(To Pay)</span>
              </h2>
            </div>

            {owedByMe.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-medium">
                You have no pending payouts to send.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {owedByMe.map((payout) => (
                  <li key={payout.id} className="p-6 hover:bg-gray-50 transition space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 mb-1">{payout.buyerName}</p>
                        <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 block w-fit">
                          {payout.buyerCashTag}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block font-black text-red-600 text-xl">${payout.amountOwed}</span>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                          payout.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {payout.status}
                        </span>
                      </div>
                    </div>
                    
                    {payout.status === 'pending' && (
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-yellow-500" /> Send via Cash App
                        </p>
                        <button
                          onClick={() => handleMarkPaid(payout)}
                          className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-lg transition shadow-sm"
                        >
                          Mark as Paid
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}