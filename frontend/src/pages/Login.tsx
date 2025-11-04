import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { authService } from '../services/authService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorAlert } from '../components/ErrorAlert';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      navigate('/documents');
    } catch (err: any) {
      console.error('Login error caught:', err);
      const errorMessage = err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 w-20 h-20 p-4 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900">Welcome to <span className='font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'>Docs.io</span></h1>
          <p className="text-gray-600 text-lg font-medium mt-5">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ErrorAlert message={error} />

            <Input
              type="text"
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />

            <Input
              type="password"
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              isLoading={loading}
              loadingText="Signing in..."
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
