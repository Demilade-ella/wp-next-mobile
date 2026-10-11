import '@/styles/Header.css';

interface HeaderProps {
  token: string | null;
  onLogout: () => void;
}

export default function Header({ token, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">Citizens Incident Report</h1>
        <p className="header-subtitle">Report & View Emergency Incidents</p>
      </div>

      {token && (
        <button
          onClick={onLogout}
          className="sign-out-btn"
        >
          Sign Out
        </button>
      )}
    </header>
  );
}