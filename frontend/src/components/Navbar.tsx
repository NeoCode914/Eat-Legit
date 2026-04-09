import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UtensilsCrossed, Tv2, Upload, LogOut, LogIn, ChefHat } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/signin");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      {/* Logo */}
      <Link to="/feed" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-200">
          <UtensilsCrossed size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          Eat<span className="text-orange-400">Legit</span>
        </span>
      </Link>

      {/* Center Nav */}
      {auth && (
        <div className="flex items-center gap-1">
          <Link
            to="/feed"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive("/feed")
                ? "bg-orange-500/20 text-orange-400 shadow-inner"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Tv2 size={15} />
            <span>Feed</span>
          </Link>
          {auth.type === "partner" && (
            <Link
              to="/upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive("/upload")
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Upload size={15} />
              <span>Upload</span>
            </Link>
          )}
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {auth ? (
          <div className="flex items-center gap-3">
            {/* Avatar / Name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {auth.type === "user"
                  ? auth.data.username.charAt(0).toUpperCase()
                  : auth.data.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-white text-xs font-medium leading-none">
                  {auth.type === "user" ? auth.data.username : auth.data.name}
                </span>
                <span className="text-white/40 text-[10px] leading-none mt-0.5">
                  {auth.type === "partner" ? "Food Partner" : "Member"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 disabled:opacity-50 cursor-pointer border border-transparent hover:border-red-400/20"
            >
              <LogOut size={13} />
              <span>{loggingOut ? "..." : "Logout"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/signin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <LogIn size={14} />
              Sign In
            </Link>
            <Link
              to="/partner/signin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-linear-to-r from-orange-500 to-rose-500 text-white hover:opacity-90 transition-all duration-200 shadow-lg shadow-orange-500/25"
            >
              <ChefHat size={14} />
              Partner
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
