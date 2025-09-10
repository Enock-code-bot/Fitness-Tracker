import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface WaterIntake {
  id: string;
  amount_ml: number;
  drink_type: string;
  date: string;
  time: string;
  notes?: string;
}

const WaterTracker: React.FC = () => {
  const { user } = useAuth();
  const [waterIntake, setWaterIntake] = useState<WaterIntake[]>([]);
  const [dailyGoal] = useState(2000); // 2 liters default
  const [newAmount, setNewAmount] = useState<number>(250);
  const [drinkType, setDrinkType] = useState<string>('water');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodayWaterIntake();
    }
  }, [user]);

  const fetchTodayWaterIntake = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('time', { ascending: false });

    if (error) {
      console.error('Error fetching water intake:', error);
    } else {
      setWaterIntake(data || []);
    }
  };

  const addWaterIntake = async () => {
    if (!user || newAmount <= 0) return;

    setLoading(true);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const { error } = await supabase
      .from('water_intake')
      .insert({
        user_id: user.id,
        amount_ml: newAmount,
        drink_type: drinkType,
        date: today,
        time: time,
      });

    if (error) {
      console.error('Error adding water intake:', error);
    } else {
      await fetchTodayWaterIntake();
      setNewAmount(250);
    }
    setLoading(false);
  };

  const getTotalWaterToday = () => {
    return waterIntake.reduce((total, intake) => total + intake.amount_ml, 0);
  };

  const getProgressPercentage = () => {
    return Math.min((getTotalWaterToday() / dailyGoal) * 100, 100);
  };

  const quickAddAmounts = [250, 500, 750];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">💧 Water Intake</h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Today's Progress</span>
          <span>{getTotalWaterToday()}ml / {dailyGoal}ml</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick Add:</p>
        <div className="flex gap-2 mb-3" role="group" aria-label="Quick water amount selection">
          {quickAddAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setNewAmount(amount)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 transition-colors text-sm"
              aria-label={`Add ${amount}ml of water`}
              type="button"
            >
              {amount}ml
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(Number(e.target.value))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount (ml)"
            min="1"
          />
          <select
            value={drinkType}
            onChange={(e) => setDrinkType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="water">Water</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="juice">Juice</option>
            <option value="soda">Soda</option>
          </select>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={addWaterIntake}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Adding...' : 'Add Water Intake'}
      </button>

      {/* Today's Intake List */}
      {waterIntake.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Today's Intake:</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {waterIntake.map((intake) => (
              <div key={intake.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                <span>{intake.amount_ml}ml {intake.drink_type}</span>
                <span className="text-gray-500">{intake.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterTracker;
