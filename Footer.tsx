import { Link } from 'react-router-dom';
import { Crown, Twitter, MessageCircle, Instagram, Youtube, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Players', path: '/players' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: '#' },
    { name: 'Discord', icon: MessageCircle, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'YouTube', icon: Youtube, url: '#' },
  ];

  return (
    <footer className="bg-[#0d0d0d] border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Crown className="w-8 h-8 text-[#00ff88] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold font-['Montserrat']">
                Fish<span className="text-[#00ff88]">Stake</span>
              </span>
            </Link>
            <p className="text-[#b3b3b3] text-sm leading-relaxed">
              The premier platform for investing in fish table players. Buy shares, 
              share profits, and build your staking portfolio.
            </p>
            <div className="flex items-center gap-2 text-[#b3b3b3]">
              <Mail className="w-4 h-4 text-[#00ff88]" />
              <span className="text-sm">support@fishstake.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 font-['Montserrat']">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#b3b3b3] text-sm hover:text-[#00ff88] transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00ff88] transition-all duration-200 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 font-['Montserrat']">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-[#b3b3b3] text-sm hover:text-[#00ff88] transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00ff88] transition-all duration-200 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 font-['Montserrat']">
              Connect
            </h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333333] flex items-center justify-center text-[#b3b3b3] hover:text-[#00ff88] hover:border-[#00ff88] hover:shadow-lg hover:shadow-[#00ff88]/20 transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-[#b3b3b3] text-sm mb-3">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="input-dark flex-1 text-sm"
                />
                <Button className="btn-primary px-4">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#333333]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#b3b3b3] text-sm">
              © 2024 FishStake. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms"
                className="text-[#b3b3b3] text-sm hover:text-[#00ff88] transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-[#b3b3b3] text-sm hover:text-[#00ff88] transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-[#b3b3b3] text-sm hover:text-[#00ff88] transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
