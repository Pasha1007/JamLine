import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import RecordPage from "../pages/RecordPage";
import AuthPage from "../pages/AuthPage";
import RecordsList from "../pages/RecordsList";
import StoragePage from "../pages/StoragePage";
import Header from "../components/partials/Header";
import { ToastContainer } from "react-toastify";
import SeparatePage from "../pages/SeparatePage";

const RouterContent = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("accessToken");

  const hideHeader = location.pathname === "/auth";

  if (isAuthenticated && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && location.pathname !== "/auth") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/" element={<RecordsList />} />
        <Route path="/:id" element={<RecordPage />} />
        <Route path="/storage" element={<StoragePage />} />
        <Route path="/separate" element={<SeparatePage />} />
      </Routes>
    </>
  );
};

const AppRouter = () => (
  <Router>
    <ToastContainer />
    <RouterContent />
  </Router>
);

export default AppRouter;
