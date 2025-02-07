import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Activity, 
  Brain, 
  Heart, 
  LineChart, 
  User as UserIcon,
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';

interface DashboardData {
  profile: any;
  mentalHealthScore: number;
  recentAssessments: any[];
  medicalRecords: any[];
  healthMetrics: {
    bmi: number;
    mentalHealthStatus: string;
    physicalHealthStatus: string;
  };
}

export function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // If profile is incomplete, redirect to onboarding
      if (!profile?.medical_details_completed) {
        navigate('/medical-onboarding');
        return;
      }

      const { data: assessments } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: records } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      // Calculate health metrics
      const bmi = profile.weight / Math.pow(profile.height / 100, 2);
      const latestAssessment = assessments?.[0];
      const mentalHealthScore = latestAssessment ? JSON.parse(latestAssessment.result).score : 0;

      setDashboardData({
        profile,
        mentalHealthScore,
        recentAssessments: assessments || [],
        medicalRecords: records || [],
        healthMetrics: {
          bmi,
          mentalHealthStatus: getMentalHealthStatus(mentalHealthScore),
          physicalHealthStatus: getPhysicalHealthStatus(bmi)
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMentalHealthStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getPhysicalHealthStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    return 'Obese';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* User Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
            {dashboardData?.profile?.avatar_url ? (
              <img
                src={dashboardData.profile.avatar_url}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{dashboardData?.profile?.full_name}</h1>
            <p className="text-gray-600">{dashboardData?.profile?.enrollment_number}</p>
            <div className="mt-2 flex space-x-4">
              <span className="text-sm text-gray-500">Age: {dashboardData?.profile?.age}</span>
              <span className="text-sm text-gray-500">Blood Group: {dashboardData?.profile?.blood_group}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Mental Health</h2>
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {dashboardData?.mentalHealthScore}/100
          </div>
          <p className="text-gray-600">{dashboardData?.healthMetrics.mentalHealthStatus}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Physical Health</h2>
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            BMI: {dashboardData?.healthMetrics.bmi.toFixed(1)}
          </div>
          <p className="text-gray-600">{dashboardData?.healthMetrics.physicalHealthStatus}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Activity Status</h2>
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {dashboardData?.recentAssessments.length} Assessments
          </div>
          <p className="text-gray-600">Last assessed: {
            dashboardData?.recentAssessments[0]?.created_at 
              ? new Date(dashboardData.recentAssessments[0].created_at).toLocaleDateString()
              : 'Never'
          }</p>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Recent Health Assessments</h2>
        <div className="space-y-4">
          {dashboardData?.recentAssessments.map((assessment) => (
            <div key={assessment.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Mental Health Assessment</p>
                  <p className="text-sm text-gray-600">
                    {new Date(assessment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{JSON.parse(assessment.result).score}/100</p>
                  <p className="text-sm text-gray-600">{JSON.parse(assessment.result).status}</p>
                </div>
              </div>
            </div>
          ))}
          {dashboardData?.recentAssessments.length === 0 && (
            <p className="text-gray-600 text-center py-4">No assessments taken yet</p>
          )}
        </div>
      </div>

      {/* Medical Records */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Medical Records</h2>
        <div className="space-y-4">
          {dashboardData?.medicalRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="font-semibold">{record.description}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(record.record_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={record.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                View
              </a>
            </div>
          ))}
          {dashboardData?.medicalRecords.length === 0 && (
            <p className="text-gray-600 text-center py-4">No medical records uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}