import {
  Navigate,
} from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({
  children,
}: Props) => {
  const isAuthenticated =
    true;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;