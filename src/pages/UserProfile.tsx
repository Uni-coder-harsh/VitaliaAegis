import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Pencil, Save, X, Upload, Trash2, User, AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  enrollment_number: string | null;
  blood_group: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  course: string | null;
  phone: string | null;
}

interface MedicalRecord {
  id: string;
  file_name: string;
  file_url: string;
  description: string;
  record_date: string;
  uploaded_at: string;
}

interface NewMedicalRecord {
  description: string;
  record_date: string;
}

export function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [newMedicalRecord, setNewMedicalRecord] = useState<NewMedicalRecord>({
    description: '',
    record_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMedicalRecords();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setMedicalRecords(data || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id);

      if (error) throw error;
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // File validation
      if (file.size < 5 * 1024) { // 5KB minimum
        throw new Error('File size must be at least 5KB');
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB maximum
        throw new Error('File size must be less than 2MB');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG, PNG, and WebP images are allowed');
      }

      setUploading(true);
      setError('');

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldFilePath = profile.avatar_url.split('/').pop();
        if (oldFilePath) {
          await supabase.storage
            .from('avatars')
            .remove([`avatars/${oldFilePath}`]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccess('Avatar updated successfully!');
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleMedicalRecordUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // File validation
      if (file.size < 5 * 1024) {
        throw new Error('File size must be at least 5KB');
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only PDF, JPG, PNG, DOC, and DOCX files are allowed');
      }

      if (medicalRecords.length >= 15) {
        throw new Error('Maximum limit of 15 medical records reached. Please delete some records to upload more.');
      }

      setUploading(true);
      setError('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `medical_records/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('medical_records')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('medical_records')
        .insert([{
          user_id: user?.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          description: newMedicalRecord.description,
          record_date: newMedicalRecord.record_date
        }]);

      if (insertError) throw insertError;

      setSuccess('Medical record uploaded successfully!');
      setNewMedicalRecord({
        description: '',
        record_date: new Date().toISOString().split('T')[0]
      });
      fetchMedicalRecords();
    } catch (error) {
      console.error('Error uploading medical record:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload medical record');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRecord = async (id: string, fileUrl: string) => {
    try {
      const filePath = fileUrl.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('medical_records')
          .remove([`medical_records/${filePath}`]);
      }

      const { error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Medical record deleted successfully!');
      fetchMedicalRecords();
    } catch (error) {
      console.error('Error deleting medical record:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete medical record');
    }
  };

  // Add validation messages
  const renderFileValidation = () => (
    <div className="text-sm text-gray-600 mt-1">
      <p>File requirements:</p>
      <ul className="list-disc list-inside">
        <li>Size: 5KB - 2MB</li>
        <li>Formats: JPG, PNG, WebP (for profile picture)</li>
        <li>Formats: PDF, JPG, PNG, DOC, DOCX (for medical records)</li>
      </ul>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Upload className="h-5 w-5 text-gray-600" />
              </label>
              {renderFileValidation()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile?.full_name || 'Update your profile'}
              </h1>
              <p className="text-blue-100">{profile?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile?.full_name || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  value={profile?.enrollment_number || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, enrollment_number: e.target.value } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={profile?.blood_group || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, blood_group: e.target.value } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  value={profile?.age || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, age: parseInt(e.target.value) } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={profile?.weight || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, weight: parseFloat(e.target.value) } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={profile?.height || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, height: parseFloat(e.target.value) } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <input
                  type="text"
                  value={profile?.course || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, course: e.target.value } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  disabled={!editing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-5 w-5 inline-block mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="h-5 w-5 inline-block mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Pencil className="h-5 w-5 inline-block mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </form>

          {/* Medical Records Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Medical Records</h2>
            
            {/* Upload Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Upload New Record</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newMedicalRecord.description}
                    onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Record Date
                  </label>
                  <input
                    type="date"
                    value={newMedicalRecord.record_date}
                    onChange={(e) => setNewMedicalRecord(prev => ({ ...prev, record_date: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  File Upload
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleMedicalRecordUpload}
                    className="form-input"
                    disabled={uploading || medicalRecords.length >= 15}
                  />
                  {uploading && (
                    <div className="ml-4">
                      <div className="loading-spinner" />
                    </div>
                  )}
                </div>
                {renderFileValidation()}
                {medicalRecords.length >= 15 && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Maximum limit of 15 records reached
                  </p>
                )}
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{record.description}</h4>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(record.record_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      File: {record.file_name}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={record.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDeleteRecord(record.id, record.file_url)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {medicalRecords.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No medical records uploaded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}