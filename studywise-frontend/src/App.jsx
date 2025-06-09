import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainPage from './pages/MainPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AllTasksPage from './pages/AllTasksPage';
import StatisticPage from './pages/StatisticPage';
import AchievementPage from './pages/AchievementPage';
import { Toaster } from 'react-hot-toast';
import GoalsPage from './pages/GoalsPage';
import TestPage from './pages/TestPage2';
function App() {
  return (
    <>
      {/* 🔥 Toast bileşeni burada olacak */}
      <Toaster position="top-right" />

      {/* Uygulamanın yönlendirme sistemi */}
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/mainpage" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />

        <Route path="/all-tasks" element={
          <ProtectedRoute>
            <AllTasksPage />
          </ProtectedRoute>
        } />

        <Route path="/stats" element={
          <ProtectedRoute>
            <StatisticPage />
          </ProtectedRoute>
        } />

        <Route path="/achievements" element={
          <ProtectedRoute>
            <AchievementPage />
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        } />
        <Route path="/test" element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;