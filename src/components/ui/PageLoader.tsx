import { cn } from '../../lib/utils.ts';

interface PageLoaderProps {
  /**
   * Optional text to display below the spinner.
   * @default "Loading ArogyaGenie..."
   */
  message?: string;
  /**
   * If true, the loader will take up the full screen height and width.
   * If false, it will take up 100% of its parent container.
   * @default true
   */
  fullScreen?: boolean;
}

/**
 * A beautiful, branded loading indicator used for route transitions
 * and heavy data fetching states.
 */
export const PageLoader = ({ 
  message = "Loading ArogyaGenie...", 
  fullScreen = true 
}: PageLoaderProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-[#F7F8FC]",
        fullScreen ? "h-screen w-screen" : "h-full w-full min-h-75"
      )}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Pulsing background ring */}
        <div className="absolute h-full w-full animate-ping rounded-full bg-[#6D5DF6]/20"></div>
        
        {/* Spinning primary ring */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6D5DF6] border-t-transparent"></div>
      </div>
      
      {message && (
        <p className="mt-6 text-sm font-medium text-slate-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};