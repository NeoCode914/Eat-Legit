import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerLoginSchema, type PartnerLoginSchema } from "../schemas/auth";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ChefHat, ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";

export default function PartnerSignin() {
  const { signInPartner } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerLoginSchema>({
    resolver: zodResolver(partnerLoginSchema),
  });

  const onSubmit = useCallback(
    async (values: PartnerLoginSchema) => {
      setServerError("");
      try {
        await signInPartner({ email: values.email, password: values.password });
        navigate("/feed");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setServerError(
            (err.response?.data as { message?: string })?.message ?? "Login failed"
          );
        } else {
          setServerError("An unexpected error occurred");
        }
      }
    },
    [signInPartner, navigate]
  );

  return (
    <div className="min-h-screen flex bg-[#080808]">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600/20 via-teal-600/10 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/40">
            <ChefHat size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Eat<span className="text-emerald-400">Legit</span>
            <span className="text-white/40 text-base font-normal ml-2">for Partners</span>
          </span>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-white leading-tight">
              Partner<br />
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Upload new reels, track engagement, and reach food lovers who matter.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">
              Partner Benefits
            </p>
            {[
              "Upload unlimited food reels",
              "Reach local food enthusiasts",
              "Build your brand presence",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/30 text-sm">
          © 2026 EatLegit. All rights reserved.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <ChefHat size={15} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">EatLegit Partners</span>
            </div>
            <h2 className="text-3xl font-black text-white">Partner sign in</h2>
            <p className="text-white/40 text-sm">
              Access your partner dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Server Error */}
            {serverError && (
              <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="partner-signin-email" className="text-white/70 text-sm font-medium">
                Business Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="partner-signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="contact@restaurant.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-emerald-500/60 focus:bg-white/8 transition-all duration-200"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="partner-signin-password" className="text-white/70 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="partner-signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-emerald-500/60 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="partner-signin-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/25 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="space-y-3 text-center text-sm">
            <p className="text-white/40">
              New partner?{" "}
              <Link to="/partner/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Register your business
              </Link>
            </p>
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/20 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <p className="text-white/40">
              Regular user?{" "}
              <Link to="/signin" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
