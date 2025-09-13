// Dashboard Page Component
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to TrackSpring, {user?.username}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h2>Your Expense Dashboard</h2>
          <p>This is where your expense tracking features will go!</p>
          
          <div className="feature-cards">
            <Link to="/transactions" className="feature-card-link">
              <div className="feature-card">
                <h3>📊 Manage Transactions</h3>
                <p>Add, edit, and view your income and expenses</p>
              </div>
            </Link>
            
            <div className="feature-card">
              <h3>📈 View Reports</h3>
              <p>See your spending patterns (Coming Soon)</p>
            </div>
            
            <div className="feature-card">
              <h3>🏷️ Manage Categories</h3>
              <p>Organize your transactions (Coming Soon)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
