import React from "react";
import '@/styles/LoginForm.css';

interface LoginFormProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleLogin: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoggingIn: boolean;
  authError: string | null;
  switchToLogin?: () => void;
  switchToRegister: () => void;
}

export default function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  isLoggingIn,
  authError,
  switchToRegister,
}: LoginFormProps) {
  return (
    <div className="login-card">
      <div className="login-tab-container">
        <button type="button" className="login-tab">
          Sign In
        </button>
        <button type="button" onClick={switchToRegister} className="login-tab">
          Create Account
        </button>
      </div>

      {authError && <div className="login-error-box">{authError}</div>}

      <form onSubmit={handleLogin} className="login-form-group">
        <div className="login-form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoggingIn} className="login-submit-btn">
          {isLoggingIn ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}