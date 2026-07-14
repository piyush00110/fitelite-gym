"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    setTimeout(() => { router.push("/"); }, 1000);
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury p-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl animate-float" />

      <div className="w-full max-w-md space-y-8 relative animate-fade-in-up">
        {/* Logo */}
        <div className="text-center animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/40 transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 group">
              <Dumbbell className="h-8 w-8 transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text-gold">FitElite</h1>
          <p className="text-muted-foreground mt-2">Create your gym management account</p>
        </div>

        {/* Signup Form */}
        <Card className="glass-strong luxury-shadow-xl animate-fade-in-up animate-delay-100">
          <CardContent className="p-8">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
                  <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
                  <Input id="email" type="email" placeholder="admin@fitelite.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10 pr-10 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1 mt-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle className={`h-3 w-3 ${req.met ? "text-emerald-500" : "text-muted-foreground"}`} />
                        <span className={req.met ? "text-emerald-600" : "text-muted-foreground"}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="pl-10 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300" required />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground animate-fade-in-up animate-delay-200">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 hover:underline font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}