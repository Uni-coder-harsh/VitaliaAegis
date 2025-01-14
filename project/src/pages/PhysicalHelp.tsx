import React from 'react';
import { Activity, Heart, Scale, Brain } from 'lucide-react';

export function PhysicalHelp() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Physical Health Resources</h1>
        <p className="text-gray-600">Expert guidance and resources for maintaining optimal physical health</p>
      </div>

      {/* Quick Health Check */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Health Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Activity, title: 'Activity Level', desc: 'Track your daily physical activity' },
            { icon: Heart, title: 'Heart Health', desc: 'Monitor your cardiovascular health' },
            { icon: Scale, title: 'BMI Calculator', desc: 'Check your body mass index' },
            { icon: Brain, title: 'Stress Level', desc: 'Assess your stress indicators' }
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center p-4">
              <item.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Daily Exercise Routine</h2>
          <div className="space-y-4">
            {[
              { time: '10 mins', activity: 'Warm-up exercises' },
              { time: '20 mins', activity: 'Cardio (walking/jogging)' },
              { time: '15 mins', activity: 'Strength training' },
              { time: '10 mins', activity: 'Stretching' },
              { time: '5 mins', activity: 'Cool-down' }
            ].map((item) => (
              <div key={item.activity} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{item.activity}</span>
                <span className="text-gray-600">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Nutrition Guidelines</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-2">Balanced Diet</h3>
              <p className="text-gray-600">Include proteins, carbohydrates, and healthy fats</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-2">Hydration</h3>
              <p className="text-gray-600">Drink 8-10 glasses of water daily</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold mb-2">Meal Timing</h3>
              <p className="text-gray-600">Eat regular meals, avoid skipping breakfast</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold mb-2">Portions</h3>
              <p className="text-gray-600">Control portion sizes for better health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-white rounded-lg shadow-md p-8">
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
            <div key={section.title} className="border rounded-lg p-6">
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