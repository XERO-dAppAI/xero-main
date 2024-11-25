import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  Globe,
  MapPin,
  Edit2,
  Save,
  X
} from 'lucide-react';

export const Account: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('business_profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setEditedProfile(parsedProfile);
        if (parsedProfile.logo) {
          setPreviewLogo(parsedProfile.logo);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewLogo(base64String);
        setEditedProfile({ ...editedProfile, logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      ...editedProfile,
      logo: previewLogo,
      updated_at: Date.now()
    };
    localStorage.setItem('business_profile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setPreviewLogo(profile.logo);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#666ED2]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-500">
        No profile information found
      </div>
    );
  }

  const renderField = (label: string, value: string, field: string) => {
    return isEditing ? (
      <input
        type="text"
        value={editedProfile[field]}
        onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
        className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#666ED2] outline-none"
      />
    ) : (
      <p className="font-syne text-[#2D2654]">{value}</p>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-syne text-[#2D2654]">Business Profile</h2>
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#666ED2] text-white rounded-lg hover:bg-[#666ED2]/90 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#666ED2] text-white rounded-lg hover:bg-[#666ED2]/90 transition-colors"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#666ED2]/10 flex items-center justify-center overflow-hidden">
              {(previewLogo || profile.logo) ? (
                <img 
                  src={previewLogo || profile.logo}
                  alt="Business Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-[#666ED2]" />
              )}
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <span className="text-white text-sm">Change Logo</span>
              </label>
            )}
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.businessName}
                onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                className="text-2xl font-syne text-[#2D2654] mb-2 p-2 rounded-lg border border-gray-200 focus:border-[#666ED2] outline-none"
              />
            ) : (
              <h1 className="text-2xl font-syne text-[#2D2654] mb-2">
                {profile.businessName}
              </h1>
            )}
            <p className="text-gray-500 font-raleway">
              {profile.businessType} · {profile.businessCategory}
            </p>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {/* Business Information */}
          <div>
            <h2 className="text-xl font-syne text-[#2D2654] mb-4">Business Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: <Building2 />, label: 'Business Name', field: 'businessName' },
                { icon: <FileText />, label: 'Registration Number', field: 'registrationNumber' },
                { icon: <Globe />, label: 'Business Type', field: 'businessType' },
                { icon: <Building2 />, label: 'Category', field: 'businessCategory' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="p-2 rounded-lg bg-[#666ED2]/10 text-[#666ED2]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-raleway mb-1">{item.label}</p>
                    {renderField(item.label, profile[item.field], item.field)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-syne text-[#2D2654] mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: <MapPin />, label: 'Country', field: 'country' },
                { icon: <Phone />, label: 'Phone Number', field: 'phoneNumber' },
                { icon: <Mail />, label: 'Email', field: 'email' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="p-2 rounded-lg bg-[#666ED2]/10 text-[#666ED2]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-raleway mb-1">{item.label}</p>
                    {renderField(item.label, profile[item.field], item.field)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 