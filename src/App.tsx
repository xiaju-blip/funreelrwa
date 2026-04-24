import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Assets from './pages/Assets';
import AssetDetail from './pages/AssetDetail';
import StakeDetail from './pages/StakeDetail';
import ShopDetail from './pages/ShopDetail';
import Whitepaper from './pages/Whitepaper';
import Market from './pages/Market';
import Drama from './pages/Drama';
import Profile from './pages/Profile';
import Stake from './pages/Stake';
import Tasks from './pages/Tasks';
import Shop from './pages/Shop';
import Positions from './pages/Positions';
import Transactions from './pages/Transactions';
import Points from './pages/Points';
import VIP from './pages/VIP';
import VIPPurchase from './pages/VIPPurchase';
import Invite from './pages/Invite';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import Notifications from './pages/Notifications';
import DramaPlay from './pages/Play';
import MyStakes from './pages/MyStakes';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          <Route path="/market" element={<Market />} />
          <Route path="/drama" element={<Drama />} />
          <Route path="/play/:id" element={<DramaPlay />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/stake/:id" element={<StakeDetail />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/whitepaper/:section" element={<Whitepaper />} />
          <Route path="/positions" element={<PrivateRoute><Positions /></PrivateRoute>} />
          <Route path="/my-stakes" element={<PrivateRoute><MyStakes /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/points" element={<PrivateRoute><Points /></PrivateRoute>} />
          <Route path="/vip" element={<PrivateRoute><VIP /></PrivateRoute>} />
          <Route path="/vip/purchase" element={<VIPPurchase />} />
          <Route path="/invite" element={<PrivateRoute><Invite /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
          <Route path="/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
          <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
