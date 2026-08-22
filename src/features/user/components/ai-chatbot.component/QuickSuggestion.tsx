

export const QuickSuggestion = ({ onSelect }: { onSelect: (t: string) => void }) => {
  const suggestions = ["Severe headache", "Mild headache", "Dull pain"];
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
      {suggestions.map((text) => (
        <button 
          key={text}
          onClick={() => onSelect(text)}
          className="px-4 py-2 bg-[#06112B] border border-[#8B5CF6]/30 rounded-full text-xs text-slate-300 hover:border-[#8B5CF6] hover:text-white transition-all whitespace-nowrap"
        >
          {text}
        </button>
      ))}
    </div>
  );
};