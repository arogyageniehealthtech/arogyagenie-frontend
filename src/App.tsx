import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Provider as ReduxProvider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { router } from './routes/router.tsx';
import { ErrorBoundary } from './ErrorBoundary';
import { store } from './store/index.ts';
import { useAppDispatch } from './store/hooks.ts';
import { initializeAuth } from './store/slices/authSlice.ts';
import {PartnerProviderContext} from '@/features/partner/context/PartnerContext.tsx'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

function AuthSessionInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('AccessToken');
    if (token) {
      dispatch(initializeAuth());
    }
  }, [dispatch]);

  return null;
}

export default function App() {
  return (
    <PartnerProviderContext>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <AuthSessionInitializer />
            <RouterProvider router={router} />
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '18px',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                  padding: '16px 20px',
                  border: '1px solid #E2E8F0',
                },
                success: { iconTheme: { primary: '#34C759', secondary: '#FFFFFF' } },
                error: { iconTheme: { primary: '#FF4D4F', secondary: '#FFFFFF' } },
              }} 
            />
          </QueryClientProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
    </PartnerProviderContext>
  );
}

