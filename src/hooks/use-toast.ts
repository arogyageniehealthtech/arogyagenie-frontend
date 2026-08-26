import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    toast: (options: { title?: string; description?: string; variant?: 'destructive' | 'default' }) => {
      const message = `${options.title ? options.title + '\n' : ''}${options.description || ''}`;
      if (options.variant === 'destructive') {
        toast.error(message);
      } else {
        toast.success(message);
      }
    }
  };
};
