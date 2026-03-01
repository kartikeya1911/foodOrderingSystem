import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">-</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Total Restaurants</h3>
            <p className="text-3xl font-bold text-primary">-</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-primary">-</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Features</h2>
          <p className="text-gray-600">
            Admin dashboard features can be implemented here including user management,
            restaurant approval, order monitoring, and system analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
