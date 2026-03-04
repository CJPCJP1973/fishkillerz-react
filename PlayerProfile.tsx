import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Calendar,
  TrendingUp,
  Gamepad2,
  DollarSign,
  Users,
  ArrowLeft,
  MessageSquare,
  Share2,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePlayerStore, useAuthStore } from '@/store';
import { SharePieChart } from '@/components/SharePieChart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock game history data
const mockGameHistory = [
  { id: '1', date: '2024-01-15', tournament: 'Ocean Classic', buyIn: 500, winnings: 1200, roi: 140 },
  { id: '2', date: '2024-01-12', tournament: 'Deep Sea Challenge', buyIn: 1000, winnings: 2500, roi: 150 },
  { id: '3', date: '2024-01-08', tournament: 'Reel Masters', buyIn: 300, winnings: 0, roi: -100 },
  { id: '4', date: '2024-01-05', tournament: 'Apex Predator', buyIn: 750, winnings: 1800, roi: 140 },
  { id: '5', date: '2024-01-02', tournament: 'Coral Cup', buyIn: 400, winnings: 900, roi: 125 },
];

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    investorName: 'CryptoWhale',
    investorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Amazing player! Consistent returns and great communication. Highly recommend investing.',
    date: '2024-01-10',
  },
  {
    id: '2',
    investorName: 'StakeMaster',
    investorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Been staking for 3 months, ROI is exactly as advertised. Very professional.',
    date: '2024-01-05',
  },
  {
    id: '3',
    investorName: 'FishInvestor',
    investorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Solid player with good fundamentals. Would like to see more frequent updates.',
    date: '2023-12-28',
  },
];

