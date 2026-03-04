import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  TrendingUp,
  Gamepad2,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePlayerStore } from '@/store';
import type { Player } from '@/types';

function PlayerCard({ player, index }: { player: Player; index: number }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`card-dark p-6 group cursor-pointer transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
      }}
      onClick={() => navigate(`/players/${player.id}`)}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          <img
            src={player.avatar}
            alt={player.username}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#333333] group-hover:border-[#00ff88] transition-all duration-300"
          />
          {player.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00ff88] rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-['Montserrat'] group-hover:text-[#00ff88] transition-colors duration-300">
              {player.username}
            </h3>
            {player.status === 'sold_out' && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                Sold Out
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#b3b3b3] text-sm">
            <MapPin className="w-3 h-3" />
            <span>{player.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-medium">{player.rating}</span>
            <span className="text-[#b3b3b3] text-sm">({player.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center gap-2 text-[#b3b3b3] text-xs mb-1">
            <DollarSign className="w-3 h-3 text-[#00ff88]" />
            Earnings
          </div>
          <p className="text-white font-bold font-['Montserrat']">
            ${player.lifetimeEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center gap-2 text-[#b3b3b3] text-xs mb-1">
            <TrendingUp className="w-3 h-3 text-[#00ff88]" />
            ROI
          </div>
          <p className="text-white font-bold font-['Montserrat']">{player.averageRoi}%</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center gap-2 text-[#b3b3b3] text-xs mb-1">
            <Gamepad2 className="w-3 h-3 text-[#00ff88]" />
            Games
          </div>
          <p className="text-white font-bold font-['Montserrat']">{player.totalGames}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center gap-2 text-[#b3b3b3] text-xs mb-1">
            <TrendingUp className="w-3 h-3 text-[#00ff88]" />
            Win Rate
          </div>
          <p className="text-white font-bold font-['Montserrat']">{player.winRate}%</p>
        </div>
      </div>

      {/* Share Info */}
      <div className="border-t border-[#333333] pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#b3b3b3] text-sm">Share Price</p>
            <p className="text-xl font-bold text-[#00ff88] font-['Montserrat']">
              ${player.sharePrice}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#b3b3b3] text-sm">Available</p>
            <p className="text-white font-bold font-['Montserrat']">
              {player.availableShares}/{player.totalShares}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        className="w-full bg-[#1a1a1a] hover:bg-[#00ff88] text-white hover:text-black border border-[#333333] hover:border-[#00ff88] transition-all duration-300 group/btn"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/players/${player.id}`);
        }}
      >
        View Profile
        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </Button>
    </div>
  );
}

export function Players() {
  const { players } = usePlayerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'earnings' | 'roi' | 'price'>('rating');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold_out'>('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filter and sort players
  const filteredPlayers = players
    .filter((player) => {
      const matchesSearch =
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'available' && player.status === 'available') ||
        (filterStatus === 'sold_out' && player.status === 'sold_out');
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'earnings':
          return b.lifetimeEarnings - a.lifetimeEarnings;
        case 'roi':
          return b.averageRoi - a.averageRoi;
        case 'price':
          return a.sharePrice - b.sharePrice;
        default:
          return 0;
      }
    });

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Montserrat'] mb-4">
            Browse <span className="gradient-text">Players</span>
          </h1>
          <p className="text-[#b3b3b3] max-w-xl">
            Discover verified fish table players and invest in their success. 
            Browse profiles, check stats, and buy shares.
          </p>
        </div>

        {/* Filters */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: '200ms',
            transitionTimingFunction: 'var(--ease-expo-out)',
          }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
            <Input
              type="text"
              placeholder="Search players by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark pl-12 w-full"
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="btn-secondary flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0d0d0d] border-[#333333]">
              <DropdownMenuItem
                onClick={() => setSortBy('rating')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                Rating
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('earnings')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                Lifetime Earnings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('roi')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                ROI
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('price')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                Share Price
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="btn-secondary flex items-center gap-2"
              >
                Status: {filterStatus === 'all' ? 'All' : filterStatus === 'available' ? 'Available' : 'Sold Out'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0d0d0d] border-[#333333]">
              <DropdownMenuItem
                onClick={() => setFilterStatus('all')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                All Players
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterStatus('available')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                Available Shares
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterStatus('sold_out')}
                className="text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 cursor-pointer"
              >
                Sold Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-[#b3b3b3]">
          Showing {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPlayers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <Search className="w-10 h-10 text-[#333333]" />
            </div>
            <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-2">
              No players found
            </h3>
            <p className="text-[#b3b3b3]">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
