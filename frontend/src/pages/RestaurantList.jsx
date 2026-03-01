import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { restaurantService } from '../services/api';
import { toast } from 'react-toastify';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-xl">Loading restaurants...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-dark">All Restaurants</h1>
        
        {restaurants.length === 0 ? (
          <p className="text-center text-gray-600">No restaurants available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {restaurant.imageUrl ? (
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl">🍽️</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{restaurant.cuisine}</span>
                    <span className="text-yellow-500">⭐ {restaurant.rating?.toFixed(1) || 'New'}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">📍 {restaurant.address}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
