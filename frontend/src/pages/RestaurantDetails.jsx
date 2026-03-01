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
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

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

  const isRestaurantOpen = () => {
    if (!restaurant?.openingTime || !restaurant?.closingTime) {
      return true; // If times not set, assume open
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMin] = restaurant.openingTime.split(':').map(Number);
    const [closeHour, closeMin] = restaurant.closingTime.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    if (closeTime < openTime) {
      // Handles overnight cases like 22:00 to 02:00
      return currentTime >= openTime || currentTime < closeTime;
    }
    
    return currentTime >= openTime && currentTime < closeTime;
  };

  const handleAddToCartClick = (item) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!item.isAvailable) {
      toast.error('This item is currently unavailable');
      return;
    }

    if (!isRestaurantOpen()) {
      toast.error('Restaurant is currently closed');
      return;
    }

    setSelectedItem(item);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const handleAddToCart = async () => {
    try {
      await orderService.addToCart({
        foodItemId: selectedItem.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        foodItemName: selectedItem.name,
        quantity: quantity,
        price: selectedItem.price,
      });
      toast.success(`Added ${quantity} x ${selectedItem.name} to cart!`);
      setShowQuantityModal(false);
      setSelectedItem(null);
      setQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const handleRateRestaurant = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await restaurantService.rateRestaurant(restaurant.id, rating);
      toast.success('Thank you for your rating!');
      setShowRatingModal(false);
      setRating(0);
      fetchRestaurantDetails(); // Reload to show updated rating
    } catch (error) {
      toast.error('Failed to submit rating');
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

  const restaurantOpen = isRestaurantOpen();

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {restaurant.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden h-64">
              <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
            </div>
            {user && user.role === 'CUSTOMER' && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded ml-4"
              >
                ⭐ Rate Us
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="text-gray-700">{restaurant.cuisine}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-gray-700">
                {restaurant.rating?.toFixed(1) || 'New'} 
                {restaurant.ratingCount > 0 && ` (${restaurant.ratingCount} reviews)`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕐</span>
              <div>
                {restaurant.openingTime && restaurant.closingTime ? (
                  <>
                    <div className="text-gray-700">{restaurant.openingTime} - {restaurant.closingTime}</div>
                    <span className={`text-xs px-2 py-1 rounded ${restaurantOpen ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {restaurantOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-700">{restaurant.openingHours || 'Hours not set'}</span>
                )}
              </div>
            </div>
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
                    {item.isAvailable && restaurantOpen ? (
                      <button
                        onClick={() => handleAddToCartClick(item)}
                        className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {!item.isAvailable ? 'Unavailable' : 'Restaurant Closed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quantity Selection Modal */}
      {showQuantityModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Add to Cart</h3>
            <div className="mb-4">
              <h4 className="font-bold text-lg">{selectedItem.name}</h4>
              <p className="text-gray-600 text-sm">{selectedItem.description}</p>
              <p className="text-primary font-bold mt-2">₹{selectedItem.price} each</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center border p-2 rounded"
                />
                <button
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Total: ₹{(selectedItem.price * quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded flex-1"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  setShowQuantityModal(false);
                  setSelectedItem(null);
                  setQuantity(1);
                }}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">Rate {restaurant.name}</h3>
            <p className="text-gray-600 mb-6">How would you rate your experience?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRateRestaurant}
                className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded flex-1"
              >
                Submit Rating
              </button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setHoveredRating(0);
                }}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
