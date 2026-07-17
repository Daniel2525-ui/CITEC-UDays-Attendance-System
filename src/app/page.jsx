"use client";
import { Mail, Lock, QrCode, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const features = [
    {
      icon: QrCode,
      text: "Efficient QR check-ins",
    },
    {
      icon: Users,
      text: "Built for Administrators & Officers",
    },
    {
      icon: ShieldCheck,
      text: "Secure, role-based access",
    },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("full_name, role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error(profileError.message);
      return;
    }

    console.log("Authenticated User:", data.user);
    console.log("Profile:", profile);

    if (profile.role === "administrator") {
      router.push("/admin/dashboard");
    } else if (profile.role === "officer") {
      router.push("/officer/scanner");
    }
  };

  return (
    <main className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      <section className="relative flex flex-col justify-center overflow-hidden bg-linear-to-br from-blue-800 via-blue-700 to-blue-600 px-8 py-16 sm:px-12 lg:px-16 lg:py-0">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute top-1/3 -right-10 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute top-10 right-16 h-20 w-20 rotate-12 rounded-2xl border-4 border-yellow-400/20" />
          <div className="absolute bottom-24 right-10 h-14 w-14 rotate-45 rounded-xl border-4 border-white/10" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
            <QrCode className="h-8 w-8 text-yellow-400" strokeWidth={2} />
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            CITEC Attendance Portal
          </h1>
          <p className="mt-3 text-lg font-medium text-yellow-400">
            QR Code-Based Attendance Management System
          </p>

          <p className="mt-6 text-base leading-relaxed text-blue-100">
            Welcome to the official attendance portal for the College of
            Information Technology Education and Computing (CITEC).
            Administrators and Officers can securely access the system to manage
            student attendance during University Days.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                    <Icon className="h-5 w-5 text-yellow-400" />
                  </div>

                  <span className="text-md font-medium text-blue-50">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-gray-50 px-6 py-16 sm:px-10 lg:py-0">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-blue-900/5 ring-1 ring-gray-100 sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-gray-500">Sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@citec.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-base text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-base text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-blue-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-700/25 transition-colors hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600/30"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
              Only authorized Administrators and Officers may access this
              system.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            College of Information Technology Education and Computing
          </p>
        </div>
      </section>
    </main>
  );
}
