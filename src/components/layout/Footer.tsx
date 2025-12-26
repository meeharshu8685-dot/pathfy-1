import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Pathly</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Convert goals into realistic, dependency-aware execution systems.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/reality-check" className="hover:text-primary transition-colors">Path Feasibility</Link></li>
              <li><Link to="/problem-decomposer" className="hover:text-primary transition-colors">Problem Decomposer</Link></li>
              <li><Link to="/roadmap" className="hover:text-primary transition-colors">Roadmap Builder</Link></li>
              <li><Link to="/study-optimizer" className="hover:text-primary transition-colors">Study Optimizer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Profile</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help / FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>© {new Date().getFullYear()} Pathly. Built for execution, not excuses.</p>
          <p className="text-xs opacity-70">
            Built by <span className="text-primary hover:underline cursor-default">Harsh Vishwakarma</span>,
            with inputs from <span className="text-primary hover:underline cursor-default">Abhishek Vishwakarma</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
