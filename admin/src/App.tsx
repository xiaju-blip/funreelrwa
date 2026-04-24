import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Assets from './pages/Assets';
import Dramas from './pages/Dramas';
import Orders from './pages/Orders';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import Stakes from './pages/Stakes';
import Vip from './pages/Vip';
import VipPackages from './pages/VipPackages';
import Positions from './pages/Positions';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">加载中...</div>;
  return user?.isAdmin ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="assets" element={<Assets />} />
        <Route path="dramas" element={<Dramas />} />
        <Route path="orders" element={<Orders />} />
        <Route path="positions" element={<Positions />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="settings" element={<Settings />} />
        <Route path="shop" element={<Shop />} />
        <Route path="stakes" element={<Stakes />} />
        <Route path="vip" element={<Vip />} />
        <Route path="vip-packages" element={<VipPackages />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}