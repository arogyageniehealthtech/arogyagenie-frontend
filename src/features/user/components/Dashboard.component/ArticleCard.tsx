
import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';


export interface Article {
  id: number;
  title: string;
  category: string;
  readTime: string;
  image: string;
  color: string;
}

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="group relative shrink-0 w-64 h-80 rounded-3xl overflow-hidden cursor-pointer snap-start shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-2 bg-slate-900">
      
 
      <img 
        src={article.image} 
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-90"
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/95 via-slate-900/40 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90"></div>
      
   
      <div className="absolute top-4 left-4 z-20">
        <span className={`text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full shadow-md ${article.color}`}>
          {article.category}
        </span>
      </div>

     
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end">
        <h4 className="text-white font-bold text-lg leading-tight mb-3 group-hover:text-indigo-200 transition-colors duration-300">
          {article.title}
        </h4>
        
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <Clock size={14} />
            {article.readTime}
          </div>
          
       
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <ChevronRight size={16} className="text-white" />
          </div>
        </div>
      </div>
      
    </div>
  );
};