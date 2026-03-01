import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await orderService.getCart();
      setCart(data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (foodItemId) => {
    try {
      await orderService.removeFromCart(foodItemId);
      toast.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await orderService.clearCart();
      toast.success('Cart cleared');
      fetchCart();
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-xl">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {!cart || cart.items?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/restaurants')}
              className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded transition"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-xl font-bold mb-4">From: {cart.restaurantName}</h2>
                
                {cart.items.map((item) => (
                  <div key={item.foodItemId} className="flex justify-between items-center border-b py-4">
                    <div className="flex-1">
                      <h3 className="font-bold">{item.foodItemName}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-primary font-bold">₹{item.subtotal}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.foodItemId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={handleClearCart}
                  className="mt-4 text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
