import React, { useState, useEffect } from 'react';
import { Camera, Plus, Home, Settings, Trash2, Upload, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://nifdaoaxjihkwbgviwsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZmRhb2F4amloa3diZ3Zpd3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDU0MDAsImV4cCI6MjA3Mzc4MTQwMH0.pPPgJ8L_dfouSLrajPg1gxq3d8XLVTrbBp91LxB9e1Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------- Login Screen ----------------
const LoginScreen = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;

      setTimeout(() => {
        setIsLoading(false);
        onLogin(data.user);
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      alert('Login failed. Please try again.');
    }
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
          No account needed. Your data is stored securely.
        </p>
      </div>
    </div>
  );
};

// ---------------- Food Card ----------------
const FoodIntakeCard = ({ foodIntake, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-102 border border-gray-100"
    >
      {foodIntake.imageUrl && (
        <div className="h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
          <img
            src={foodIntake.imageUrl}
            alt="Food"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-gray-800 font-medium mb-2 line-clamp-2">{foodIntake.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{foodIntake.nutrients?.calories || 0} kcal</span>
          <span>{new Date(foodIntake.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

// ---------------- Nutrient Modal ----------------
const NutrientModal = ({ foodIntake, onClose }) => {
  if (!foodIntake) return null;

  const nutrients = foodIntake.nutrients || {};
  const nutrientsList = [
    { label: 'Calories', value: nutrients.calories, unit: 'kcal', color: 'bg-red-100 text-red-800' },
    { label: 'Protein', value: nutrients.protein, unit: 'g', color: 'bg-blue-100 text-blue-800' },
    { label: 'Carbohydrates', value: nutrients.carbs, unit: 'g', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Fat', value: nutrients.fat, unit: 'g', color: 'bg-purple-100 text-purple-800' },
    { label: 'Fiber', value: nutrients.fiber, unit: 'g', color: 'bg-green-100 text-green-800' },
    { label: 'Sugar', value: nutrients.sugar, unit: 'g', color: 'bg-pink-100 text-pink-800' },
    { label: 'Sodium', value: nutrients.sodium, unit: 'mg', color: 'bg-orange-100 text-orange-800' },
    { label: 'Calcium', value: nutrients.calcium, unit: 'mg', color: 'bg-indigo-100 text-indigo-800' },
    { label: 'Iron', value: nutrients.iron, unit: 'mg', color: 'bg-gray-100 text-gray-800' },
    { label: 'Vitamin C', value: nutrients.vitaminC, unit: 'mg', color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Vitamin A', value: nutrients.vitaminA, unit: 'IU', color: 'bg-amber-100 text-amber-800' },
    { label: 'Potassium', value: nutrients.potassium, unit: 'mg', color: 'bg-teal-100 text-teal-800' },
  ].filter(n => n.value !== undefined && n.value !== null);

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
          {foodIntake.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img
                src={foodIntake.imageUrl}
                alt="Food"
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          <p className="text-gray-700 mb-6 font-medium">{foodIntake.description}</p>

          <div className="grid grid-cols-1 gap-3">
            {nutrientsList.map((nutrient) => (
              <div key={nutrient.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{nutrient.label}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${nutrient.color}`}>
                  {nutrient.value} {nutrient.unit}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Added on {new Date(foodIntake.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- Add Food Modal ----------------
const AddFoodModal = ({ isOpen, onClose, onAdd, currentUser }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() && !imageFile) return;

    setIsProcessing(true);

    try {
      let imageId = null;

      // Upload image if provided
      if (imageFile) {
        const filePath = `${currentUser.id}/${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user_photos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        imageId = uploadData.path;
      }

      // Analyze food using edge function
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze_food', {
          body: {
            description: description || 'Food item',
            image_id: imageId,
          },
        });

      if (analysisError) throw analysisError;

      // Create food intake record
      const { data: foodIntake, error: insertError } = await supabase
        .from('food_intakes')
        .insert({
          user_id: currentUser.id,
          food_image_id: imageId,
          description: description || 'Food item',
          nutrients: analysisData,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onAdd(foodIntake);
      setDescription('');
      setImage(null);
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error('Error adding food intake:', error);
      alert('Failed to add food intake. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
                      onClick={() => {
                        setImage(null);
                        setImageFile(null);
                      }}
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
              disabled={(!description.trim() && !imageFile) || isProcessing}
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

// ---------------- Settings Screen ----------------
const SettingsScreen = ({ onDeleteAll, onLogout, currentUser }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAll = async () => {
    try {
      // Delete all food intakes
      const { error } = await supabase.from('food_intakes').delete().eq('user_id', currentUser.id);
      if (error) throw error;

      // Delete all images in user's folder
      const { data: files, error: listError } = await supabase.storage.from('user_photos').list(currentUser.id);
      if (!listError && files.length > 0) {
        const fileNames = files.map((f) => `${currentUser.id}/${f.name}`);
        await supabase.storage.from('user_photos').remove(fileNames);
      }

      onDeleteAll();
      onLogout();
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data. Please try again.');
    }
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
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
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

// ---------------- Main App ----------------
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [foodIntakes, setFoodIntakes] = useState([]);
  const [selectedFoodIntake, setSelectedFoodIntake] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchFoodIntakes();
    }
  }, [currentUser]);

  const fetchFoodIntakes = async () => {
    try {
      const { data, error } = await supabase
        .from('food_intakes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFoodIntakes(data || []);
    } catch (error) {
      console.error('Error fetching food intakes:', error);
    }
  };

  const handleAddFoodIntake = (newFoodIntake) => {
    setFoodIntakes([newFoodIntake, ...foodIntakes]);
  };

  const handleDeleteAll = () => {
    setFoodIntakes([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow p-4 pb-24">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodIntakes.map((intake) => (
              <FoodIntakeCard
                key={intake.id}
                foodIntake={intake}
                onClick={() => setSelectedFoodIntake(intake)}
              />
            ))}
          </div>
        )}
        {activeTab === 'settings' && (
          <SettingsScreen onDeleteAll={handleDeleteAll} onLogout={handleLogout} currentUser={currentUser} />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center ${
              activeTab === 'home' ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-4 rounded-full shadow-lg -mt-12 hover:from-emerald-600 hover:to-blue-700 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center ${
              activeTab === 'settings' ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddFoodModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFoodIntake}
          currentUser={currentUser}
        />
      )}
      {selectedFoodIntake && (
        <NutrientModal
          foodIntake={selectedFoodIntake}
          onClose={() => setSelectedFoodIntake(null)}
        />
      )}
    </div>
  );
};

export default App;
