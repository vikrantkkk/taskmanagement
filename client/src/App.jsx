import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage"; // Import AuthPage
import NotFoundPage from "./pages/NotFoundPage";
import VerifyOtp from "./pages/VerifyOtp";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
