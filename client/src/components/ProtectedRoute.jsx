import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isVerified, children }) => {
  if (!isVerified) {
    return <Navigate to="/" replace />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
