import React, { useState, useEffect } from 'react';
import { Camera, Plus, Home, Settings, Trash2, Upload, X } from 'lucide-react';

// Mock data and utilities
const mockNutrientData = {
  calories: 245,
  protein: 12.5,
  carbs: 35.2,
  fat: 8.1,
  fiber: 4.2,
  sugar: 18.5,
  sodium: 156,
  calcium: 89,
  iron: 2.1,
  vitaminC: 45.2,
  vitaminA: 125,
  potassium: 287
};

const generateMockNutrients = () => ({
  calories: Math.floor(Math.random() * 400) + 100,
  protein: Math.round((Math.random() * 25 + 5) * 10) / 10,
  carbs: Math.round((Math.random() * 50 + 10) * 10) / 10,
  fat: Math.round((Math.random() * 20 + 2) * 10) / 10,
  fiber: Math.round((Math.random() * 8 + 1) * 10) / 10,
  sugar: Math.round((Math.random() * 30 + 5) * 10) / 10,
  sodium: Math.floor(Math.random() * 300) + 50,
  calcium: Math.floor(Math.random() * 200) + 50,
  iron: Math.round((Math.random() * 5 + 0.5) * 10) / 10,
  vitaminC: Math.round((Math.random() * 60 + 10) * 10) / 10,
  vitaminA: Math.floor(Math.random() * 200) + 50,
  potassium: Math.floor(Math.random() * 400) + 100
});

// Authentication Component
const LoginScreen = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">NutriTracker</h1>
          <p className="text-gray-600">Track your nutrition with AI</p>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Logging in...
            </div>
          ) : (
            'Anonymous Login'
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          No account needed. Your data is stored locally.
        </p>
      </div>
    </div>
  );
};

// Food Intake Card Component
const FoodIntakeCard = ({ foodIntake, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-102 border border-gray-100"
    >
      {foodIntake.image && (
        <div className="h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
          <img 
            src={foodIntake.image} 
            alt="Food" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-gray-800 font-medium mb-2 line-clamp-2">{foodIntake.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{foodIntake.calories} kcal</span>
          <span>{new Date(foodIntake.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// Nutrient Detail Modal Component
const NutrientModal = ({ foodIntake, onClose }) => {
  if (!foodIntake) return null;

  const nutrients = [
    { label: 'Calories', value: foodIntake.calories, unit: 'kcal', color: 'bg-red-100 text-red-800' },
    { label: 'Protein', value: foodIntake.protein, unit: 'g', color: 'bg-blue-100 text-blue-800' },
    { label: 'Carbohydrates', value: foodIntake.carbs, unit: 'g', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Fat', value: foodIntake.fat, unit: 'g', color: 'bg-purple-100 text-purple-800' },
    { label: 'Fiber', value: foodIntake.fiber, unit: 'g', color: 'bg-green-100 text-green-800' },
    { label: 'Sugar', value: foodIntake.sugar, unit: 'g', color: 'bg-pink-100 text-pink-800' },
    { label: 'Sodium', value: foodIntake.sodium, unit: 'mg', color: 'bg-orange-100 text-orange-800' },
    { label: 'Calcium', value: foodIntake.calcium, unit: 'mg', color: 'bg-indigo-100 text-indigo-800' },
    { label: 'Iron', value: foodIntake.iron, unit: 'mg', color: 'bg-gray-100 text-gray-800' },
    { label: 'Vitamin C', value: foodIntake.vitaminC, unit: 'mg', color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Vitamin A', value: foodIntake.vitaminA, unit: 'IU', color: 'bg-amber-100 text-amber-800' },
    { label: 'Potassium', value: foodIntake.potassium, unit: 'mg', color: 'bg-teal-100 text-teal-800' },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Nutrition Facts</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {foodIntake.image && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img src={foodIntake.image} alt="Food" className="w-full h-32 object-cover" />
            </div>
          )}
          
          <p className="text-gray-700 mb-6 font-medium">{foodIntake.description}</p>
          
          <div className="grid grid-cols-1 gap-3">
            {nutrients.map((nutrient) => (
              <div key={nutrient.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{nutrient.label}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${nutrient.color}`}>
                  {nutrient.value} {nutrient.unit}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Added on {new Date(foodIntake.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Food Intake Modal Component
const AddFoodModal = ({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() && !image) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newFoodIntake = {
        id: Date.now(),
        description: description || 'Food item',
        image: image,
        createdAt: new Date().toISOString(),
        ...generateMockNutrients()
      };
      
      onAdd(newFoodIntake);
      setDescription('');
      setImage(null);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Add Food Intake</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors">
                {image ? (
                  <div className="relative">
                    <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-700"
                    >
                      Click to upload image
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your meal..."
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={(!description.trim() && !image) || isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Add Food Intake'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Screen Component
const SettingsScreen = ({ onDeleteAll, onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAll = () => {
    onDeleteAll();
    onLogout();
    setShowConfirm(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>
        
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-300 flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete All Data
        </button>
        
        <p className="text-sm text-gray-500 mt-3 text-center">
          This will permanently delete all your food intake data and log you out.
        </p>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all your data? This cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [foodIntakes, setFoodIntakes] = useState([]);
  const [selectedFoodIntake, setSelectedFoodIntake] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Initialize with some mock data
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        description: 'Grilled chicken breast with quinoa and steamed broccoli',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        ...generateMockNutrients()
      },
      {
        id: 2,
        description: 'Greek yogurt with mixed berries and honey',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        ...generateMockNutrients()
      }
    ];
    setFoodIntakes(mockData);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
    setSelectedFoodIntake(null);
    setShowAddModal(false);
  };

  const handleAddFoodIntake = (newFoodIntake) => {
    setFoodIntakes(prev => [newFoodIntake, ...prev]);
  };

  const handleDeleteAll = () => {
    setFoodIntakes([]);
  };

  // Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Main App Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'home' ? 'My Food Intake' : 'Settings'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {activeTab === 'home' ? (
          <div className="p-6">
            {foodIntakes.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No food intake recorded</h2>
                <p className="text-gray-500">Start by adding your first meal!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {foodIntakes.map((foodIntake) => (
                  <FoodIntakeCard
                    key={foodIntake.id}
                    foodIntake={foodIntake}
                    onClick={() => setSelectedFoodIntake(foodIntake)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <SettingsScreen onDeleteAll={handleDeleteAll} onLogout={handleLogout} />
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab === 'home' && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-20 right-6 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-30"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center py-3 px-4 ${
              activeTab === 'home'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center py-3 px-4 ${
              activeTab === 'settings'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <NutrientModal
        foodIntake={selectedFoodIntake}
        onClose={() => setSelectedFoodIntake(null)}
      />

      <AddFoodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddFoodIntake}
      />
    </div>
  );
};

export default App;