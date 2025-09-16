import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './components/EnhancedComponents.css';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CurrencyConverterPage from './pages/CurrencyConverterPage';
import CalculatorPage from './pages/CalculatorPage';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="App">
            <Sidebar />
            <div className="main-content">
              <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <TransactionsPage />
                  </ProtectedRoute>
                } 
              />
              
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  } 
                />
                
                
                <Route
                  path="/currency"
                  element={
                    <ProtectedRoute>
                      <CurrencyConverterPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route
                  path="/calculator"
                  element={
                    <ProtectedRoute>
                      <CalculatorPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
