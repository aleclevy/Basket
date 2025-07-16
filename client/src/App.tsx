import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthCallback } from './components/AuthCallback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='app'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Navigate to='/login' />} />
            <Route path='/auth/callback' element={<AuthCallback />} />
            <Route
              path='/dashboard'
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path='/' element={<Navigate to='/dashboard' />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
