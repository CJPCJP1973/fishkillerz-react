import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Subscription } from "@/entities/Subscription";
import { DollarSign, ShieldCheck, Clock, AlertCircle } from "lucide-react";

export default function Subscribe() {
  const [user, setUser] = useState(null);
  const [cashTag, setCashTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const currentUser = await User.me();
        if (!currentUser) {
          window.location.href = "/login";
          return;
        }
        setUser(currentUser);
        setCashTag(currentUser.cashTag || "");

        // Check if there is already a pending or active subscription request
        const subs = await Subscription.filter({ userId: currentUser.id }, "-createdAt", 1);
        if (subs.length > 0) {
          setActiveSub(subs[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!cashTag.startsWith("$")) {
      setError("CashTag must start with $");
      setSubmitting(false);
      return;
    }

    try {
      // Update the user's cash tag if they haven't set it yet
      if (user.cashTag !== cashTag) {
        await User.update(user.id, { cashTag });
      }

      // Create a pending subscription record
      const newSub = await Subscription.create({
        userId: user.id,
        userName: user.fullName || user.email,
        cashTag: cashTag,
        amount: 1.99,
        status: "pending"
      });
      
      await User.update(user.id, { subscriptionStatus: "pending" });

      setActiveSub(newSub);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting your request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const renderStatus = () => {
    if (user?.subscriptionStatus === "active" || activeSub?.status === "active") {
      return (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center shadow-sm">
          <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">You are Subscribed!</h2>
          <p className="text-lg">Your $1.99 subscription is active. You can now sell action and buy stakes on the platform.</p>
        </div>
      );
    }

    if (user?.subscriptionStatus === "pending" || activeSub?.status === "pending") {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-8 text-center shadow-sm">
          <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
          <p className="text-lg mb-4">We are verifying your payment of $1.99 from {activeSub?.cashTag || user?.cashTag}.</p>
          <p className="text-sm opacity-80">This process is usually completed within 12-24 hours. Once the owner ($unclehomie75) verifies the payment, your account will be activated.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
        <div className="bg-blue-900 p-8 text-white text-center">
          <h2 className="text-3xl font-extrabold mb-2">Unlock Full Access</h2>
          <p className="text-blue-200 text-lg">Subscribe to buy and sell stakes for just $1.99/month</p>
        </div>
        
        <div className="p-8">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-8 flex flex-col items-center text-center">
            <span className="text-green-800 font-bold mb-2">Step 1: Send Payment</span>
            <div className="text-4xl font-black text-green-600 mb-2">$1.99</div>
            <p className="text-gray-600 mb-4">Send exactly $1.99 via Cash App to the owner:</p>
            <div className="bg-white border-2 border-green-300 rounded-lg px-6 py-3 font-mono text-xl font-bold text-gray-900 shadow-sm">
              $unclehomie75
            </div>
            <p className="text-sm text-gray-500 mt-4">Make sure to include your name in the payment note!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Step 2: Confirm Your CashTag</label>
              <p className="text-sm text-gray-500 mb-2">Enter the CashTag you used to send the payment so we can verify it.</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={cashTag}
                  onChange={(e) => setCashTag(e.target.value)}
                  placeholder="$YourCashTag"
                  className="pl-10 w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-lg"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {submitting ? "Submitting..." : "I Have Sent The Payment"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {renderStatus()}
    </div>
  );
}