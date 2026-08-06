import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticate — MeritMind" },
      { name: "description", content: "Login or create an account to start your personalized scholarship journey." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, isProfileSetupCompleted, login, signup } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      if (isProfileSetupCompleted) {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/profile-setup" });
      }
    }
  }, [user, isProfileSetupCompleted, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Successfully logged in!");
      // Redirect handled by useEffect
    } catch (err: any) {
      setError(err.message || "Login failed.");
      toast.error(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(name, email, password);
      toast.success("Account created successfully. Please log in to continue.");
      // Clear fields and switch to login tab
      setName("");
      setPassword("");
      setConfirmPassword("");
      setActiveTab("login");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      toast.error(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Background gradients mirroring the premium MeritMind theme */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] aurora opacity-80" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Brand logo header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-3xl gradient-hero font-display text-xl font-black text-primary-foreground shadow-lg">
            M
          </span>
          <h2 className="mt-4 font-display text-2xl font-black tracking-tight text-foreground">
            MeritMind
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your personalized guide to funded education
          </p>
        </div>

        {/* Tab card */}
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as "login" | "signup");
            setError(null);
            setPassword("");
            setConfirmPassword("");
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted p-1">
            <TabsTrigger value="login" className="rounded-xl font-semibold py-2">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl font-semibold py-2">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login tab */}
          <TabsContent value="login" className="mt-4">
            <Card className="glass border-border/40 shadow-xl rounded-3xl">
              <CardHeader className="space-y-1">
                <CardTitle className="font-display text-xl font-bold">Welcome back</CardTitle>
                <CardDescription>
                  Enter your details to log in to your account
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="font-semibold text-xs">Email address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      className="rounded-xl border-input bg-card/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="font-semibold text-xs">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                        className="rounded-xl pr-10 border-input bg-card/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                      </button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full gradient-hero py-6 font-bold text-primary-foreground shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Loggin in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="font-bold text-primary hover:underline"
                    >
                      Sign up for free
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Sign Up tab */}
          <TabsContent value="signup" className="mt-4">
            <Card className="glass border-border/40 shadow-xl rounded-3xl">
              <CardHeader className="space-y-1">
                <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                  Get Started <Sparkles className="size-4 text-accent animate-pulse" />
                </CardTitle>
                <CardDescription>
                  Create an account to begin matching scholarships
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="font-semibold text-xs">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={submitting}
                      className="rounded-xl border-input bg-card/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="font-semibold text-xs">Email address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      className="rounded-xl border-input bg-card/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="font-semibold text-xs">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                        className="rounded-xl pr-10 border-input bg-card/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="font-semibold text-xs">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={submitting}
                        className="rounded-xl pr-10 border-input bg-card/50"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full gradient-hero py-6 font-bold text-primary-foreground shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="font-bold text-primary hover:underline"
                    >
                      Login here
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
