import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Stores from './pages/Stores'
import OpenBoardInvite from './pages/OpenBoardInvite'
import Board from './pages/Board'
import CreateTask from './pages/CreateTask'
import AssignTask from './pages/AssignTask'
import TaskHistory from './pages/TaskHistory'
import Stock from './pages/Stock'
import Staff from './pages/Staff'
import StaffDetail from './pages/StaffDetail'
import Schedule from './pages/Schedule'
import Report from './pages/Report'

export default function App() {
  const location = useLocation()
  return (
    <div className="phone">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/invite" element={<OpenBoardInvite />} />
          <Route path="/board" element={<Board />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/tasks/:id/assign" element={<AssignTask />} />
          <Route path="/tasks/:id/history" element={<TaskHistory />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/:id" element={<StaffDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
