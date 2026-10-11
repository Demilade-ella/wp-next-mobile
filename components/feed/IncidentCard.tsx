import { Post } from "@/types";
import { AiFillAlert } from "react-icons/ai";
import '@/styles/IncidentCard.css';

interface IncidentCardProps {
  post: Post;
}

export default function IncidentCard({ post }: IncidentCardProps) {
  const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <div className="card">
      <div className="header-row">
        <h3
          className="card-title"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <span className="time-stamp">
          {new Date(post.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {imageUrl && (
        <div className="image-wrapper">
          <img src={imageUrl} alt="Incident Evidence" className="image" />
        </div>
      )}

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      <div className="footer-row">
        <span className="badge"><AiFillAlert size={20} /> Incident Report</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}