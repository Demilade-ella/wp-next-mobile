export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  categories: number[];
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string }>>;
  };
} 

// export interface IncidentPost {
//   id: number;
//   title: { rendered: string };
//   excerpt: { rendered: string };
//   content: { rendered: string };
//   date: string;
//   categories: number[];
//   _embedded?: {
//     "wp:term"?: Array<Array<{ id: number; name: string }>>;
//   };
// }