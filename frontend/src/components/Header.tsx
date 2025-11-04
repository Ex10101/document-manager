import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h1 className="text-2xl font-bold">Docs.io</h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              Welcome, <span className="font-semibold">{user.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
