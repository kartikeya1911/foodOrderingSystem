import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await orderService.getCart();
      if (!data || data.items?.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      setCart(data);
    } catch (error) {
      toast.error('Failed to load cart');
      navigate('/cart');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const order = await orderService.placeOrder(orderData);
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
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
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
              
              <form onSubmit={handlePlaceOrder}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Delivery Address *</label>
                  <textarea
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    rows="3"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="mb-4">
                <p className="font-semibold mb-2">From: {cart.restaurantName}</p>
                {cart.items.map((item) => (
                  <div key={item.foodItemId} className="flex justify-between text-sm py-2 border-b">
                    <span>{item.foodItemName} x {item.quantity}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="text-xl font-bold text-primary flex justify-between">
                <span>Total</span>
                <span>₹{cart.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
