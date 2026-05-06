import React, { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Navigate } from "react-router-dom";
import { Lock } from "lucide-react";

export const Login: React.FC = () => {
  const { user, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please sign in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Authentication failed. Please check your credentials.");
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-neutral-900 p-8 rounded-3xl shadow-lg shadow-indigo-500/5 text-neutral-100 border border-neutral-800 select-none">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Admin<span className="text-indigo-400">.Panel</span></h2>
          <p className="mt-2 text-xs text-neutral-500 uppercase tracking-widest font-medium">
            {isSignUp ? "Create new administrator" : "Manage your gallery"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && <div className="text-red-400 text-sm font-medium text-center bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-neutral-600 outline-none text-sm text-neutral-100"
                placeholder="ryucagubg@gmail.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-neutral-600 outline-none text-sm text-neutral-100"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Authenticating..." : (isSignUp ? "Create Account & Sign In" : "Sign In")}
          </button>
          
          <div className="text-center mt-4">
            <button 
              type="button" 
              className="text-xs text-neutral-500 hover:text-indigo-400 transition-colors"
              onClick={() => {
                 setIsSignUp(!isSignUp);
                 setError("");
              }}
            >
              {isSignUp ? "Already have an account? Sign In" : "Need to register? Sign Up here"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
