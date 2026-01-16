import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import VideosPage from './components/VideosPage';
import CreatorsPage from './components/CreatorsPage';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  const AppLayout = () => (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Outlet />
    </div>
  );

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/videos" replace />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/videos" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
