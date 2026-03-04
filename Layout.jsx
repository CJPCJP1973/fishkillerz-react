import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User } from "@/entities/User";
import { Home, List, PieChart, DollarSign, LayoutDashboard, Shield, LogOut, Menu, X, User as UserIcon } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    User.me()
      .then((u) => {
        if (!u && location.pathname !== "/") {
          // If unauthenticated, redirect home
          navigate("/");
        }
        setUser(u);
      })
      .catch(console.error);
  }, [location.pathname]);

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Sessions", path: "/sessions", icon: <List className="w-5 h-5" /> },
    { name: "Stats", path: "/stats", icon: <PieChart className="w-5 h-5" /> },
    { name: "Seller Dashboard", path: "/seller", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Payouts", path: "/payouts", icon: <DollarSign className="w-5 h-5" /> },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin", path: "/admin", icon: <Shield className="w-5 h-5" /> });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
                <span>🐟 FishKillersStaking</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-blue-700">
                  <Link to="/subscribe" className="flex items-center gap-2 text-sm text-blue-100 hover:text-white">
                    <UserIcon className="w-5 h-5" />
                    {user.fullName || user.email}
                    {user.subscriptionStatus === "active" && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">Pro</span>
                    )}
                  </Link>
                  <button onClick={handleLogout} className="text-blue-200 hover:text-white">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-blue-700">
                  <a href="/login" className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md text-sm font-medium transition">
                    Login / Sign Up
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-200 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-900 pb-4 px-2 pt-2 space-y-1 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-800 hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/subscribe"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
                >
                  <UserIcon className="w-5 h-5" /> Account / Sub
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white text-left"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-800 hover:text-white"
              >
                Login / Sign Up
              </a>
            )}
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>FishKillersStaking &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
        <p className="mt-1">Powered by AgentUI</p>
      </footer>
    </div>
  );
}