export function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { players, selectedPlayer, setSelectedPlayer } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [shareAmount, setShareAmount] = useState(1);
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  useEffect(() => {
    const player = players.find((p) => p.id === id);
    if (player) {
      setSelectedPlayer(player);
      setTimeout(() => setIsVisible(true), 100);
    } else {
      navigate('/players');
    }
  }, [id, players, setSelectedPlayer, navigate]);

  if (!selectedPlayer) {
    return null;
  }

  const player = selectedPlayer;
  const investorOwned = player.totalShares - player.availableShares - Math.floor(player.totalShares * 0.3);
  const playerOwned = Math.floor(player.totalShares * 0.3);

  const totalInvestment = shareAmount * player.sharePrice;

  const handleBuyShares = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Handle purchase logic here
    setShowBuyDialog(false);
    alert(`Successfully purchased ${shareAmount} shares for $${totalInvestment}!`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/players')}
          className={`flex items-center gap-2 text-[#b3b3b3] hover:text-[#00ff88] transition-all duration-500 mb-6 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Players
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div
            className={`lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-expo-out)' }}
          >
            <div className="card-dark p-6 sticky top-24">
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto relative">
                  <img
                    src={player.avatar}
                    alt={player.username}
                    className="w-full h-full rounded-full object-cover border-4 border-[#333333]"
                  />
                  {/* Glow Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#00ff88] opacity-50 animate-pulse" />
                  <div className="absolute inset-[-8px] rounded-full border border-[#00ff88]/30" />
                </div>
                {player.isVerified && (
                  <div className="absolute bottom-0 right-1/2 translate-x-12 w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name & Status */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-1">
                  {player.username}
                </h1>
                <div className="flex items-center justify-center gap-2 text-[#b3b3b3] text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {player.location}
                </div>
                <Badge
                  className={`${
                    player.status === 'available'
                      ? 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50'
                      : 'bg-red-500/20 text-red-400 border-red-500/50'
                  }`}
                >
                  {player.status === 'available' ? 'Shares Available' : 'Sold Out'}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-bold text-white">{player.rating}</span>
                <span className="text-[#b3b3b3]">({player.reviewCount} reviews)</span>
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-center gap-2 text-[#b3b3b3] text-sm mb-6">
                <Calendar className="w-4 h-4" />
                Member since {player.memberSince}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full btn-primary"
                      disabled={player.status !== 'available'}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Buy Shares
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0d0d0d] border-[#333333]">
                    <DialogHeader>
                      <DialogTitle className="text-white font-['Montserrat']">
                        Buy Shares in {player.username}
                      </DialogTitle>
                      <DialogDescription className="text-[#b3b3b3]">
                        Purchase shares to invest in this player's future earnings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label className="text-white">Number of Shares</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Input
                            type="number"
                            min={1}
                            max={player.availableShares}
                            value={shareAmount}
                            onChange={(e) => setShareAmount(parseInt(e.target.value) || 1)}
                            className="input-dark"
                          />
                          <span className="text-[#b3b3b3] whitespace-nowrap">
                            @ ${player.sharePrice}/share
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#1a1a1a] rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#b3b3b3]">Share Price</span>
                          <span className="text-white">${player.sharePrice}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#b3b3b3]">Quantity</span>
                          <span className="text-white">{shareAmount}</span>
                        </div>
                        <div className="border-t border-[#333333] pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-white font-bold">Total</span>
                            <span className="text-[#00ff88] font-bold text-xl">
                              ${totalInvestment}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={handleBuyShares} className="w-full btn-primary">
                        Confirm Purchase
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full btn-secondary">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Player
                </Button>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 bg-[#1a1a1a] border-[#333333] hover:border-[#00ff88]">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 bg-[#1a1a1a] border-[#333333] hover:border-red-500 hover:text-red-400">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div
            className={`lg:col-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
            style={{
              transitionDelay: '200ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full bg-[#0d0d0d] border border-[#333333] p-1 mb-6">
                <TabsTrigger
                  value="overview"
                  className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 data-[state=active]:bg-[#00ff88] data-[state=active]:text-black"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="card-dark p-4">
                    <div className="flex items-center gap-2 text-[#b3b3b3] text-sm mb-2">
                      <DollarSign className="w-4 h-4 text-[#00ff88]" />
                      Lifetime Earnings
                    </div>
                    <p className="text-2xl font-bold text-white font-['Montserrat']">
                      ${player.lifetimeEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="card-dark p-4">
                    <div className="flex items-center gap-2 text-[#b3b3b3] text-sm mb-2">
                      <Gamepad2 className="w-4 h-4 text-[#00ff88]" />
                      Total Games
                    </div>
                    <p className="text-2xl font-bold text-white font-['Montserrat']">
                      {player.totalGames}
                    </p>
                  </div>
                  <div className="card-dark p-4">
                    <div className="flex items-center gap-2 text-[#b3b3b3] text-sm mb-2">
                      <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                      Win Rate
                    </div>
                    <p className="text-2xl font-bold text-white font-['Montserrat']">
                      {player.winRate}%
                    </p>
                  </div>
                  <div className="card-dark p-4">
                    <div className="flex items-center gap-2 text-[#b3b3b3] text-sm mb-2">
                      <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                      Average ROI
                    </div>
                    <p className="text-2xl font-bold text-[#00ff88] font-['Montserrat']">
                      {player.averageRoi}%
                    </p>
                  </div>
                  <div className="card-dark p-4">
                    <div className="flex items-center gap-2 text-[#b3b3b3] text-sm mb-2">
                      <Users className="w-4 h-4 text-[#00ff88]" />
                      Investors
                    </div>
                    <p className="text-2xl font-bold text-white font-['Montserrat']">
                      {player.investorCount}
                    </p>
                  </div>
                  <div className="card-dark p-4">
                    <div className="flex items-center gap-2 text-[#b3b3b3] text-sm mb-2">
                      <DollarSign className="w-4 h-4 text-[#00ff88]" />
                      Share Price
                    </div>
                    <p className="text-2xl font-bold text-[#00ff88] font-['Montserrat']">
                      ${player.sharePrice}
                    </p>
                  </div>
                </div>

                {/* Share Distribution */}
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-6">
                    Share Distribution
                  </h3>
                  <SharePieChart
                    playerOwned={playerOwned}
                    investorOwned={investorOwned}
                    available={player.availableShares}
                    totalShares={player.totalShares}
                  />
                </div>

                {/* Bio */}
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-4">
                    About
                  </h3>
                  <p className="text-[#b3b3b3] leading-relaxed mb-4">{player.bio}</p>
                  <h4 className="text-lg font-semibold text-white font-['Montserrat'] mb-2">
                    Playing Style
                  </h4>
                  <p className="text-[#b3b3b3] leading-relaxed">{player.playingStyle}</p>
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance">
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-6">
                    Performance Metrics
                  </h3>
                  <div className="space-y-6">
                    {/* Monthly Performance */}
                    <div>
                      <h4 className="text-white font-semibold mb-4">Monthly ROI</h4>
                      <div className="space-y-3">
                        {['Jan', 'Dec', 'Nov', 'Oct', 'Sep'].map((month, index) => {
                          const roi = [68, 72, 65, 70, 75][index];
                          return (
                            <div key={month} className="flex items-center gap-4">
                              <span className="text-[#b3b3b3] w-12">{month}</span>
                              <div className="flex-1 h-8 bg-[#1a1a1a] rounded-lg overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-lg flex items-center justify-end pr-2"
                                  style={{ width: `${roi}%` }}
                                >
                                  <span className="text-black text-sm font-bold">{roi}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#333333]">
                      <div>
                        <p className="text-[#b3b3b3] text-sm">Best Month</p>
                        <p className="text-[#00ff88] font-bold text-lg">+125% ROI</p>
                      </div>
                      <div>
                        <p className="text-[#b3b3b3] text-sm">Worst Month</p>
                        <p className="text-red-400 font-bold text-lg">-15% ROI</p>
                      </div>
                      <div>
                        <p className="text-[#b3b3b3] text-sm">Consistency Score</p>
                        <p className="text-white font-bold text-lg">8.5/10</p>
                      </div>
                      <div>
                        <p className="text-[#b3b3b3] text-sm">Risk Level</p>
                        <p className="text-yellow-400 font-bold text-lg">Medium</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <div className="card-dark overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#1a1a1a]">
                      <tr>
                        <th className="text-left text-[#b3b3b3] text-sm font-medium p-4">Date</th>
                        <th className="text-left text-[#b3b3b3] text-sm font-medium p-4">Tournament</th>
                        <th className="text-right text-[#b3b3b3] text-sm font-medium p-4">Buy-in</th>
                        <th className="text-right text-[#b3b3b3] text-sm font-medium p-4">Winnings</th>
                        <th className="text-right text-[#b3b3b3] text-sm font-medium p-4">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockGameHistory.map((game) => (
                        <tr key={game.id} className="border-t border-[#333333] hover:bg-[#1a1a1a]/50">
                          <td className="p-4 text-white">{game.date}</td>
                          <td className="p-4 text-white">{game.tournament}</td>
                          <td className="p-4 text-right text-white">${game.buyIn}</td>
                          <td className="p-4 text-right text-[#00ff88]">${game.winnings}</td>
                          <td className={`p-4 text-right font-bold ${game.roi > 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
                            {game.roi > 0 ? '+' : ''}{game.roi}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="card-dark p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.investorAvatar}
                          alt={review.investorName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{review.investorName}</h4>
                            <span className="text-[#b3b3b3] text-sm">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-[#333333]'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[#b3b3b3]">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
