import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminBookings from './pages/Bookings';
import AdminTables from './pages/Tables';
import AdminMenu from './pages/Menu';
import AdminExperiences from './pages/Experiences';
import AdminSettings from './pages/Settings';
import AdminPriceMenu from './pages/PriceMenu';
import 'react-toastify/dist/ReactToastify.css';
import './styles/admin-auth.css';
import './styles/admin-layout.css';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                   <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings" element={<AdminBookings />} />
                  <Route path="/tables" element={<AdminTables />} />
                  <Route path="/menu" element={<AdminMenu />} />
                  <Route path="/price-menu" element={<AdminPriceMenu />} />
                  <Route path="/experiences" element={<AdminExperiences />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            }
          />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AdminAuthProvider>
  );
}

export default App;
