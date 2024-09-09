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
import { useEffect, useMemo } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const App = () => {
  useEffect(() => {
    // Listen for new task creation events
    socket.on("newTaskCreated", (task) => {
      console.log("New task created:", task);
      // Optionally update your task list here
    });

    // Cleanup the listener when the component unmounts
    return () => {
      socket.off("newTaskCreated");
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<AppLayout />}>
          <Route path="tasks" element={<TaskList />} />
          <Route path="inprogress-task" element={<InProgressTaskList />} />
          <Route path="completed-task" element={<CompletedTaskList />} />
          <Route path="setting" element={<Setting />} />
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
