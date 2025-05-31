"use client";
import { Heart, Mail,Lock,EyeOff,Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        setError("");
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }
    
        const data = await response.json();
        // Handle successful login (e.g., redirect or show success message)
        console.log("Login successful:", data);
        console.log("Patient Data:", data.patient);
        const id = data.patient.patient_id;
        localStorage.setItem("patientId", id);
        console.log("Patient ID stored in localStorage:", id);
        
        router.push(`/dashboard?patientId=${data.patient.patient_id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sarathi.AI</h1>
          <p className="text-gray-600">Rural Health Assistant</p>
          <p className="text-sm text-gray-500 mt-2">
            Your AI-powered health companion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* <div className="mt-6 text-center text-sm text-gray-500">
          Demo: patient@test.com / password
        </div> */}
      </div>
    </div>
  );
};
