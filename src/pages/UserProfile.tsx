import React from 'react';

export function UserProfile() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Container */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto border-4 border-blue-500 object-cover"
          />
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 pb-4 mb-6 border-b-2 border-blue-500">
              Personal Information
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Name', value: 'Harsh' },
                { label: 'Blood Group', value: 'A+' },
                { label: 'Age', value: 'XX' },
                { label: 'Weight', value: 'XX kg' },
                { label: 'Height', value: 'XXX cm' },
                { label: 'Course', value: 'B Tech M&C' },
                { label: 'Phone No', value: '+91 xxxxxxxxxx' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">{item.label}:</span>
                  <span className="text-gray-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medical History Container */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 pb-4 mb-6 border-b-2 border-blue-500">
            Medical History
          </h2>
          
          <div className="space-y-4">
            {[
              { label: 'Allergies', value: 'None' },
              { label: 'Chronic Conditions', value: 'None' },
              { label: 'Medications', value: 'None' },
              { label: 'Last Checkup', value: '01/01/2025' },
              { label: 'Blood Pressure', value: '120/80 mmHg' },
              { label: 'Cholesterol', value: '190 mg/dL' },
              { label: 'Vaccinations', value: 'Up to date' },
              { label: 'Emergency Contact', value: 'name of Personal (911)' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">{item.label}:</span>
                <span className="text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}