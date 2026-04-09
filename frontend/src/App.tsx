import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import UserSignup from "./pages/UserSignup";
import UserSignin from "./pages/UserSignin";
import PartnerSignup from "./pages/PartnerSignup";
import PartnerSignin from "./pages/PartnerSignin";
import ReelsFeed from "./pages/ReelsFeed";
import UploadVideo from "./pages/UploadVideo";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/signin" element={<UserSignin />} />
          <Route path="/partner/signup" element={<PartnerSignup />} />
          <Route path="/partner/signin" element={<PartnerSignin />} />

          {/* Protected: any authenticated user can view feed */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <ReelsFeed />
              </ProtectedRoute>
            }
          />

          {/* Protected: only food partners can upload */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute partnerOnly>
                <UploadVideo />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → redirect to feed */}
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
