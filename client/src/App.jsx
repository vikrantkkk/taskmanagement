import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import VerifyOtp from "./pages/VerifyOtp";
import TaskList from "./components/TaskList";
import InProgressTaskList from "./pages/InProgressTaskList";
import CompletedTaskList from "./pages/CompletedTaskList";
import Setting from "./pages/Setting";
import "./app.css";
import PendingTask from "./pages/PendingTask";
import MyAccountProfile from "./pages/MyAccountProfile";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";

const App = () => {
  const { user } = useSelector((state) => state?.auth?.user) || "";
  const isVerified = user?.isVerified;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isVerified={isVerified}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="tasks" element={<TaskList />} />
          <Route path="pending-task" element={<PendingTask />} />
          <Route path="inprogress-task" element={<InProgressTaskList />} />
          <Route path="completed-task" element={<CompletedTaskList />} />
          <Route path="setting" element={<Setting />} />
          <Route path="my-account" element={<MyAccountProfile />} />
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
