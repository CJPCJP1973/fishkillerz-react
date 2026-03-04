import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const particleCount = 80;
    const connectionDistance = 150;
    const maxConnections = 3;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 136, ${particle.opacity})`;
          ctx.fill();

          // Draw connections (only check every 3rd particle for performance)
          if (i % 3 === 0) {
            let connections = 0;
            for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
              const dx = particles[j].x - particle.x;
              const dy = particles[j].y - particle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.15 * (1 - distance / connectionDistance)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                connections++;
              }
            }
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const stats = [
    { icon: Users, value: '2,500+', label: 'Active Investors' },
    { icon: DollarSign, value: '$1.2M+', label: 'Winnings Shared' },
    { icon: TrendingUp, value: '89%', label: 'Avg Investor ROI' },
    { icon: Award, value: '4.9/5', label: 'Trust Rating' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 0.8 }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black pointer-events-none" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(0, 255, 136, 0.08) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 70%, rgba(0, 255, 200, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-['Montserrat'] mb-6">
            <span
              className={`block transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: '300ms',
                transitionTimingFunction: 'var(--ease-expo-out)',
              }}
            >
              Invest in the{' '}
              <span className="gradient-text neon-glow-text">Best</span>
            </span>
            <span
              className={`block transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: '500ms',
                transitionTimingFunction: 'var(--ease-expo-out)',
              }}
            >
              Fish Table{' '}
              <span className="gradient-text neon-glow-text">Players</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg sm:text-xl text-[#b3b3b3] mb-10 max-w-2xl mx-auto transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0 blur-0'
                : 'opacity-0 translate-y-4 blur-sm'
            }`}
            style={{
              transitionDelay: '700ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          >
            Buy shares in proven players. Share the profits. Build your staking 
            portfolio on the most trusted fish tables investment platform.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionDelay: '900ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          >
            <Button
              onClick={() => navigate('/players')}
              className="btn-primary text-lg px-8 py-4 group"
            >
              Explore Players
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              onClick={() => navigate('/how-it-works')}
              variant="outline"
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionDelay: '1100ms',
              transitionTimingFunction: 'var(--ease-expo-out)',
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group"
                style={{
                  animationDelay: `${1300 + index * 80}ms`,
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-[#00ff88] transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-2xl sm:text-3xl font-bold text-white font-['Montserrat']">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-[#b3b3b3]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none" />
    </section>
  );
}
