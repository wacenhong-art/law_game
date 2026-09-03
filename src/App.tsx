import type { ReactNode } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import Court from "@/pages/Court";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Scripts from "@/pages/Scripts";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const account = useAppStore((state) => state.session.account);
  return account ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const account = useAppStore((state) => state.session.account);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={account ? "/home" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/court"
          element={
            <ProtectedRoute>
              <Court />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scripts"
          element={
            <ProtectedRoute>
              <Scripts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={account ? "/home" : "/login"} replace />} />
      </Routes>
    </HashRouter>
  );
}
