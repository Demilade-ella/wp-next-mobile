import { AiFillAlert } from "react-icons/ai";
import '@/styles/NotificationBanner.css';

interface NotificationBannerProps {
  onRefresh: () => void;
}

export default function NotificationBanner({ onRefresh }: NotificationBannerProps) {
  return (
    <div className="not-banner">
      <div className="not-text-group">
        <span><AiFillAlert size={20} /></span>
        <span>A new incident has been reported!</span>
      </div>
      <button
        onClick={onRefresh}
        className="not-refresh-btn"
      >
        Refresh Feed
      </button>
    </div>
  );
}