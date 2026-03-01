import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect owners and admins to their dashboards
    if (user) {
      if (user.role === 'RESTAURANT_OWNER') {
        navigate('/owner');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      }
      // Customers stay on home page to browse
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-dark mb-4">
            Welcome to <span className="text-primary">SwiftSavor</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Order delicious food from your favorite restaurants
          </p>
          <Link
            to="/restaurants"
            className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block transition"
          >
            Browse Restaurants
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🍔</div>
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Choose from hundreds of restaurants and thousands of dishes
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your food delivered hot and fresh in no time
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2">Easy Payment</h3>
            <p className="text-gray-600">
              Multiple payment options for your convenience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
