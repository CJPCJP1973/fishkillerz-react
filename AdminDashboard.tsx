import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  TrendingUp,
  Gamepad2,
  Crown,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore, usePlayerStore } from '@/store';

// Mock admin data
const mockUsers = [
  { id: '1', username: 'InvestorPro', email: 'investor@example.com', role: 'investor', balance: 5000, status: 'active', joined: '2024-01-15' },
  { id: '2', username: 'FishMaster', email: 'player@example.com', role: 'player', balance: 2500, status: 'active', joined: '2024-01-10' },
  { id: '3', username: 'NewUser123', email: 'new@example.com', role: 'investor', balance: 100, status: 'pending', joined: '2024-01-20' },
  { id: '4', username: 'BannedUser', email: 'banned@example.com', role: 'player', balance: 0, status: 'banned', joined: '2023-12-01' },
];

const mockTransactions = [
  { id: '1', type: 'purchase', user: 'InvestorPro', player: 'OceanMaster', amount: 500, shares: 10, date: '2024-01-18', status: 'completed' },
  { id: '2', type: 'sale', user: 'FishMaster', player: 'ReelKing', amount: 400, shares: 10, date: '2024-01-17', status: 'completed' },
  { id: '3', type: 'withdrawal', user: 'InvestorPro', player: '-', amount: 1000, shares: 0, date: '2024-01-16', status: 'pending' },
  { id: '4', type: 'deposit', user: 'NewUser123', player: '-', amount: 500, shares: 0, date: '2024-01-15', status: 'completed' },
];

