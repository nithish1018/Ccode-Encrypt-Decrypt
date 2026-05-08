import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { ThemeProvider } from '@/hooks/useTheme';

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <HomePage />
        <Toaster richColors position="top-right" theme="system" />
      </AppLayout>
    </ThemeProvider>
  );
}
