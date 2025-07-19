import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Profile from "./components/ProfilePage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ItemList from "./components/item/ItemList";
import ItemDetail from "./components/item/ItemDetail";
import BookingDetail from "./components/booking/BookingDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgetPage from "./components/ForgetPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VehicleList from "./components/vehicle/VehicleList";
import VehicleDetail from "./components/vehicle/VehicleDetail";
import VehicleBookings from "./components/vehicle/VehicleBookings";
import MyItemsList from "./pages/MyItemsList";
import ItemsBooking from "./components/item/ItemsBooking";
import Footer from "./components/common/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminForgetPass from "./pages/AdminForgetPass";
import AdminOverview from './pages/AdminOverview';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminBookingRequests from './pages/AdminBookingRequests';
import AdminTransactions from './pages/AdminTransactions';
import AdminAddVehicle from './pages/AdminAddVehicle';
import AdminAddItem from './pages/AdminAddItem';
import AdminManageProducts from './pages/AdminManageProduct';
import Cart from "./pages/Cart";
import ItemCheckoutPage from "./components/item/ItemCheckoutPage";
import VehicleCheckoutPage from "./components/vehicle/VehicleCheckoutPage";
import MyBookings from "./pages/MyBookings";
import LoadingSpinner from "./components/common/LoadingSpinner";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Global admin redirect
  useEffect(() => {
    if (!loading && user && user.role === 'admin' && location.pathname === '/admin') {
      navigate('/admin/overview', { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  // Helper for admin-only routes
  const RequireAdmin = ({ children }) => {
    if (loading) return null;
    if (!user || user.role !== 'admin') return <Navigate to="/admin" />;
    return children;
  };
  // Helper for non-admin-only routes
  const RequireNonAdmin = ({ children }) => {
    if (loading) return null;
    if (user && user.role === 'admin') return <Navigate to="/admin/overview" />;
    return children;
  };
  const hideNavAndFooter = [
    '/admin',
    '/admin-forget-pass',
    '/admin/overview',
    '/admin/add-product',
    '/admin/booking-requests',
    '/admin/transactions',
    '/admin/add-vehicle',
    '/admin/add-item',
    '/admin/manage-product'
  ].includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavAndFooter && <Navbar />}
      <main className="container mx-auto p-4 flex-1">
        <Routes>
          <Route path="/" element={<RequireNonAdmin><Home /></RequireNonAdmin>} />
          <Route path="/login" element={<RequireNonAdmin><LoginForm /></RequireNonAdmin>} />
          <Route path="/register" element={<RequireNonAdmin><RegisterForm /></RequireNonAdmin>} />
          <Route path="/profile" element={<RequireNonAdmin>{user ? <Profile /> : <Navigate to="/login" />}</RequireNonAdmin>} />
          <Route path="/bookings/:id" element={<RequireNonAdmin><BookingDetail /></RequireNonAdmin>} />
          <Route path="/items/:id" element={<RequireNonAdmin><ItemDetail /></RequireNonAdmin>} />
          <Route path="/my-item-bookings" element={<RequireNonAdmin><ItemsBooking /></RequireNonAdmin>} />
          <Route path="/my-vehicle-bookings" element={<RequireNonAdmin><VehicleBookings /></RequireNonAdmin>} />
          <Route path="/my-items" element={<RequireNonAdmin><MyItemsList /></RequireNonAdmin>} />
          <Route path="/my-bookings" element={<RequireNonAdmin><MyBookings /></RequireNonAdmin>} />
          <Route path="/about" element={<RequireNonAdmin><About /></RequireNonAdmin>} />
          <Route path="/contact" element={<RequireNonAdmin><Contact /></RequireNonAdmin>} />
          <Route path="/forgot-password" element={<RequireNonAdmin><ForgetPage /></RequireNonAdmin>} />
          <Route path="/items" element={<RequireNonAdmin><ItemList /></RequireNonAdmin>} />
          <Route path="/vehicles" element={<RequireNonAdmin><VehicleList /></RequireNonAdmin>} />
          <Route path="/vehicles/:id" element={<RequireNonAdmin><VehicleDetail /></RequireNonAdmin>} />
          <Route path="/cart" element={<RequireNonAdmin><Cart /></RequireNonAdmin>} />

          <Route path="/item-checkout/:id" element={<RequireNonAdmin><ItemCheckoutPage /></RequireNonAdmin>} />
          <Route path="/vehicle-checkout/:id" element={<RequireNonAdmin><VehicleCheckoutPage /></RequireNonAdmin>} />
          <Route path="/book/vehicle/:id" element={<RequireNonAdmin>{user ? <VehicleBookings /> : <Navigate to="/login" />}</RequireNonAdmin>} />
          <Route path="/book/item/:id" element={<RequireNonAdmin>{user ? <ItemsBooking /> : <Navigate to="/login" />}</RequireNonAdmin>} />
          <Route path="/admin" element={user && user.role === 'admin' ? <Navigate to="/admin/overview" /> : <AdminLogin />} />
          <Route path="/admin-forget-pass" element={user && user.role === 'admin' ? <Navigate to="/admin/overview" /> : <AdminForgetPass />} />
          <Route path="/admin/overview" element={<RequireAdmin><AdminOverview /></RequireAdmin>} />
          <Route path="/admin/add-product" element={<RequireAdmin><AdminAddProduct /></RequireAdmin>} />
          <Route path="/admin/add-vehicle" element={<RequireAdmin><AdminAddVehicle /></RequireAdmin>} />
          <Route path="/admin/add-item" element={<RequireAdmin><AdminAddItem /></RequireAdmin>} />
          <Route path="/admin/booking-requests" element={<RequireAdmin><AdminBookingRequests /></RequireAdmin>} />
          <Route path="/admin/transactions" element={<RequireAdmin><AdminTransactions /></RequireAdmin>} />
          <Route path="/admin/manage-product" element={<RequireAdmin><AdminManageProducts /></RequireAdmin>} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastContainer 
          position="top-center" 
          autoClose={4000} 
          hideProgressBar={false}
          newestOnTop 
          closeOnClick 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
          toastStyle={{
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
