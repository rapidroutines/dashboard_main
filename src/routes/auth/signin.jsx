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
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [resetToken, setResetToken] = useState("");
    
    const navigate = useNavigate();
    const { login } = useAuth();

    // Load saved email from localStorage if Remember Me was checked
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        
        // Check for reset token in URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const tokenEmail = params.get('email');
        
        if (token && tokenEmail) {
            // Auto-open password reset form with token
            setResetToken(token);
            setResetEmail(decodeURIComponent(tokenEmail));
            setForgotPasswordOpen(true);
            setShowPasswordReset(true);
            
            // Remove token from URL to prevent reuse
            window.history.replaceState({}, document.title, window.location.pathname);
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
        
        try {
            // First, check if user exists in localStorage
            let userFound = false;
            let storedUser = null;
            let allUsers = [];
            
            try {
                // Get all users from storage
                const usersStr = localStorage.getItem("users");
                if (usersStr) {
                    allUsers = JSON.parse(usersStr);
                    // Find user with matching email (case insensitive)
                    storedUser = allUsers.find(user => 
                        user.email.toLowerCase() === email.toLowerCase()
                    );
                    
                    if (storedUser) {
                        userFound = true;
                    }
                }
            } catch (error) {
                console.error("Error loading users:", error);
            }
            
            // If user found, check password
            if (userFound && storedUser.password === password) {
                // Handle Remember Me functionality
                if (rememberMe) {
                    localStorage.setItem("savedEmail", email);
                } else {
                    localStorage.removeItem("savedEmail");
                }
                
                // Update last login time
                const updatedUsers = allUsers.map(user => {
                    if (user.email.toLowerCase() === email.toLowerCase()) {
                        return {
                            ...user,
                            lastLogin: new Date().toISOString()
                        };
                    }
                    return user;
                });
                
                localStorage.setItem("users", JSON.stringify(updatedUsers));
                
                // Call login function from auth context
                const success = login(storedUser);
                
                if (success) {
                    console.log("Login successful, redirecting to dashboard");
                    navigate("/");
                    return;
                }
            }
            
            // If we get here, either user not found or password incorrect
            // For demo purposes, create new user if not found and credentials look valid
            if (!userFound && email.includes("@") && password.length >= 6) {
                // Handle Remember Me functionality
                if (rememberMe) {
                    localStorage.setItem("savedEmail", email);
                } else {
                    localStorage.removeItem("savedEmail");
                }
                
                // Create new user object with necessary information
                const newUserData = { 
                    id: Date.now().toString(),
                    email: email,
                    name: email.split('@')[0], // Using part of email as name for demo
                    password: password,
                    created: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                };
                
                // Add to users array
                allUsers.push(newUserData);
                localStorage.setItem("users", JSON.stringify(allUsers));
                
                // Also store separately for backward compatibility
                localStorage.setItem("user", JSON.stringify(newUserData));
                
                // Call login function from auth context
                const success = login(newUserData);
                
                if (success) {
                    console.log("New user created and logged in, redirecting to dashboard");
                    navigate("/");
                    return;
                }
            }
            
            // If we reach here, something went wrong
            setErrorMessage("Invalid email or password. Please try again.");
            
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        if (!resetEmail || !resetEmail.includes('@')) {
            setErrorMessage("Please enter a valid email address");
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Get all users
            let allUsers = [];
            let userFound = false;
            
            try {
                const usersStr = localStorage.getItem("users");
                if (usersStr) {
                    allUsers = JSON.parse(usersStr);
                    // Find user with matching email (case insensitive)
                    userFound = allUsers.some(user => 
                        user.email.toLowerCase() === resetEmail.toLowerCase()
                    );
                }
                
                // Also check legacy storage format
                if (!userFound) {
                    const storedUserStr = localStorage.getItem("user");
                    if (storedUserStr) {
                        const storedUser = JSON.parse(storedUserStr);
                        if (storedUser && storedUser.email.toLowerCase() === resetEmail.toLowerCase()) {
                            userFound = true;
                            
                            // Migrate to new format
                            if (!allUsers.some(u => u.email.toLowerCase() === storedUser.email.toLowerCase())) {
                                allUsers.push({
                                    ...storedUser,
                                    id: storedUser.id || Date.now().toString()
                                });
                                localStorage.setItem("users", JSON.stringify(allUsers));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking users:", error);
            }
            
            if (!userFound) {
                setErrorMessage("No account found with this email address");
                setIsLoading(false);
                return;
            }
            
            // Generate reset token and store it
            const token = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
            
            const resetRequests = JSON.parse(localStorage.getItem("passwordResetRequests") || "[]");
            
            // Add new request, remove any old ones for this email
            const newRequests = resetRequests.filter(req => 
                req.email.toLowerCase() !== resetEmail.toLowerCase()
            );
            
            newRequests.push({
                email: resetEmail,
                token: token,
                expires: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
            });
            
            localStorage.setItem("passwordResetRequests", JSON.stringify(newRequests));
            
            // In a real app, we would send an email with the reset link
            // For this demo, we'll just show the form directly
            setResetToken(token);
            setShowPasswordReset(true);
            setErrorMessage("");
            
            // Show a success message
            setResetSuccess(true);
            setTimeout(() => setResetSuccess(false), 5000);
            
        } catch (error) {
            console.error("Error generating reset token:", error);
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResetPassword = (e) => {
        e.preventDefault();
        setErrorMessage("");
        
        if (!newPassword || newPassword.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Verify the reset token
            const resetRequests = JSON.parse(localStorage.getItem("passwordResetRequests") || "[]");
            const validRequest = resetRequests.find(req => 
                req.email.toLowerCase() === resetEmail.toLowerCase() && 
                req.token === resetToken &&
                new Date(req.expires) > new Date()
            );
            
            if (!validRequest) {
                setErrorMessage("Password reset link expired or invalid. Please try again.");
                setIsLoading(false);
                return;
            }
            
            // Find and update the user's password
            let userUpdated = false;
            
            // First, try the new format
            try {
                const usersStr = localStorage.getItem("users");
                if (usersStr) {
                    let allUsers = JSON.parse(usersStr);
                    
                    allUsers = allUsers.map(user => {
                        if (user.email.toLowerCase() === resetEmail.toLowerCase()) {
                            userUpdated = true;
                            return {
                                ...user,
                                password: newPassword,
                                passwordUpdated: new Date().toISOString()
                            };
                        }
                        return user;
                    });
                    
                    localStorage.setItem("users", JSON.stringify(allUsers));
                }
            } catch (error) {
                console.error("Error updating user in new format:", error);
            }
            
            // Then also try the legacy format for backward compatibility
            try {
                const storedUserStr = localStorage.getItem("user");
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser && storedUser.email.toLowerCase() === resetEmail.toLowerCase()) {
                        const updatedUser = {
                            ...storedUser,
                            password: newPassword,
                            passwordUpdated: new Date().toISOString()
                        };
                        
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                        userUpdated = true;
                    }
                }
            } catch (error) {
                console.error("Error updating user in legacy format:", error);
            }
            
            if (!userUpdated) {
                setErrorMessage("Could not update password. User not found.");
                setIsLoading(false);
                return;
            }
            
            // Remove the used reset token
            const newRequests = resetRequests.filter(req => 
                !(req.email.toLowerCase() === resetEmail.toLowerCase() && req.token === resetToken)
            );
            localStorage.setItem("passwordResetRequests", JSON.stringify(newRequests));
            
            // Show success message
            setResetSuccess(true);
            
            // Auto-close the forgot password form after 3 seconds
            setTimeout(() => {
                setForgotPasswordOpen(false);
                setResetSuccess(false);
                setResetEmail("");
                setNewPassword("");
                setConfirmNewPassword("");
                setShowPasswordReset(false);
                setResetToken("");
                
                // Pre-fill the email field for login
                setEmail(resetEmail);
            }, 3000);
            
        } catch (error) {
            console.error("Error updating password:", error);
            setErrorMessage("An error occurred while updating password");
        } finally {
            setIsLoading(false);
        }
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
                                {!showPasswordReset 
                                    ? "Enter your email address to reset your password." 
                                    : "Create a new password for your account."}
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
                        {showPasswordReset 
                            ? "Password reset successful! You can now log in with your new password." 
                            : "Reset link generated! Please proceed with creating a new password."}
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
                                    setErrorMessage("");
                                    setShowPasswordReset(false);
                                    setResetToken("");
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
                    <>
                        {!showPasswordReset ? (
                            // Email verification form
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
                                        Enter your email address
                                    </label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        placeholder="you@example.com"
                                    />
                                    <p className="mt-1 text-xs text-slate-500">
                                        We'll check if your account exists on this device.
                                    </p>
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
                                        {isLoading ? "Verifying..." : "Verify Email"}
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
                        ) : (
                            // New password form
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {resetToken && (
                                    <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                                        Reset token is active. Please create a new password.
                                    </div>
                                )}
                                
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
                                </div>

                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        placeholder="••••••••"
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
                                        {isLoading ? "Updating..." : resetSuccess ? "Updated!" : "Update Password"}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!resetToken) {
                                                setShowPasswordReset(false);
                                            } else {
                                                setForgotPasswordOpen(false);
                                                setShowPasswordReset(false);
                                                setResetToken("");
                                            }
                                            setErrorMessage("");
                                        }}
                                        className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Back
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
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