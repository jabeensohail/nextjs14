import { createTRPCReact } from '@trpc/react';
import { AppRouter } from '../server/trpc/router'; // Adjust the import to your router type

// Create TRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// TRPC client setup for v10 with link configuration
import { httpBatchLink } from '@trpc/client';

// Client configuration with the correct API URL
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc', // This is your API URL
      // Optional: add headers or auth logic here if required
      headers() {
        return {
          // Add authorization or other headers if needed
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Example, if you are using auth tokens
        };
      }
    }),
  ],
});
