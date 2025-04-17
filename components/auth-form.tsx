import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function AuthForm({ onAuth }: { onAuth: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!auth) {
        setError("Firebase Auth not initialized.");
        setLoading(false);
        return;
      }
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth(userCredential.user);
    } catch (err: any) {
      setError("Authentication failed: " + (err.message || err.code || err.toString()));
      // Log the error for debugging
      console.error("Firebase Auth error:", err);
    }
    setLoading(false);
  };


  const handleSignOut = async () => {
    await signOut(auth);
    onAuth(null);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onAuth(result.user);
    } catch (err: any) {
      setError("Google sign-in failed: " + (err.message || err.code || err.toString()));
      console.error("Google Auth error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
      <button
        className="bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center w-full mb-4"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.59 2.38 30.71 0 24 0 14.82 0 6.74 5.2 2.69 12.81l7.98 6.2C12.13 13.12 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.56-.14-3.06-.38-4.5H24v9h12.44c-.54 2.85-2.17 5.26-4.6 6.89l7.11 5.53C43.97 38.04 46.1 31.77 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.69A14.51 14.51 0 019.5 24c0-1.64.28-3.23.8-4.69l-7.98-6.2A23.941 23.941 0 000 24c0 3.82.92 7.43 2.54 10.69l8.13-6z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.11-5.53C30.98 38.44 27.7 39.5 24 39.5c-6.38 0-11.87-3.62-14.33-8.81l-8.13 6C6.74 42.8 14.82 48 24 48z"/></g></svg>
        Continue with Google
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold mb-2">{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex items-center justify-center"
          type="submit"
          disabled={loading || !email || !password}
        >
          {loading ? (
            <span className="loader mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : null}
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          type="button"
          className="text-xs text-purple-600 underline"
          onClick={() => setIsSignUp(x => !x)}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </form>
      {/* Only show sign out if signed in */}
      {/* The parent controls auth state, so this is for demo; you can remove if not needed */}
      {/* <button
        className="mt-4 text-xs text-gray-500 underline"
        onClick={handleSignOut}
        type="button"
      >
        Sign Out
      </button> */}
    </div>
  );
}
