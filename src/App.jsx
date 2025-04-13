import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ExerciseProvider } from "@/contexts/exercise-context";
import { SavedExercisesProvider } from "@/contexts/saved-exercises-context";
import { ChatbotProvider } from "@/contexts/chatbot-context";
import { ProtectedRoute } from "@/components/protected-route";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";
import ProfilePage from "@/routes/profile/page";
import SignInPage from "@/routes/auth/signin";
import SignUpPage from "@/routes/auth/signup";

function App() {
    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <ExerciseProvider>
                    <SavedExercisesProvider>
                        <ChatbotProvider>
                            <Router>
                                <Routes>
                                    {/* Public routes */}
                                    <Route path="/signin" element={<SignInPage />} />
                                    <Route path="/signup" element={<SignUpPage />} />
                                    
                                    {/* Publicly accessible routes with unprotected access */}
                                    <Route path="/library" element={<Layout><LibraryPage /></Layout>} />
                                    <Route path="/chatbot" element={<Layout><ChatbotPage /></Layout>} />
                                    <Route path="/repbot" element={<Layout><RepBotPage /></Layout>} />
                                    <Route path="/exercise-tracker" element={<Layout><ExerciseTrackerPage /></Layout>} />
                                    <Route path="/rapidtree" element={<Layout><RapidTreePage /></Layout>} />

                                    {/* Dashboard and Profile routes - Protected with blurred view for non-authenticated users */}
                                    <Route 
                                        path="/" 
                                        element={
                                            <Layout>
                                                <DashboardPage />
                                            </Layout>
                                        } 
                                    />
                                    <Route 
                                        path="/profile" 
                                        element={
                                            <ProtectedRoute>
                                                <Layout>
                                                    <ProfilePage />
                                                </Layout>
                                            </ProtectedRoute>
                                        } 
                                    />

        
                                </Routes>
                            </Router>
                        </ChatbotProvider>
                    </SavedExercisesProvider>
                </ExerciseProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
