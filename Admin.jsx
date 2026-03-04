import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Subscription } from "@/entities/Subscription";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [pendingSubs, setPendingSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await User.me();
        if (!currentUser || currentUser.role !== "admin") {
          window.location.href = "/";
          return;
        }
        setUser(currentUser);
        fetchPendingSubs();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fetchPendingSubs = async () => {
    try {
      const subs = await Subscription.filter({ status: "pending" }, "-createdAt");
      setPendingSubs(subs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (sub) => {
    try {
      await Subscription.update(sub.id, { status: "active" });
      await User.update(sub.userId, { subscriptionStatus: "active", isSubscribed: true });
      fetchPendingSubs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (sub) => {
    try {
      await Subscription.update(sub.id, { status: "rejected" });
      await User.update(sub.userId, { subscriptionStatus: "inactive", isSubscribed: false });
      fetchPendingSubs();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gray-900 rounded-2xl p-8 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-yellow-500" /> Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage subscriptions, approve users, and oversee the platform.</p>
        </div>
        <div className="bg-gray-800 px-6 py-4 rounded-xl border border-gray-700 text-center">
          <span className="block text-sm text-gray-400 font-medium">Pending Approvals</span>
          <span className="block text-3xl font-bold text-yellow-500">{pendingSubs.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-900">Pending Subscription Verifications</h2>
        </div>
        
        {pendingSubs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No pending subscriptions to approve.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">CashTag</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{sub.userName || "Unknown"}</td>
                    <td className="px-6 py-4 font-mono text-blue-600 bg-blue-50/50 rounded inline-block m-3">{sub.cashTag}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${sub.amount}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(sub)}
                          className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md font-medium text-sm transition"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(sub)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md font-medium text-sm transition"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure ShieldCheck is available, importing it at the top or defining it here if missing
import { ShieldCheck } from "lucide-react";