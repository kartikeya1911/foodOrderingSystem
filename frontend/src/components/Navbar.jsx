import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            🍕 SwiftSavor
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Public link - visible to everyone */}
            {(!user || user.role === 'CUSTOMER') && (
              <Link to="/restaurants" className="hover:text-primary transition">
                Restaurants
              </Link>
            )}
            
            {user ? (
              <>
                {/* Customer-only links */}
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link to="/cart" className="hover:text-primary transition">
                      🛒 Cart
                    </Link>
                    <Link to="/my-orders" className="hover:text-primary transition">
                      My Orders
                    </Link>
                  </>
                )}

                {/* Role-specific dashboard links */}
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="hover:text-primary transition">
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'RESTAURANT_OWNER' && (
                  <Link to="/owner" className="hover:text-primary transition">
                    Owner Dashboard
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-primary transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
