import React from 'react'
import 'regenerator-runtime/runtime';
import './App.css'
import LandingPage from './pages/LandingPage.jsx'
import DashBoard from './pages/DashBoard.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import InterviewDetails from './pages/InterviewDetails.jsx'
import ResumeDeails from './pages/ResumeDetails.jsx'
import ResumeResult from './pages/ResumeResult.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './contexts/auth.jsx'
import InterviewRoom from './pages/InterviewRoom.jsx'
import { InterviewDataProvider } from './contexts/interview.jsx';
import { PortraitProvider } from './contexts/portrait.jsx'
import TestSetup from './pages/TestSetup.jsx';
import InterviewResult from './pages/InterviewResult.jsx';
import Profile from './pages/Profile.jsx';
import InterviewHistory from './pages/InterviewHistory.jsx';

function App() {

  return (
    <PortraitProvider>
      <AuthContextProvider>
        <InterviewDataProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/home' element={<DashBoard />} />
              <Route path='/home/resume-ats-score' element={<ResumeDeails />} />
              <Route path='/home/resume-ats-score/analysis-results' element={<ResumeResult />} />
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/home/interview-details' element={<InterviewDetails />} />
              <Route path='/home/interview-room' element={<InterviewRoom />} />
              <Route path='/home/interview-room/test-setup' element={<TestSetup />} />
              <Route path='/home/interview-results' element={<InterviewResult />} />
              <Route path='/home/profile' element={<Profile />} />
              <Route path='/home/profile/past-interview/:id' element={<InterviewHistory />} />
            </Routes>
          </BrowserRouter>
        </InterviewDataProvider>
      </AuthContextProvider>
    </PortraitProvider>
  )
}

export default App
