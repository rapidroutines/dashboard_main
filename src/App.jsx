import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";
import SignInPage from "@/routes/auth/signin";
import SignUpPage from "@/routes/auth/signup";

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />

                        {/* Protected routes */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Layout>
                                    <DashboardPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute>
                                <Layout>
                                    <h1 className="title">Analytics Page</h1>
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <Layout>
                                    <h1 className="title">Reports Page</h1>
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/library" element={
                            <ProtectedRoute>
                                <Layout>
                                    <LibraryPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/exercise-tracker" element={
                            <ProtectedRoute>
                                <Layout>
                                    <ExerciseTrackerPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/rapidtree" element={
                            <ProtectedRoute>
                                <Layout>
                                    <RapidTreePage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/chatbot" element={
                            <ProtectedRoute>
                                <Layout>
                                    <ChatbotPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/repbot" element={
                            <ProtectedRoute>
                                <Layout>
                                    <RepBotPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={
                            <ProtectedRoute>
                                <Layout>
                                    <DashboardPage />
                                </Layout>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;