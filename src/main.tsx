import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import StoreProvider from './store/index.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StoreProvider>
);
