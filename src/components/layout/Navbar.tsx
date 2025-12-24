import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X, User, LogOut, Receipt } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/reality-check", label: "Path Feasibility" },
  { href: "/approach-planner", label: "Approach Planner" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/roadmap-history", label: "History" },
  { href: "/study-optimizer", label: "Optimizer" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.display_name || profile?.full_name || user?.email?.split("@")[0] || "User";
  const getInitials = () => displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card-strong backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-300">
              Pathly
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={location.pathname === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-[100px] truncate">
                            {displayName}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/pricing" className="flex items-center gap-2 cursor-pointer">
                            <Zap className="w-4 h-4" />
                            Get Tokens
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/payment-history" className="flex items-center gap-2 cursor-pointer">
                            <Receipt className="w-4 h-4" />
                            Payment History
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="hero" size="sm">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant={location.pathname === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
