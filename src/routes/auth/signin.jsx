import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/utils/cn";
import logoLight from "@/assets/main_logo.png";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    // Load saved email from localStorage if Remember Me was checked
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        if (!email || !password) {
            setErrorMessage("Please enter both email and password");
            return;
        }
        
        setIsLoading(true);
        
        // Simulate authentication - in a real app, this would be an API call
        setTimeout(() => {
            try {
                // For demo purposes, accept any valid-looking email and password
                if (email.includes("@") && password.length >= 6) {
                    // Handle Remember Me functionality
                    if (rememberMe) {
                        localStorage.setItem("savedEmail", email);
                    } else {
                        localStorage.removeItem("savedEmail");
                    }
                    
                    // Create user object with necessary information
                    const userData = { 
                        email,
                        name: email.split('@')[0], // Using part of email as name for demo
                        lastLogin: new Date().toISOString()
                    };
                    
                    // Call login function from auth context
                    const success = login(userData);
                    
                    if (success) {
                        console.log("Login successful, redirecting to dashboard");
                        navigate("/");
                    } else {
                        setErrorMessage("Failed to login. Please try again.");
                    }
                } else {
                    setErrorMessage("Invalid credentials. Please try again.");
                }
            } catch (error) {
                console.error("Login error:", error);
                setErrorMessage("An error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        
        if (!resetEmail || !resetEmail.includes('@')) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        
        setIsLoading(true);
        
        // Simulate password reset email - in a real app, this would be an API call
        setTimeout(() => {
            setIsLoading(false);
            setResetSuccess(true);
            setErrorMessage("");
            
            // Auto-close the forgot password form after 3 seconds
            setTimeout(() => {
                setForgotPasswordOpen(false);
                setResetSuccess(false);
                setResetEmail("");
            }, 3000);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <div className="mb-6 flex flex-col items-center">
                    <img src={logoLight} alt="RapidRoutines" className="h-12 mb-4" />
                    {!forgotPasswordOpen ? (
                        <>
                            <h1 className="text-2xl font-bold text-slate-800">Sign in to your account</h1>
                            <p className="mt-2 text-center text-slate-600">
                                Welcome back! Please enter your credentials to access your dashboard.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-slate-800">Reset your password</h1>
                            <p className="mt-2 text-center text-slate-600">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </>
                    )}
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
                        {errorMessage}
                    </div>
                )}

                {resetSuccess && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-500">
                        Password reset link sent to your email!
                    </div>
                )}

                {!forgotPasswordOpen ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#1e628c] focus:ring-[#1e628c]"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                                    Remember me
                                </label>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setForgotPasswordOpen(true);
                                    setResetEmail(email);
                                }}
                                className="text-sm font-medium text-[#1e628c] hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full rounded-md bg-[#1e628c] py-2 text-sm font-medium text-white transition-colors",
                                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#164d6e]"
                            )}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading || resetSuccess}
                                className={cn(
                                    "flex-1 rounded-md bg-[#1e628c] py-2 text-sm font-medium text-white transition-colors",
                                    (isLoading || resetSuccess) ? "opacity-70 cursor-not-allowed" : "hover:bg-[#164d6e]"
                                )}
                            >
                                {isLoading ? "Sending..." : resetSuccess ? "Sent!" : "Reset Password"}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => {
                                    setForgotPasswordOpen(false);
                                    setErrorMessage("");
                                }}
                                className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-medium text-[#1e628c] hover:underline">
                        Sign up now
                    </Link>
                </div>

                <div className="mt-4 text-center text-xs text-slate-500">
                    By continuing, you agree to our{" "}
                    <a 
                        href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.lx86jybafkpq" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#1e628c] hover:underline"
                    >
                        Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a 
                        href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.0" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#1e628c] hover:underline"
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;