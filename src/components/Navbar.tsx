
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Cart } from '@/components/Cart';
import { GoogleTranslate } from '@/components/GoogleTranslate';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface NavbarProps {
  isAdmin?: boolean;
  onAdminToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar = ({ isAdmin, onAdminToggle, searchQuery, onSearchChange }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleAdminClick = () => {
    if (adminUser) {
      if (onAdminToggle) {
        onAdminToggle();
      }
    } else {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    if (isAdmin && onAdminToggle) {
      onAdminToggle(); // Exit admin mode
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/20 backdrop-blur-md bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg"></div>
            <h1 className="text-xl font-orbitron font-semibold text-primary-gradient">SPICE BAZAAR</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar (Desktop) */}
          {onSearchChange && (
            <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
          )}

          {/* Google Translate, Cart & Admin Controls & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <GoogleTranslate />
            <Cart />
            
            {adminUser && (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdminClick}
                  className="focus-ring bg-background/80"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isAdmin ? '👤 USER MODE' : '🔧 ADMIN MODE'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 py-4 space-y-4">
            {/* Mobile Search */}
            {onSearchChange && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-2 px-3 rounded-md transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Admin Controls */}
            {adminUser && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAdminClick}
                  className="w-full focus-ring"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isAdmin ? '👤 USER MODE' : '🔧 ADMIN MODE'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
