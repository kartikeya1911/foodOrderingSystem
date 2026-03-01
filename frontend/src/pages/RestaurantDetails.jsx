import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { restaurantService, orderService } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const [restaurantData, itemsData] = await Promise.all([
        restaurantService.getRestaurantById(id),
        restaurantService.getFoodItems(id),
      ]);
      setRestaurant(restaurantData);
      setFoodItems(itemsData);
    } catch (error) {
      toast.error('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await orderService.addToCart({
        foodItemId: item.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        foodItemName: item.name,
        quantity: 1,
        price: item.price,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>🍽️ {restaurant.cuisine}</span>
            <span>⭐ {restaurant.rating?.toFixed(1) || 'New'}</span>
            <span>📍 {restaurant.address}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {foodItems.length === 0 ? (
          <p className="text-center text-gray-600">No items available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-5xl">🍔</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    {item.isVegetarian && <span className="text-green-600">🌱</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">₹{item.price}</span>
                    {item.isAvailable ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <span className="text-gray-500">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
