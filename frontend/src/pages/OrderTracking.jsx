import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = steps.indexOf(order?.status);
    return steps.map((step, index) => ({
      name: step.replace(/_/g, ' '),
      completed: index <= currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-xl">Loading order...</div>
        </div>
      </div>
    );
  }

  const statusSteps = order ? getStatusSteps() : [];

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>
        
        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">Order Status</h2>
                
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`font-semibold ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                          {step.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
                <p className="text-gray-600 mb-2">📍 {order.deliveryAddress}</p>
                <p className="text-gray-600">📞 {order.phone}</p>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <p className="text-sm text-gray-600 mb-4">Order #{order.id.substring(0, 8)}</p>
                
                <div className="mb-4">
                  <p className="font-semibold mb-2">From: {order.restaurantName}</p>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-2 border-b">
                      <span>{item.foodItemName} x {item.quantity}</span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-xl font-bold text-primary flex justify-between">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.paymentId && (
                    <p className="text-sm text-gray-600">
                      Payment ID: {order.paymentId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
