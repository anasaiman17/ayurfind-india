import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Menu, X, BookOpen, Search, Camera, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'identify', label: 'Identify Plant', icon: Camera },
    { id: 'search', label: 'Search Database', icon: Search },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card-strong border-b border-border/30"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavigate('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl nature-gradient flex items-center justify-center shadow-soft">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-pulse-gentle" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                VanaspatiVeda
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Indian Medicinal Plants
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigate(item.id)}
                  className={`gap-2 ${isActive ? 'nature-gradient shadow-soft' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 glass-card border-l border-border/30">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl nature-gradient flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold">VanaspatiVeda</h2>
                    <p className="text-xs text-muted-foreground">Navigation Menu</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full justify-start gap-3 h-12 ${isActive ? 'nature-gradient' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-8 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Data Source: Botanical Survey of India
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
