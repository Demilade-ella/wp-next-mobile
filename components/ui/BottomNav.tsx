import { AiFillAlert } from "react-icons/ai";
import { MdOutlineFeed } from "react-icons/md";
import '@/styles/BottomNav.css';

interface BottomNavProps {
  activeTab: "feed" | "report";
  setActiveTab: (tab: "feed" | "report") => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        onClick={() => setActiveTab("feed")}
        className={`bottom-nav-btn ${activeTab === "feed" ? "active-feed" : ""}`}
      >
        <span><MdOutlineFeed size={20} /></span>
        <span>Browse Feed</span>
      </button>
      <button
        onClick={() => setActiveTab("report")}
        className={`bottom-nav-btn ${activeTab === "report" ? "active-report" : ""}`}
      >
        <span><AiFillAlert size={20} /></span>
        <span>Report Incident</span>
      </button>
    </nav>
  );
}