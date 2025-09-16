// Dashboard Page Component
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to TrackSpring, {user?.username}!</h1>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h2>Your Expense Dashboard</h2>
          <p>This is where your expense tracking features will go!</p>
          
          <div className="feature-cards">
            <Link to="/transactions" className="feature-card-link">
              <div className="feature-card">
                <h3>📊 Manage Transactions</h3>
                <p>Add, edit, and view your income and expenses with enhanced features</p>
              </div>
            </Link>
            
            <Link to="/analytics" className="feature-card-link">
              <div className="feature-card">
                <h3>📈 Analytics Dashboard</h3>
                <p>View detailed analytics, charts, and spending insights</p>
              </div>
            </Link>
            
             
             <Link to="/currency" className="feature-card-link">
               <div className="feature-card">
                 <h3>💱 Currency Conversion</h3>
                 <p>Convert transactions between multiple currencies</p>
               </div>
             </Link>
             
             <Link to="/calculator" className="feature-card-link">
               <div className="feature-card">
                 <h3>🧮 Calculator</h3>
                 <p>Quick calculations with Apple-style interface</p>
               </div>
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
