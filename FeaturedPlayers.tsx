import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, TrendingUp, Gamepad2, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store';
import type { Player } from '@/types';

function PlayerCard({ player, index }: { player: Player; index: number }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const rotations = [-1, 0, 1];
  const verticalOffsets = [0, -40, 0];

  return (
    <div
      ref={cardRef}
      className={`card-dark p-6 group cursor-pointer transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{
        transform: isVisible
          ? `translateY(${verticalOffsets[index]}px) rotate(${rotations[index]}deg)`
          : 'translateY(50px) rotateY(-30deg)',
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-full border-2 border-[#00ff88] animate-ping" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white font-['Montserrat'] group-hover:text-[#00ff88] transition-colors duration-300">
            {player.username}
          </h3>
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

export function FeaturedPlayers() {
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const { players } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const featuredPlayers = players.slice(0, 3);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Montserrat'] mb-4 transition-all duration-700 ${
              titleVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          >
            Featured <span className="gradient-text">Players</span>
          </h2>
          <div
            className={`h-1 w-24 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent mx-auto transition-all duration-500 ${
              titleVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{
              transitionDelay: '300ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          />
          <p
            className={`text-[#b3b3b3] mt-4 max-w-xl mx-auto transition-all duration-700 ${
              titleVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionDelay: '400ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          >
            Top-performing fish table professionals seeking staking
          </p>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/players')}
            className="btn-secondary px-8 py-4 group"
          >
            View All Players
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
