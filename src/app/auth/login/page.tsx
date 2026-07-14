"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury p-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/3 blur-3xl" />

      <div className="w-full max-w-md space-y-8 relative animate-fade-in-up">
        {/* Logo */}
        <div className="text-center animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/40 transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 group">
              <Dumbbell className="h-8 w-8 transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text-gold">FitElite</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your gym management dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-strong luxury-shadow-xl animate-fade-in-up animate-delay-100">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@fitelite.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-border accent-amber-500" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-amber-600 hover:text-amber-700 hover:underline font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground animate-fade-in-up animate-delay-200">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-amber-600 hover:text-amber-700 hover:underline font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}