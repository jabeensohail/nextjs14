import { trpc, trpcClient } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppType } from 'next/app';

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <Component {...pageProps} />
      </trpc.Provider>
    </QueryClientProvider>
  );
};

export default MyApp;
