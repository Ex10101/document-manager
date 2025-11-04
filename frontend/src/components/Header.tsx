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
    <header className="bg-linear-to-r from-white to-gray-200 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" strokeWidth={2} />
            <h1 className="font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-xl sm:text-2xl lg:text-3xl">Docs.io</h1>
          </div>

          {user && (
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-gray-900 w-full sm:w-auto">
              <span className="text-sm sm:text-md text-center">
                Welcome, <span className="font-semibold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
