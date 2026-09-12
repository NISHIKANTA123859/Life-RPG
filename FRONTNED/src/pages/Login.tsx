import { useState } from "react";
import { Eye, EyeOff, Sword, Zap } from "lucide-react";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Login({ onLogin, onRegister }: Props) {
  const [email, setEmail] = useState("aria@liferp.gg");
  const [password, setPassword] = useState("••••••••••");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0B0D14" }}
    >
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }} />
      <div className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #22D3EE, transparent)" }} />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center grad-primary mx-auto mb-4"
            style={{ boxShadow: "0 0 30px rgba(139,92,246,0.5)" }}
          >
            <Sword size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">LIFE RPG</h1>
          <p className="text-[#A0A4B8] text-sm">Continue your adventure</p>
        </div>

        {/* Card */}
        <div
          className="glass-card rounded-2xl p-6 border border-white/10"
          style={{ boxShadow: "0 0 40px rgba(139,92,246,0.1)" }}
        >
          <h2 className="font-display font-bold text-white text-xl mb-5">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all focus:border-violet-500/60"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A4B8] hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-display font-bold text-white text-sm grad-primary glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                  Authenticating...
                </span>
              ) : (
                <><Zap size={15} /> Enter the Game</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-[#A0A4B8] text-sm">New hero? </span>
            <button onClick={onRegister} className="text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">
              Create Account
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#A0A4B8]/50 mt-6">
          By signing in you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
