import React from "react";
import '@/styles/RegisterForm.css';

interface RegisterFormProps {
  regUsername: string;
  setRegUsername: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regPassword: string;
  setRegPassword: (val: string) => void;
  handleRegister: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoggingIn: boolean;
  authError: string | null;
  switchToLogin: () => void;
}

export default function RegisterForm({
  regUsername,
  setRegUsername,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  handleRegister,
  isLoggingIn,
  authError,
  switchToLogin,
}: RegisterFormProps) {
  return (
    <div className="register-card">
      <div className="register-tab-container">
        <button onClick={switchToLogin} className="register-tab">
          Sign In
        </button>
        <button className="register-tab">
          Create Account
        </button>
      </div>

      {authError && <div className="register-error-box">{authError}</div>}

      <form onSubmit={handleRegister} className="register-form-group">
        <div className="register-form-group">
          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            required
          />
        </div>
        <div className="register-form-group">
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
        </div>
        <div className="register-form-group">
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoggingIn} className="register-submit-btn">
          {isLoggingIn ? "Creating Account..." : "Register & Sign In"}
        </button>
      </form>
    </div>
  );
}