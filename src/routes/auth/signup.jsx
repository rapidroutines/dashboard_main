import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/utils/cn";
import logoLight from "@/assets/main_logo.png";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            setErrorMessage("Please fill in all fields");
            return;
        }
        
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }
        
        if (!email.includes('@')) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        
        setIsLoading(true);
        
        // Simulate registration - in a real app, this would be an API call
        setTimeout(() => {
            try {
                // Create user object with form data
                const userData = {
                    name,
                    email,
                    joined: new Date().toISOString()
                };
                
                // Store user data and log them in
                const success = login(userData);
                
                if (success) {
                    console.log("Signup successful, redirecting to dashboard");
                    navigate("/");
                } else {
                    setErrorMessage("Failed to create account. Please try again.");
                }
            } catch (error) {
                console.error("Signup error:", error);
                setErrorMessage("An error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <div className="mb-6 flex flex-col items-center">
                    <img src={logoLight} alt="RapidRoutines" className="h-12 mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
                    <p className="mt-2 text-center text-slate-600">
                        Sign up to access all RapidRoutines features
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 rounded border-slate-300 text-[#1e628c] focus:ring-[#1e628c]"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                            I agree to the <a href="#" className="text-[#1e628c] hover:underline">Terms of Service</a> and <a href="#" className="text-[#1e628c] hover:underline">Privacy Policy</a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full rounded-md bg-[#1e628c] py-2 text-sm font-medium text-white transition-colors",
                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#164d6e]"
                        )}
                    >
                        {isLoading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/signin" className="font-medium text-[#1e628c] hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;