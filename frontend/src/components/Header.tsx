import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { authService } from '../services/authService';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-white to-gray-200 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" strokeWidth={2} />
          <h1 className="font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-3xl">Docs.io</h1>
        </div>

        {user && (
          <div className="flex items-center gap-4 text-gray-900">
            <span className="text-md">
              Welcome, <span className="font-semibold">{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
