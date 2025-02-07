import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox';
  options?: string[];
  required?: boolean;
}

const medicalQuestions: Question[] = [
  {
    id: 'height',
    text: 'What is your height? (in cm)',
    type: 'number',
    required: true
  },
  {
    id: 'weight',
    text: 'What is your weight? (in kg)',
    type: 'number',
    required: true
  },
  {
    id: 'blood_group',
    text: 'What is your blood group?',
    type: 'select',
    options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    required: true
  },
  {
    id: 'allergies',
    text: 'Do you have any allergies?',
    type: 'checkbox',
    options: ['Food', 'Medicine', 'Seasonal', 'None']
  },
  {
    id: 'chronic_conditions',
    text: 'Do you have any chronic medical conditions?',
    type: 'checkbox',
    options: ['Asthma', 'Diabetes', 'Heart Disease', 'None']
  },
  {
    id: 'medications',
    text: 'Are you currently taking any medications?',
    type: 'text'
  },
  {
    id: 'exercise_frequency',
    text: 'How often do you exercise?',
    type: 'radio',
    options: ['Daily', '2-3 times a week', 'Once a week', 'Rarely', 'Never'],
    required: true
  },
  {
    id: 'sleep_hours',
    text: 'How many hours do you sleep on average?',
    type: 'number',
    required: true
  },
  {
    id: 'stress_level',
    text: 'How would you rate your stress level? (1-10)',
    type: 'number',
    required: true
  },
  {
    id: 'diet_type',
    text: 'What is your diet type?',
    type: 'radio',
    options: ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Other'],
    required: true
  }
];

export function MedicalOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState('');

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...answers,
          medical_details_completed: true
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving medical details:', error);
      setError('Failed to save medical details. Please try again.');
    }
  };

  const currentQuestion = medicalQuestions[currentStep];
  const progress = ((currentStep + 1) / medicalQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">Medical Information</h1>
          <p className="text-gray-600 text-center">
            Help us understand your health better to provide personalized recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {medicalQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>

          {currentQuestion.type === 'text' && (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              className="w-full p-2 border rounded-md"
              required={currentQuestion.required}
            />
          )}

          {currentQuestion.type === 'number' && (
            <input
              type="number"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, parseFloat(e.target.value))}
              className="w-full p-2 border rounded-md"
              required={currentQuestion.required}
            />
          )}

          {currentQuestion.type === 'select' && (
            <select
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              className="w-full p-2 border rounded-md"
              required={currentQuestion.required}
            >
              <option value="">Select an option</option>
              {currentQuestion.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}

          {currentQuestion.type === 'radio' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="form-radio"
                    required={currentQuestion.required}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={answers[currentQuestion.id]?.includes(option)}
                    onChange={(e) => {
                      const current = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswer(currentQuestion.id, [...current, option]);
                      } else {
                        handleAnswer(
                          currentQuestion.id,
                          current.filter((item: string) => item !== option)
                        );
                      }
                    }}
                    className="form-checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-gray-600 disabled:text-gray-400"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep === medicalQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Complete
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!answers[currentQuestion.id] && currentQuestion.required}
              className="flex items-center px-4 py-2 text-blue-600 disabled:text-gray-400"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}