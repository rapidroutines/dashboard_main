import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ChatbotPage from "@/routes/chatbot/page";
import RepBotPage from "@/routes/repbot/page";
import ExerciseTrackerPage from "@/routes/exercise-tracker/page";
import LibraryPage from "@/routes/library/page";
import RapidTreePage from "@/routes/rapidtree/page";
import ProfilePage from "@/routes/profile/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><DashboardPage /></Layout>} />
                <Route path="/library" element={<Layout><LibraryPage /></Layout>} />
                <Route path="/chatbot" element={<Layout><ChatbotPage /></Layout>} />
                <Route path="/repbot" element={<Layout><RepBotPage /></Layout>} />
                <Route path="/exercise-tracker" element={<Layout><ExerciseTrackerPage /></Layout>} />
                <Route path="/rapidtree" element={<Layout><RapidTreePage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
