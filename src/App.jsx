import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Rugs from "./pages/Rugs";
import Furniture from "./pages/Furniture";
import Office from "./pages/Office";
import ArtificialGrass from "./pages/ArtificialGrass";
import Consulting from "./pages/Consulting";
import AdminLogin from "./pages/AdminLogin";
import Cart from "./pages/Cart";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Customers from "./pages/admin/Customers";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* ── Public routes ───────────────────────────────────── */}
            <Route path="/"                 element={<Home />} />
            <Route path="/about"            element={<About />} />
            <Route path="/contact"          element={<Contact />} />
            <Route path="/shop"             element={<Shop />} />
            <Route path="/rugs"             element={<Rugs />} />
            <Route path="/furniture"        element={<Furniture />} />
            <Route path="/office"           element={<Office />} />
            <Route path="/artificial-grass" element={<ArtificialGrass />} />
            <Route path="/consulting"       element={<Consulting />} />
            <Route path="/cart"             element={<Cart />} />

            {/* ── Admin login (public) ─────────────────────────────── */}
            <Route path="/adminlogin/login" element={<AdminLogin />} />

            {/* ── Protected admin routes ───────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index         element={<Dashboard />} />
              <Route path="orders"    element={<Orders />} />
              <Route path="products"  element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings"  element={<Settings />} />
            </Route>

            {/* ── 404 ──────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AdminAuthProvider>
  );
}

export default App;
