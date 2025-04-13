import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { ExerciseProvider } from '@/contexts/exercise-context'
import { ChatbotProvider } from '@/contexts/chatbot-context'
import { SavedExercisesProvider } from '@/contexts/saved-exercises-context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ExerciseProvider>
        <ChatbotProvider>
          <SavedExercisesProvider>
            <App />
          </SavedExercisesProvider>
        </ChatbotProvider>
      </ExerciseProvider>
    </ThemeProvider>
  </StrictMode>
)