const mockReports = [
  { id: '1', reporter: 'User1', reported: 'BadPlayer', reason: 'Suspicious activity', date: '2024-01-18', status: 'open' },
  { id: '2', reporter: 'Investor2', reported: 'Scammer', reason: 'Fake profile', date: '2024-01-17', status: 'resolved' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { players } = usePlayerStore();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    setIsVisible(true);
  }, [user, navigate]);

  const stats = [
    { label: 'Total Users', value: '2,547', icon: Users, change: '+12%', positive: true },
    { label: 'Total Revenue', value: '$45,230', icon: DollarSign, change: '+23%', positive: true },
    { label: 'Active Players', value: players.length.toString(), icon: Gamepad2, change: '+5%', positive: true },
    { label: 'Platform ROI', value: '89%', icon: TrendingUp, change: '+2%', positive: true },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">{status}</Badge>;
      case 'banned':
      case 'open':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">{status}</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">{status}</Badge>;
      default:
        return <Badge className="bg-[#333333] text-[#b3b3b3]">{status}</Badge>;
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-['Montserrat']">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-[#b3b3b3]">Manage users, transactions, and platform settings</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#0d0d0d] border border-[#333333] p-1 mb-6 flex-wrap">
            <TabsTrigger
              value="overview"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <Shield className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`card-dark p-6 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    transitionTimingFunction: 'var(--ease-expo-out)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-[#00ff88]" />
                    </div>
                    <span className={`text-sm font-medium ${stat.positive ? 'text-[#00ff88]' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-[#b3b3b3] text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white font-['Montserrat']">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-dark p-6">
                <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-4">
                  {mockTransactions.slice(0, 4).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                        <p className="text-[#b3b3b3] text-sm">{tx.user}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${tx.amount}</p>
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-dark p-6">
                <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-4">
                  Top Players
                </h3>
                <div className="space-y-4">
                  {players.slice(0, 4).map((player) => (
                    <div key={player.id} className="flex items-center gap-4 p-3 bg-[#1a1a1a] rounded-lg">
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{player.username}</p>
                        <p className="text-[#b3b3b3] text-sm">{player.investorCount} investors</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#00ff88] font-bold">${player.lifetimeEarnings.toLocaleString()}</p>
                        <p className="text-[#b3b3b3] text-sm">{player.averageRoi}% ROI</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="card-dark overflow-hidden">
              <div className="p-4 border-b border-[#333333] flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3b3b3]" />
                  <Input placeholder="Search users..." className="input-dark pl-10" />
                </div>
                <Button variant="outline" className="btn-secondary">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333] hover:bg-transparent">
                    <TableHead className="text-[#b3b3b3]">User</TableHead>
                    <TableHead className="text-[#b3b3b3]">Role</TableHead>
                    <TableHead className="text-[#b3b3b3]">Balance</TableHead>
                    <TableHead className="text-[#b3b3b3]">Status</TableHead>
                    <TableHead className="text-[#b3b3b3]">Joined</TableHead>
                    <TableHead className="text-[#b3b3b3]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} className="border-[#333333] hover:bg-[#1a1a1a]">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-[#b3b3b3] text-sm">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[#1a1a1a] text-[#b3b3b3] border-[#333333]">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">${user.balance.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{user.joined}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-[#00ff88] hover:bg-[#00ff88]/10">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="card-dark overflow-hidden">
              <div className="p-4 border-b border-[#333333] flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3b3b3]" />
                  <Input placeholder="Search transactions..." className="input-dark pl-10" />
                </div>
                <Button variant="outline" className="btn-secondary">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333] hover:bg-transparent">
                    <TableHead className="text-[#b3b3b3]">Type</TableHead>
                    <TableHead className="text-[#b3b3b3]">User</TableHead>
                    <TableHead className="text-[#b3b3b3]">Player</TableHead>
                    <TableHead className="text-[#b3b3b3]">Amount</TableHead>
                    <TableHead className="text-[#b3b3b3]">Shares</TableHead>
                    <TableHead className="text-[#b3b3b3]">Date</TableHead>
                    <TableHead className="text-[#b3b3b3]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-[#333333] hover:bg-[#1a1a1a]">
                      <TableCell>
                        <Badge className="bg-[#1a1a1a] text-[#b3b3b3] border-[#333333]">
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{tx.user}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{tx.player}</TableCell>
                      <TableCell className="text-white font-medium">${tx.amount}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{tx.shares || '-'}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{tx.date}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="card-dark overflow-hidden">
              <div className="p-4 border-b border-[#333333] flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3b3b3]" />
                  <Input placeholder="Search reports..." className="input-dark pl-10" />
                </div>
                <Button variant="outline" className="btn-secondary">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#333333] hover:bg-transparent">
                    <TableHead className="text-[#b3b3b3]">Reporter</TableHead>
                    <TableHead className="text-[#b3b3b3]">Reported User</TableHead>
                    <TableHead className="text-[#b3b3b3]">Reason</TableHead>
                    <TableHead className="text-[#b3b3b3]">Date</TableHead>
                    <TableHead className="text-[#b3b3b3]">Status</TableHead>
                    <TableHead className="text-[#b3b3b3]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id} className="border-[#333333] hover:bg-[#1a1a1a]">
                      <TableCell className="text-white">{report.reporter}</TableCell>
                      <TableCell className="text-white">{report.reported}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{report.reason}</TableCell>
                      <TableCell className="text-[#b3b3b3]">{report.date}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-[#00ff88] hover:bg-[#00ff88]/10">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10">
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="card-dark p-6">
              <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-6">
                Platform Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Membership Price</p>
                    <p className="text-[#b3b3b3] text-sm">Current monthly subscription fee</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      defaultValue={9.99}
                      className="input-dark w-24 text-right"
                    />
                    <Button className="btn-primary">Update</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Platform Fee</p>
                    <p className="text-[#b3b3b3] text-sm">Percentage taken from each transaction</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      defaultValue={5}
                      className="input-dark w-24 text-right"
                    />
                    <span className="text-[#b3b3b3]">%</span>
                    <Button className="btn-primary">Update</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Minimum Share Price</p>
                    <p className="text-[#b3b3b3] text-sm">Lowest allowed share price for players</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      defaultValue={10}
                      className="input-dark w-24 text-right"
                    />
                    <Button className="btn-primary">Update</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Maintenance Mode</p>
                    <p className="text-[#b3b3b3] text-sm">Temporarily disable platform access</p>
                  </div>
                  <Button variant="outline" className="btn-secondary text-red-400 border-red-400/50 hover:bg-red-500/10">
                    Enable
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
