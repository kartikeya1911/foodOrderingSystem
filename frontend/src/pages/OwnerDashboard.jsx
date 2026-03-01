import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { restaurantService, orderService } from '../services/api';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showFoodItemForm, setShowFoodItemForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingFoodItem, setEditingFoodItem] = useState(null);

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisine: '',
    openingHours: '',
    openingTime: '',
    closingTime: '',
    imageUrl: '',
  });

  const [foodItemForm, setFoodItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVegetarian: false,
    isAvailable: true,
    imageUrl: '',
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      loadFoodItems(selectedRestaurant.id);
      loadOrders(selectedRestaurant.id);
    }
  }, [selectedRestaurant]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getMyRestaurants();
      setRestaurants(data);
      if (data.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load restaurants');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFoodItems = async (restaurantId) => {
    try {
      const items = await restaurantService.getFoodItems(restaurantId);
      setFoodItems(items);
    } catch (error) {
      toast.error('Failed to load menu items');
    }
  };

  const loadOrders = async (restaurantId) => {
    try {
      const data = await orderService.getRestaurantOrders(restaurantId);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await restaurantService.updateRestaurant(editingRestaurant.id, restaurantForm);
        toast.success('Restaurant updated successfully');
      } else {
        await restaurantService.createRestaurant(restaurantForm);
        toast.success('Restaurant created successfully');
      }
      setShowRestaurantForm(false);
      setEditingRestaurant(null);
      setRestaurantForm({
        name: '',
        description: '',
        address: '',
        phone: '',
        cuisine: '',
        openingHours: '',
        openingTime: '',
        closingTime: '',
        imageUrl: '',
      });
      loadRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save restaurant');
    }
  };

  const handleFoodItemSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFoodItem) {
        await restaurantService.updateFoodItem(editingFoodItem.id, foodItemForm);
        toast.success('Menu item updated successfully');
      } else {
        await restaurantService.addFoodItem(selectedRestaurant.id, foodItemForm);
        toast.success('Menu item added successfully');
      }
      setShowFoodItemForm(false);
      setEditingFoodItem(null);
      setFoodItemForm({
        name: '',
        description: '',
        price: '',
        category: '',
        isVegetarian: false,
        isAvailable: true,
        imageUrl: '',
      });
      loadFoodItems(selectedRestaurant.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadOrders(selectedRestaurant.id);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleDeleteFoodItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await restaurantService.deleteFoodItem(itemId);
        toast.success('Menu item deleted');
        loadFoodItems(selectedRestaurant.id);
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const editRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({
      name: restaurant.name,
      description: restaurant.description || '',
      address: restaurant.address,
      phone: restaurant.phone || '',
      cuisine: restaurant.cuisine,
      openingHours: restaurant.openingHours || '',
      openingTime: restaurant.openingTime || '',
      closingTime: restaurant.closingTime || '',
      imageUrl: restaurant.imageUrl || '',
    });
    setShowRestaurantForm(true);
  };

  const editFoodItem = (item) => {
    setEditingFoodItem(item);
    setFoodItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      isVegetarian: item.isVegetarian,
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl || '',
    });
    setShowFoodItemForm(true);
  };

  const getOrderStats = () => {
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const confirmed = orders.filter(o => o.status === 'CONFIRMED').length;
    const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    return { pending, confirmed, total, totalOrders: orders.length };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome, Restaurant Owner!</h2>
            <p className="mb-6 text-gray-600">You haven't created any restaurants yet.</p>
            <button
              onClick={() => setShowRestaurantForm(true)}
              className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Create Your First Restaurant
            </button>
          </div>
        </div>
        
        {showRestaurantForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Create Restaurant</h3>
              <form onSubmit={handleRestaurantSubmit}>
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.name}
                  onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Description"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.description}
                  onChange={(e) => setRestaurantForm({...restaurantForm, description: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.address}
                  onChange={(e) => setRestaurantForm({...restaurantForm, address: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.phone}
                  onChange={(e) => setRestaurantForm({...restaurantForm, phone: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Cuisine (e.g., Italian, Chinese)"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.cuisine}
                  onChange={(e) => setRestaurantForm({...restaurantForm, cuisine: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Opening Hours (e.g., 9 AM - 10 PM)"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.openingHours}
                  onChange={(e) => setRestaurantForm({...restaurantForm, openingHours: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-sm mb-1">Opening Time</label>
                    <input
                      type="time"
                      className="w-full border p-2 rounded"
                      value={restaurantForm.openingTime}
                      onChange={(e) => setRestaurantForm({...restaurantForm, openingTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Closing Time</label>
                    <input
                      type="time"
                      className="w-full border p-2 rounded"
                      value={restaurantForm.closingTime}
                      onChange={(e) => setRestaurantForm({...restaurantForm, closingTime: e.target.value})}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  className="w-full border p-2 rounded mb-3"
                  value={restaurantForm.imageUrl}
                  onChange={(e) => setRestaurantForm({...restaurantForm, imageUrl: e.target.value})}
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded flex-1">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRestaurantForm(false);
                      setRestaurantForm({
                        name: '',
                        description: '',
                        address: '',
                        phone: '',
                        cuisine: '',
                        openingHours: '',
                        openingTime: '',
                        closingTime: '',
                        imageUrl: '',
                      });
                    }}
                    className="bg-gray-300 px-4 py-2 rounded flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Restaurant Owner Dashboard</h1>
          <button
            onClick={() => setShowRestaurantForm(true)}
            className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            + Add Restaurant
          </button>
        </div>

        {/* Restaurant Selector */}
        {restaurants.length > 1 && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Select Restaurant:</label>
            <select
              className="border p-2 rounded w-full md:w-auto"
              value={selectedRestaurant?.id || ''}
              onChange={(e) => {
                const restaurant = restaurants.find(r => r.id === parseInt(e.target.value));
                setSelectedRestaurant(restaurant);
              }}
            >
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-green-500">{stats.confirmed}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-primary">₹{stats.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b flex">
            <button
              className={`px-6 py-3 font-semibold ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-semibold ${activeTab === 'menu' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu Items
            </button>
            <button
              className={`px-6 py-3 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && selectedRestaurant && (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h2>
                    <p className="text-gray-600 mb-2">{selectedRestaurant.description}</p>
                    <p className="text-gray-600"><strong>Address:</strong> {selectedRestaurant.address}</p>
                    <p className="text-gray-600"><strong>Cuisine:</strong> {selectedRestaurant.cuisine}</p>
                    <p className="text-gray-600"><strong>Hours:</strong> {selectedRestaurant.openingHours || 'Not set'}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {selectedRestaurant.phone || 'Not set'}</p>
                  </div>
                  <button
                    onClick={() => editRestaurant(selectedRestaurant)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Edit Restaurant
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Menu Items</h3>
                    <p className="text-2xl font-bold">{foodItems.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Status</h3>
                    <p className="text-lg">{selectedRestaurant.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Menu Items</h2>
                  <button
                    onClick={() => setShowFoodItemForm(true)}
                    className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    + Add Item
                  </button>
                </div>
                {foodItems.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No menu items yet. Add your first item!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {foodItems.map(item => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                            <p className="text-primary font-bold">₹{item.price}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.category}</span>
                              {item.isVegetarian && <span className="text-xs bg-green-200 px-2 py-1 rounded">🌱 Veg</span>}
                              <span className={`text-xs px-2 py-1 rounded ${item.isAvailable ? 'bg-green-200' : 'bg-red-200'}`}>
                                {item.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => editFoodItem(item)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFoodItem(item.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-sm text-gray-600">{order.username}</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{order.totalAmount}</p>
                            <span className={`text-sm px-3 py-1 rounded ${
                              order.status === 'PENDING' ? 'bg-yellow-200' :
                              order.status === 'CONFIRMED' ? 'bg-blue-200' :
                              order.status === 'PREPARING' ? 'bg-purple-200' :
                              order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-200' :
                              order.status === 'DELIVERED' ? 'bg-green-200' :
                              'bg-red-200'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600"><strong>Address:</strong> {order.deliveryAddress}</p>
                          <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.phone}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-semibold mb-1">Items:</p>
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {item.foodItemName} x {item.quantity} - ₹{item.subtotal}
                            </p>
                          ))}
                        </div>
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <div className="flex gap-2">
                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleOrderStatusUpdate(order.id, 'CONFIRMED')}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleOrderStatusUpdate(order.id, 'CANCELLED')}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {order.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'PREPARING')}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Start Preparing
                              </button>
                            )}
                            {order.status === 'PREPARING' && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'OUT_FOR_DELIVERY')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Out for Delivery
                              </button>
                            )}
                            {order.status === 'OUT_FOR_DELIVERY' && (
                              <button
                                onClick={() => handleOrderStatusUpdate(order.id, 'DELIVERED')}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Form Modal */}
      {showRestaurantForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingRestaurant ? 'Edit' : 'Create'} Restaurant</h3>
            <form onSubmit={handleRestaurantSubmit}>
              <input
                type="text"
                placeholder="Restaurant Name"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.name}
                onChange={(e) => setRestaurantForm({...restaurantForm, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.description}
                onChange={(e) => setRestaurantForm({...restaurantForm, description: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.address}
                onChange={(e) => setRestaurantForm({...restaurantForm, address: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.phone}
                onChange={(e) => setRestaurantForm({...restaurantForm, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Cuisine (e.g., Italian, Chinese)"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.cuisine}
                onChange={(e) => setRestaurantForm({...restaurantForm, cuisine: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Opening Hours (e.g., 9 AM - 10 PM)"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.openingHours}
                onChange={(e) => setRestaurantForm({...restaurantForm, openingHours: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-sm mb-1">Opening Time</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded"
                    value={restaurantForm.openingTime}
                    onChange={(e) => setRestaurantForm({...restaurantForm, openingTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Closing Time</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded"
                    value={restaurantForm.closingTime}
                    onChange={(e) => setRestaurantForm({...restaurantForm, closingTime: e.target.value})}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="w-full border p-2 rounded mb-3"
                value={restaurantForm.imageUrl}
                onChange={(e) => setRestaurantForm({...restaurantForm, imageUrl: e.target.value})}
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded flex-1">
                  {editingRestaurant ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRestaurantForm(false);
                    setEditingRestaurant(null);
                    setRestaurantForm({
                      name: '',
                      description: '',
                      address: '',
                      phone: '',
                      cuisine: '',
                      openingHours: '',
                      openingTime: '',
                      closingTime: '',
                      imageUrl: '',
                    });
                  }}
                  className="bg-gray-300 px-4 py-2 rounded flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Food Item Form Modal */}
      {showFoodItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingFoodItem ? 'Edit' : 'Add'} Menu Item</h3>
            <form onSubmit={handleFoodItemSubmit}>
              <input
                type="text"
                placeholder="Item Name"
                className="w-full border p-2 rounded mb-3"
                value={foodItemForm.name}
                onChange={(e) => setFoodItemForm({...foodItemForm, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded mb-3"
                value={foodItemForm.description}
                onChange={(e) => setFoodItemForm({...foodItemForm, description: e.target.value})}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                className="w-full border p-2 rounded mb-3"
                value={foodItemForm.price}
                onChange={(e) => setFoodItemForm({...foodItemForm, price: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category (e.g., Appetizer, Main Course)"
                className="w-full border p-2 rounded mb-3"
                value={foodItemForm.category}
                onChange={(e) => setFoodItemForm({...foodItemForm, category: e.target.value})}
                required
              />
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={foodItemForm.isVegetarian}
                  onChange={(e) => setFoodItemForm({...foodItemForm, isVegetarian: e.target.checked})}
                />
                Vegetarian
              </label>
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={foodItemForm.isAvailable}
                  onChange={(e) => setFoodItemForm({...foodItemForm, isAvailable: e.target.checked})}
                />
                Available
              </label>
              <input
                type="text"
                placeholder="Image URL (optional)"
                className="w-full border p-2 rounded mb-3"
                value={foodItemForm.imageUrl}
                onChange={(e) => setFoodItemForm({...foodItemForm, imageUrl: e.target.value})}
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded flex-1">
                  {editingFoodItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFoodItemForm(false);
                    setEditingFoodItem(null);
                    setFoodItemForm({
                      name: '',
                      description: '',
                      price: '',
                      category: '',
                      isVegetarian: false,
                      isAvailable: true,
                      imageUrl: '',
                    });
                  }}
                  className="bg-gray-300 px-4 py-2 rounded flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
