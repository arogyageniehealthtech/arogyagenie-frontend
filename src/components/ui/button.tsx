import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button.
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'default';
  /**
   * The size of the button.
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  /**
   * If true, displays a loading spinner and disables the button.
   */
  isLoading?: boolean;
  /**
   * Optional icon to display on the left side of the text.
   */
  leftIcon?: React.ReactNode;
  /**
   * Optional icon to display on the right side of the text.
   */
  rightIcon?: React.ReactNode;
  /**
   * If true, merges button styles onto its direct child element (Radix Slot pattern).
   */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = 'primary', 
      size = 'md', 
      isLoading = false, 
      leftIcon, 
      rightIcon, 
      asChild = false,
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";

    const variants: Record<string, string> = {
      default: "bg-[#6D5DF6] text-white shadow-sm hover:bg-[#5A4AD4]",
      primary: "bg-[#6D5DF6] text-white shadow-[0_4px_20px_0_rgba(109,93,246,0.2)] hover:bg-[#5A4AD4] hover:shadow-[0_10px_40px_-10px_rgba(109,93,246,0.5)]",
      secondary: "bg-[#8A7DFF]/10 text-[#6D5DF6] hover:bg-[#8A7DFF]/20",
      outline: "border border-[#E2E8F0] bg-white text-[#1E293B] shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] hover:bg-slate-50 hover:border-[#6D5DF6]/30",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-[#1E293B]",
      destructive: "bg-[#FF4D4F] text-white shadow-sm hover:bg-[#FF4D4F]/90 shadow-[0_4px_20px_0_rgba(255,77,79,0.2)]",
      success: "bg-[#34C759] text-white shadow-sm hover:bg-[#34C759]/90 shadow-[0_4px_20px_0_rgba(52,199,89,0.2)]",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 py-2.5 text-sm",
      lg: "h-14 px-8 text-base",
      icon: "h-11 w-11",
    };

    return (
      <Comp
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant] || variants.default,
          sizes[size],
          className
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {isLoading && (
              <Loader2 className={cn("mr-2 animate-spin", size === 'sm' ? "h-3 w-3" : "h-4 w-4")} />
            )}
            {!isLoading && leftIcon && (
              <span className={cn("mr-2 inline-flex", size === 'sm' ? "[&>svg]:h-3 [&>svg]:w-3" : "[&>svg]:h-4 [&>svg]:w-4")}>
                {leftIcon}
              </span>
            )}
            {children}
            {!isLoading && rightIcon && (
              <span className={cn("ml-2 inline-flex", size === 'sm' ? "[&>svg]:h-3 [&>svg]:w-3" : "[&>svg]:h-4 [&>svg]:w-4")}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
