import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import PublicEstimatorPage from "./pages/PublicEstimatorPage";

function RequireAuth({ children }) {
  const token = localStorage.getItem("owner_token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function RedirectIfAuthenticated({ children }) {
  const token = localStorage.getItem("owner_token");
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <PublicEstimatorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/login"
          element={
            <RedirectIfAuthenticated>
              <AdminLoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
