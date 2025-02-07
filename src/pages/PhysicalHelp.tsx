import React, { useState } from 'react';
import { Activity, Heart, Scale, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface BMIResult {
  bmi: number;
  category: string;
  recommendation: string;
}

export function PhysicalHelp() {
  const { user } = useAuth();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let category = '';
    let recommendation = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      recommendation = 'Consider consulting a nutritionist for a healthy weight gain plan.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
      recommendation = 'Maintain your healthy lifestyle with balanced diet and regular exercise.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      recommendation = 'Focus on portion control and increasing physical activity.';
    } else {
      category = 'Obese';
      recommendation = 'Please consult a healthcare provider for personalized weight management advice.';
    }

    setBmiResult({ bmi: parseFloat(bmi.toFixed(1)), category, recommendation });

    // Save BMI result if user is logged in
    if (user) {
      saveBMIResult(bmi, category);
    }
  };

  const saveBMIResult = async (bmi: number, category: string) => {
    try {
      const { error } = await supabase
        .from('bmi_records')
        .insert([{
          user_id: user?.id,
          bmi: bmi,
          category: category,
          height: parseFloat(height),
          weight: parseFloat(weight),
          calculated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving BMI result:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Physical Health Resources</h1>
        <p className="text-gray-600">Expert guidance and resources for maintaining optimal physical health</p>
      </div>

      {/* BMI Calculator */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12 transform hover:scale-105 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Scale className="w-8 h-8 text-blue-600 mr-2" />
          BMI Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your height"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your weight"
                />
              </div>
              <button
                onClick={calculateBMI}
                disabled={!height || !weight}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Calculate BMI
              </button>
            </div>
          </div>
          <div>
            {bmiResult && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Your BMI Result</h3>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-blue-600">{bmiResult.bmi}</p>
                  <p className="font-medium">Category: {bmiResult.category}</p>
                  <p className="text-gray-600">{bmiResult.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold mb-6">Daily Exercise Routine</h2>
          <div className="space-y-4">
            {[
              { time: '10 mins', activity: 'Warm-up exercises' },
              { time: '20 mins', activity: 'Cardio (walking/jogging)' },
              { time: '15 mins', activity: 'Strength training' },
              { time: '10 mins', activity: 'Stretching' },
              { time: '5 mins', activity: 'Cool-down' }
            ].map((item) => (
              <div key={item.activity} className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 transition-colors p-2 rounded">
                <span className="font-medium">{item.activity}</span>
                <span className="text-gray-600">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold mb-6">Nutrition Guidelines</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4 hover:bg-green-50 transition-colors p-2 rounded">
              <h3 className="font-semibold mb-2">Balanced Diet</h3>
              <p className="text-gray-600">Include proteins, carbohydrates, and healthy fats</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 hover:bg-blue-50 transition-colors p-2 rounded">
              <h3 className="font-semibold mb-2">Hydration</h3>
              <p className="text-gray-600">Drink 8-10 glasses of water daily</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 hover:bg-yellow-50 transition-colors p-2 rounded">
              <h3 className="font-semibold mb-2">Meal Timing</h3>
              <p className="text-gray-600">Eat regular meals, avoid skipping breakfast</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4 hover:bg-red-50 transition-colors p-2 rounded">
              <h3 className="font-semibold mb-2">Portions</h3>
              <p className="text-gray-600">Control portion sizes for better health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-bold mb-6">Daily Health Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Sleep Well',
              tips: [
                'Maintain a regular sleep schedule',
                'Aim for 7-8 hours of sleep',
                'Create a relaxing bedtime routine'
              ]
            },
            {
              title: 'Stay Active',
              tips: [
                'Take regular breaks from sitting',
                'Use stairs instead of elevator',
                'Walk for 30 minutes daily'
              ]
            },
            {
              title: 'Mental Wellness',
              tips: [
                'Practice deep breathing',
                'Take short meditation breaks',
                'Stay socially connected'
              ]
            }
          ].map((section) => (
            <div key={section.title} className="border rounded-lg p-6 hover:shadow-lg transition-all transform hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}