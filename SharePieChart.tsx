import { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SharePieChartProps {
  playerOwned: number;
  investorOwned: number;
  available: number;
  totalShares: number;
  size?: number;
}

export function SharePieChart({
  playerOwned,
  investorOwned,
  available,
  totalShares,
  size = 280,
}: SharePieChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const data: ChartData<'doughnut'> = {
    labels: ['Player Owned', 'Investor Owned', 'Available'],
    datasets: [
      {
        data: [playerOwned, investorOwned, available],
        backgroundColor: [
          'rgba(0, 255, 136, 0.8)',   // Neon green for player
          'rgba(0, 200, 255, 0.8)',   // Cyan for investors
          'rgba(51, 51, 51, 0.8)',    // Dark gray for available
        ],
        borderColor: [
          'rgba(0, 255, 136, 1)',
          'rgba(0, 200, 255, 1)',
          'rgba(51, 51, 51, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(0, 255, 136, 1)',
          'rgba(0, 200, 255, 1)',
          'rgba(80, 80, 80, 1)',
        ],
        hoverBorderColor: [
          'rgba(0, 255, 136, 1)',
          'rgba(0, 200, 255, 1)',
          'rgba(100, 100, 100, 1)',
        ],
        hoverBorderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '60%',
    radius: '90%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(13, 13, 13, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#b3b3b3',
        borderColor: '#333333',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const percentage = ((value / totalShares) * 100).toFixed(1);
            return `${context.label}: ${value} shares (${percentage}%)`;
          },
        },
      },
    },
    onHover: (_event, elements) => {
      if (elements.length > 0) {
        setHoveredSegment(elements[0].index);
      } else {
        setHoveredSegment(null);
      }
    },
  };

  const legendItems = [
    { label: 'Player Owned', value: playerOwned, color: '#00ff88', percentage: ((playerOwned / totalShares) * 100).toFixed(1) },
    { label: 'Investor Owned', value: investorOwned, color: '#00c8ff', percentage: ((investorOwned / totalShares) * 100).toFixed(1) },
    { label: 'Available', value: available, color: '#333333', percentage: ((available / totalShares) * 100).toFixed(1) },
  ];

  return (
    <div ref={chartRef} className="w-full">
      <div
        className={`relative transition-all duration-700 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
        style={{
          transitionTimingFunction: 'var(--ease-expo-out)',
        }}
      >
        {/* Chart Container */}
        <div
          className="relative mx-auto"
          style={{ width: size, height: size }}
        >
          {/* Glow Effect */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30 pointer-events-none"
            style={{
              background: `conic-gradient(from 0deg, #00ff88, #00c8ff, #333333, #00ff88)`,
            }}
          />

          {/* Chart */}
          <div className="relative z-10">
            <Doughnut data={data} options={options} />
          </div>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white font-['Montserrat']">
              {totalShares}
            </span>
            <span className="text-[#b3b3b3] text-sm">Total Shares</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {legendItems.map((item, index) => (
            <div
              key={item.label}
              className={`text-center p-4 rounded-lg bg-[#1a1a1a] border border-[#333333] transition-all duration-300 cursor-pointer ${
                hoveredSegment === index
                  ? 'border-[#00ff88] shadow-lg shadow-[#00ff88]/20'
                  : 'hover:border-[#333333]/80'
              } ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
                transitionTimingFunction: 'var(--ease-expo-out)',
              }}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-white font-bold font-['Montserrat'] text-lg">
                {item.value}
              </p>
              <p className="text-[#b3b3b3] text-xs">{item.label}</p>
              <p className="text-[#00ff88] text-sm font-medium mt-1">
                {item.percentage}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Alternative 3D-style pie chart component
export function SharePieChart3D({
  playerOwned,
  investorOwned,
  available,
  totalShares,
}: SharePieChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const data = [
    { label: 'Player Owned', value: playerOwned, color: '#00ff88' },
    { label: 'Investor Owned', value: investorOwned, color: '#00c8ff' },
    { label: 'Available', value: available, color: '#333333' },
  ];

  // Calculate SVG paths for pie slices
  const calculateSlicePath = (startAngle: number, endAngle: number, radius: number) => {
    const start = {
      x: 150 + radius * Math.cos((startAngle * Math.PI) / 180),
      y: 150 + radius * Math.sin((startAngle * Math.PI) / 180),
    };
    const end = {
      x: 150 + radius * Math.cos((endAngle * Math.PI) / 180),
      y: 150 + radius * Math.sin((endAngle * Math.PI) / 180),
    };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M 150 150 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  let currentAngle = -90;
  const slices = data.map((item) => {
    const angle = (item.value / totalShares) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...item,
      path: calculateSlicePath(startAngle, endAngle, 100),
      percentage: ((item.value / totalShares) * 100).toFixed(1),
    };
  });

  return (
    <div ref={chartRef} className="w-full">
      <div
        className={`relative transition-all duration-700 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
        style={{
          transitionTimingFunction: 'var(--ease-expo-out)',
        }}
      >
        {/* 3D Pie Chart */}
        <div className="relative mx-auto" style={{ width: 300, height: 300 }}>
          {/* Shadow */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/50 rounded-full blur-xl"
          />

          {/* SVG Chart */}
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full"
            style={{
              transform: 'perspective(1000px) rotateX(30deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Side walls for 3D effect */}
            {slices.map((slice, index) => (
              <g key={`side-${index}`}>
                <path
                  d={slice.path}
                  fill={slice.color}
                  opacity={0.6}
                  transform="translate(0, 20)"
                />
              </g>
            ))}

            {/* Top faces */}
            {slices.map((slice, index) => (
              <path
                key={`top-${index}`}
                d={slice.path}
                fill={slice.color}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={2}
                className="transition-all duration-300 hover:opacity-90 cursor-pointer"
              />
            ))}

            {/* Center hole for donut effect */}
            <circle cx="150" cy="150" r="50" fill="#0d0d0d" />
          </svg>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white font-['Montserrat']">
              {totalShares}
            </span>
            <span className="text-[#b3b3b3] text-xs">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {slices.map((slice, index) => (
            <div
              key={slice.label}
              className={`text-center p-4 rounded-lg bg-[#1a1a1a] border border-[#333333] transition-all duration-300 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${400 + index * 100}ms`,
                transitionTimingFunction: 'var(--ease-expo-out)',
              }}
            >
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: slice.color }}
              />
              <p className="text-white font-bold font-['Montserrat'] text-lg">
                {slice.value}
              </p>
              <p className="text-[#b3b3b3] text-xs">{slice.label}</p>
              <p className="text-[#00ff88] text-sm font-medium mt-1">
                {slice.percentage}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
