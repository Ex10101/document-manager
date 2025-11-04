import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
