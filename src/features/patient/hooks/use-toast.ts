import toast from "react-hot-toast";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
}

export function showToast(options: ToastOptions | string) {
  if (typeof options === "string") {
    return toast(options);
  }

  const message = options.description
    ? `${options.title ? options.title + "\n" : ""}${options.description}`
    : options.title || "";

  if (options.variant === "destructive") {
    return toast.error(message, { duration: options.duration || 4000 });
  }

  if (options.variant === "success") {
    return toast.success(message, { duration: options.duration || 4000 });
  }

  return toast(message, { duration: options.duration || 4000 });
}

export function useToast() {
  return {
    toast: showToast,
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  };
}

export { toast };
