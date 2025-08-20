import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        
        <Route path='/student' element={<StudentDashboard/>} />
        <Route path='/teacher' element={<TeacherDashboard/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
    </div>
  )
}

export default App
