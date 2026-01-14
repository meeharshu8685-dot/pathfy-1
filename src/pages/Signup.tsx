import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowRight, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const referredBy = localStorage.getItem("referred_by") || undefined;
    const { error } = await signUp(email, password, fullName, phone, referredBy);

    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (referredBy) {
      localStorage.removeItem("referred_by");
    }

    toast({
      title: "Welcome to Pathfy!",
      description: "Your account has been created. You've received 5 free tokens.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Glass Card */}
        <div className="glass-card-strong rounded-3xl p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                Pathfy
              </span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              Log in
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-1">Sign up</h1>
            <p className="text-muted-foreground text-sm">Start executing your goals today</p>
          </div>

          {/* Bonus Badge */}
          <div className="mb-6 p-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">5 Free Tokens</p>
              <p className="text-xs text-muted-foreground">Get started instantly</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-12 h-14 rounded-2xl glass-input text-base"
                required
              />
            </div>

            {/* Mobile Number Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Phone className="w-5 h-5" />
              </div>
              <Input
                type="tel"
                placeholder="mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-12 h-14 rounded-2xl glass-input text-base"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                type="email"
                placeholder="e-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 rounded-2xl glass-input text-base"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type="password"
                placeholder="password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 rounded-2xl glass-input text-base"
                minLength={6}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-medium shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
