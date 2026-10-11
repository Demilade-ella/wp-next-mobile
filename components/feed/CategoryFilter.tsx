import { Category } from "@/types";
import '@/styles/CategoryFilter.css';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | number;
  onSelectCategory: (catId: string | number) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="category-container">
      <button
        onClick={() => onSelectCategory("all")}
        className={`category-pill ${
          selectedCategory === "all" ? "category-pill-active" : " "
        }`}
      >
        All Incidents
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`category-pill ${
            selectedCategory === cat.id ? "category-pill-active" : " "
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}