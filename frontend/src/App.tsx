import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Documents } from './pages/Documents';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authService } from './services/authService';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/documents" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
