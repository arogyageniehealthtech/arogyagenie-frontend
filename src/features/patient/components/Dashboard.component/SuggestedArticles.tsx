
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ArticleCard, type Article } from './ArticleCard';

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Heart-Healthy Mediterranean Recipes",
    category: "Nutrition",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    color: "bg-orange-500",
  },
  {
    id: 2,
    title: "5 Morning Stretches for Better Posture",
    category: "Physiotherapy",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    color: "bg-indigo-500",
  },
  {
    id: 3,
    title: "Understanding Your Deep Sleep Cycles",
    category: "Wellness",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=600&q=80",
    color: "bg-cyan-500",
  },
  {
    id: 4,
    title: "Managing Stress During the Workday",
    category: "Mental Health",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80",
    color: "bg-rose-500",
  },
];

export const SuggestedArticles: React.FC = () => {
  return (
    <div className="mt-8 w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-[#1E293B] text-lg">Suggested for You</h3>
        <button className="text-[#4F46E5] text-sm font-bold hover:underline flex items-center gap-1 transition-colors hover:text-indigo-700">
          See All <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>


      <div className="flex overflow-x-auto gap-6 pb-12 pt-4 px-2 snap-x snap-mandatory scrollbar-hide after:content-[''] after:w-4 after:shrink-0">
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
    </div>
  );
};