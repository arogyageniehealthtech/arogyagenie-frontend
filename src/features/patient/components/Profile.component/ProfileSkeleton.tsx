export function ProfileSkeleton() {
  return (
    <div className="w-full max-w-175 mx-auto animate-pulse flex flex-col gap-6">
     
      <div className="h-35 bg-slate-200 rounded-b-3xl" />


      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden mx-4 md:mx-0">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-[#E2E8F0] last:border-0 flex items-center px-4"
          >
            <div className="w-5 h-5 rounded bg-slate-200 mr-4" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="ml-auto w-4 h-4 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      
      <div className="mx-4 md:mx-0 h-14 bg-white rounded-xl border border-[#E2E8F0]" />
    </div>
  );
}