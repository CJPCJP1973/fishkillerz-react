import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  PieChart,
  History,
  Settings,
  Bell,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store';
import { SharePieChart } from '@/components/SharePieChart';

// Mock portfolio data
const mockPortfolio = [
  {
    id: '1',
    playerName: 'OceanMaster',
    playerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    shares: 10,
    purchasePrice: 50,
    totalInvestment: 500,
    currentValue: 650,
    profit: 150,
    roi: 30,
  },
  {
    id: '2',
    playerName: 'ReelKing',
    playerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    shares: 5,
    purchasePrice: 40,
    totalInvestment: 200,
    currentValue: 240,
    profit: 40,
    roi: 20,
  },
];

// Mock transactions
const mockTransactions = [
  { id: '1', type: 'purchase', description: 'Bought 10 shares of OceanMaster', amount: -500, date: '2024-01-18' },
  { id: '2', type: 'purchase', description: 'Bought 5 shares of ReelKing', amount: -200, date: '2024-01-17' },
  { id: '3', type: 'dividend', description: 'Dividend from OceanMaster', amount: 75, date: '2024-01-15' },
  { id: '4', type: 'deposit', description: 'Account deposit', amount: 1000, date: '2024-01-10' },
];

// Mock notifications
const mockNotifications = [
  { id: '1', title: 'OceanMaster won $2,500!', message: 'Your investment just gained 15% in value', type: 'success', time: '2 hours ago' },
  { id: '2', title: 'New player available', message: 'DeepHunter just listed shares at $60', type: 'info', time: '5 hours ago' },
  { id: '3', title: 'Dividend received', message: 'You received $75 from OceanMaster', type: 'success', time: '1 day ago' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsVisible(true);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const totalInvested = mockPortfolio.reduce((sum, item) => sum + item.totalInvestment, 0);
  const totalValue = mockPortfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const totalProfit = totalValue - totalInvested;
  const totalRoi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const stats = [
    {
      label: 'Total Invested',
      value: `$${totalInvested.toLocaleString()}`,
      icon: Wallet,
      change: null,
    },
    {
      label: 'Current Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      change: `+${totalProfit >= 0 ? '' : '-'}$${Math.abs(totalProfit).toLocaleString()}`,
      positive: totalProfit >= 0,
    },
    {
      label: 'Total ROI',
      value: `${totalRoi >= 0 ? '+' : ''}${totalRoi.toFixed(1)}%`,
      icon: TrendingUp,
      change: null,
      positive: totalRoi >= 0,
    },
    {
      label: 'Active Investments',
      value: mockPortfolio.length.toString(),
      icon: PieChart,
      change: null,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-['Montserrat'] mb-2">
                Welcome back, <span className="gradient-text">{user.username}</span>
              </h1>
              <p className="text-[#b3b3b3]">
                Manage your investments and track your portfolio performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!user.isMember && user.role === 'player' && (
                <Button
                  onClick={() => navigate('/pricing')}
                  className="btn-primary"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
              <Button
                variant="outline"
                className="btn-secondary relative"
              >
                <Bell className="w-5 h-5" />
                {mockNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00ff88] rounded-full text-black text-xs font-bold flex items-center justify-center">
                    {mockNotifications.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: '100ms',
            transitionTimingFunction: 'var(--ease-expo-out)',
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="card-dark p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#00ff88]" />
                </div>
                {stat.change && (
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      stat.positive ? 'text-[#00ff88]' : 'text-red-400'
                    }`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-[#b3b3b3] text-sm mb-1">{stat.label}</p>
              <p
                className={`text-2xl font-bold font-['Montserrat'] ${
                  stat.positive === false ? 'text-red-400' : 'text-white'
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#0d0d0d] border border-[#333333] p-1 mb-6 flex-wrap">
            <TabsTrigger
              value="portfolio"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <PieChart className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <History className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {mockPortfolio.length > 0 ? (
              <>
                {/* Portfolio Distribution */}
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-6">
                    Portfolio Distribution
                  </h3>
                  <SharePieChart
                    playerOwned={0}
                    investorOwned={totalInvested}
                    available={0}
                    totalShares={totalInvested}
                  />
                </div>

                {/* Investments List */}
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-6">
                    Your Investments
                  </h3>
                  <div className="space-y-4">
                    {mockPortfolio.map((investment) => (
                      <div
                        key={investment.id}
                        className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#1a1a1a]/80 transition-colors cursor-pointer"
                        onClick={() => navigate(`/players/${investment.id}`)}
                      >
                        <img
                          src={investment.playerAvatar}
                          alt={investment.playerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{investment.playerName}</p>
                          <p className="text-[#b3b3b3] text-sm">
                            {investment.shares} shares @ ${investment.purchasePrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            ${investment.currentValue.toLocaleString()}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              investment.profit >= 0 ? 'text-[#00ff88]' : 'text-red-400'
                            }`}
                          >
                            {investment.profit >= 0 ? '+' : ''}
                            {investment.roi}% (${investment.profit})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card-dark p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <PieChart className="w-10 h-10 text-[#333333]" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-2">
                  No investments yet
                </h3>
                <p className="text-[#b3b3b3] mb-6">
                  Start building your portfolio by investing in fish table players
                </p>
                <Button onClick={() => navigate('/players')} className="btn-primary">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Browse Players
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="card-dark overflow-hidden">
              <div className="p-6 border-b border-[#333333]">
                <h3 className="text-xl font-bold text-white font-['Montserrat']">
                  Transaction History
                </h3>
              </div>
              <div className="divide-y divide-[#333333]">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-[#1a1a1a]">
                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-[#b3b3b3] text-sm">{tx.date}</p>
                    </div>
                    <span
                      className={`font-bold ${
                        tx.amount >= 0 ? 'text-[#00ff88]' : 'text-white'
                      }`}
                    >
                      {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="card-dark overflow-hidden">
              <div className="p-6 border-b border-[#333333] flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-['Montserrat']">
                  Notifications
                </h3>
                <Button variant="ghost" className="text-[#00ff88] hover:bg-[#00ff88]/10">
                  Mark all as read
                </Button>
              </div>
              <div className="divide-y divide-[#333333]">
                {mockNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-[#1a1a1a]">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'success'
                            ? 'bg-[#00ff88]/20'
                            : 'bg-blue-500/20'
                        }`}
                      >
                        {notification.type === 'success' ? (
                          <TrendingUp
                            className={`w-5 h-5 ${
                              notification.type === 'success' ? 'text-[#00ff88]' : 'text-blue-400'
                            }`}
                          />
                        ) : (
                          <Bell className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{notification.title}</p>
                        <p className="text-[#b3b3b3] text-sm">{notification.message}</p>
                        <p className="text-[#666666] text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="card-dark p-6">
              <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-6">
                Account Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-[#b3b3b3] text-sm">Receive updates about your investments</p>
                  </div>
                  <Button variant="outline" className="btn-secondary">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Two-Factor Authentication</p>
                    <p className="text-[#b3b3b3] text-sm">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" className="btn-secondary">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Change Password</p>
                    <p className="text-[#b3b3b3] text-sm">Update your account password</p>
                  </div>
                  <Button variant="outline" className="btn-secondary">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
