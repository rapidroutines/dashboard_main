import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/utils/cn";
import logoLight from "@/assets/main_logo.png";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetStage, setResetStage] = useState("email"); // email, verify, reset
    const [userFound, setUserFound] = useState(false);
    
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
                // Check stored users from localStorage
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const user = registeredUsers.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Handle Remember Me functionality
                    if (rememberMe) {
                        localStorage.setItem("savedEmail", email);
                    } else {
                        localStorage.removeItem("savedEmail");
                    }
                    
                    // Create user object with necessary information
                    const userData = { 
                        email: user.email,
                        name: user.name || email.split('@')[0],
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
        setErrorMessage("");
        
        if (!email || !email.includes('@')) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        
        setIsLoading(true);
        
        // Check if user exists in registeredUsers
        setTimeout(() => {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = registeredUsers.find(u => u.email === email);
            
            if (user) {
                setUserFound(true);
                setResetStage("verify");
            } else {
                setErrorMessage("No account found with this email address.");
            }
            
            setIsLoading(false);
        }, 1000);
    };
    
    const handlePasswordReset = (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        if (!newPassword || newPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters long");
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        
        setIsLoading(true);
        
        // Update the user's password in registeredUsers
        setTimeout(() => {
            try {
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userIndex = registeredUsers.findIndex(u => u.email === email);
                
                if (userIndex !== -1) {
                    // Update the user's password
                    registeredUsers[userIndex].password = newPassword;
                    
                    // Save updated users back to localStorage
                    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                    
                    setResetSuccess(true);
                    setResetStage("success");
                    
                    // Auto-close after successful reset and return to login
                    setTimeout(() => {
                        setForgotPasswordOpen(false);
                        setResetStage("email");
                        setResetSuccess(false);
                        setNewPassword("");
                        setConfirmNewPassword("");
                    }, 3000);
                } else {
                    setErrorMessage("User not found. Please try again.");
                }
            } catch (error) {
                console.error("Error updating password:", error);
                setErrorMessage("An error occurred while resetting your password.");
            } finally {
                setIsLoading(false);
            }
        }, 1500);
    };

    // Return to the email input stage
    const handleBackToEmail = () => {
        setResetStage("email");
        setUserFound(false);
        setErrorMessage("");
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
                                {resetStage === "email" && "Enter your email address to reset your password."}
                                {resetStage === "verify" && "Verify your account to continue."}
                                {resetStage === "reset" && "Create a new password for your account."}
                                {resetStage === "success" && "Your password has been reset successfully!"}
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
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-500 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Password reset successfully! You can now log in with your new password.
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
                    <div className="space-y-4">
                        {resetStage === "email" && (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
                                        Email
                                    </label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={cn(
                                            "flex-1 rounded-md bg-[#1e628c] py-2 text-sm font-medium text-white transition-colors",
                                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#164d6e]"
                                        )}
                                    >
                                        {isLoading ? "Checking..." : "Continue"}
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

                        {resetStage === "verify" && (
                            <div className="space-y-4">
                                <div className="rounded-md bg-blue-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-blue-700">
                                                Account found. You can now reset your password.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-sm text-slate-600">
                                    <p>Email: <span className="font-medium">{email}</span></p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setResetStage("reset")}
                                        className="flex-1 rounded-md bg-[#1e628c] py-2 text-sm font-medium text-white transition-colors hover:bg-[#164d6e]"
                                    >
                                        Reset Password
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleBackToEmail}
                                        className="flex items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}

                        {resetStage === "reset" && (
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
                                        New Password
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            id="new-password"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Password must be at least 6 characters long
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
                                        Confirm New Password
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            id="confirm-password"
                                            type={showNewPassword ? "text" : "password"}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={cn(
                                            "flex-1 rounded-md bg-[#1e628c] py-2 text-sm font-medium text-white transition-colors",
                                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#164d6e]"
                                        )}
                                    >
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setResetStage("verify")}
                                        className="flex items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </button>
                                </div>
                            </form>
                        )}

                        {resetStage === "success" && (
                            <div className="space-y-4">
                                <div className="rounded-md bg-green-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                Your password has been reset successfully!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center text-sm text-slate-600">
                                    <p>You will be redirected to the login page shortly...</p>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotPasswordOpen(false);
                                        setResetStage("email");
                                        setResetSuccess(false);
                                    }}
                                    className="w-full rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Return to Login
                                </button>
                            </div>
                        )}
                    </div>
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

export default SignInPage