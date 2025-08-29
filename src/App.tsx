import { AppProvider } from './state/context';
import { Sidebar, SidebarToggle, ProtectedRoute } from './components';
import { Dashboard, SignIn, Register } from './pages';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './global.css';
import './App.css';
import './responsive.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <div className="app-layout">
                <Sidebar />
                <SidebarToggle />
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </div>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
