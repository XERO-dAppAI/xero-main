import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';

interface BusinessProfileForm {
  businessName: string;
  businessType: string;
  businessCategory: string;
  country: string;
  registrationNumber: string;
  logo: File | null;
  phoneNumber: string;
  email: string;
}

export const BusinessProfileStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useStep();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BusinessProfileForm>({
    businessName: '',
    businessType: '',
    businessCategory: '',
    country: '',
    registrationNumber: '',
    logo: null,
    phoneNumber: '',
    email: ''
  });

  const businessTypes = [
    { value: 'small_business', label: 'Small Business' },
    { value: 'startup', label: 'Startup' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'franchise', label: 'Franchise' }
  ];

  const businessCategories = [
    { value: 'supermarket', label: 'Supermarket' },
    { value: 'grocery', label: 'Grocery Store' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'food_chain', label: 'Food Chain' }
  ];

  const africanCountries = [
    { value: 'dz', label: 'Algeria', phoneCode: '+213' },
    { value: 'ao', label: 'Angola', phoneCode: '+244' },
    { value: 'bj', label: 'Benin', phoneCode: '+229' },
    { value: 'bw', label: 'Botswana', phoneCode: '+267' },
    { value: 'bf', label: 'Burkina Faso', phoneCode: '+226' },
    { value: 'bi', label: 'Burundi', phoneCode: '+257' },
    { value: 'cm', label: 'Cameroon', phoneCode: '+237' },
    { value: 'cv', label: 'Cape Verde', phoneCode: '+238' },
    { value: 'cf', label: 'Central African Republic', phoneCode: '+236' },
    { value: 'td', label: 'Chad', phoneCode: '+235' },
    { value: 'km', label: 'Comoros', phoneCode: '+269' },
    { value: 'cg', label: 'Congo', phoneCode: '+242' },
    { value: 'cd', label: 'DR Congo', phoneCode: '+243' },
    { value: 'dj', label: 'Djibouti', phoneCode: '+253' },
    { value: 'eg', label: 'Egypt', phoneCode: '+20' },
    { value: 'gq', label: 'Equatorial Guinea', phoneCode: '+240' },
    { value: 'er', label: 'Eritrea', phoneCode: '+291' },
    { value: 'et', label: 'Ethiopia', phoneCode: '+251' },
    { value: 'ga', label: 'Gabon', phoneCode: '+241' },
    { value: 'gm', label: 'Gambia', phoneCode: '+220' },
    { value: 'gh', label: 'Ghana', phoneCode: '+233' },
    { value: 'gn', label: 'Guinea', phoneCode: '+224' },
    { value: 'gw', label: 'Guinea-Bissau', phoneCode: '+245' },
    { value: 'ci', label: 'Ivory Coast', phoneCode: '+225' },
    { value: 'ke', label: 'Kenya', phoneCode: '+254' },
    { value: 'ls', label: 'Lesotho', phoneCode: '+266' },
    { value: 'lr', label: 'Liberia', phoneCode: '+231' },
    { value: 'ly', label: 'Libya', phoneCode: '+218' },
    { value: 'mg', label: 'Madagascar', phoneCode: '+261' },
    { value: 'mw', label: 'Malawi', phoneCode: '+265' },
    { value: 'ml', label: 'Mali', phoneCode: '+223' },
    { value: 'mr', label: 'Mauritania', phoneCode: '+222' },
    { value: 'mu', label: 'Mauritius', phoneCode: '+230' },
    { value: 'ma', label: 'Morocco', phoneCode: '+212' },
    { value: 'mz', label: 'Mozambique', phoneCode: '+258' },
    { value: 'na', label: 'Namibia', phoneCode: '+264' },
    { value: 'ne', label: 'Niger', phoneCode: '+227' },
    { value: 'ng', label: 'Nigeria', phoneCode: '+234' },
    { value: 'rw', label: 'Rwanda', phoneCode: '+250' },
    { value: 'st', label: 'São Tomé and Príncipe', phoneCode: '+239' },
    { value: 'sn', label: 'Senegal', phoneCode: '+221' },
    { value: 'sc', label: 'Seychelles', phoneCode: '+248' },
    { value: 'sl', label: 'Sierra Leone', phoneCode: '+232' },
    { value: 'so', label: 'Somalia', phoneCode: '+252' },
    { value: 'za', label: 'South Africa', phoneCode: '+27' },
    { value: 'ss', label: 'South Sudan', phoneCode: '+211' },
    { value: 'sd', label: 'Sudan', phoneCode: '+249' },
    { value: 'sz', label: 'Eswatini', phoneCode: '+268' },
    { value: 'tz', label: 'Tanzania', phoneCode: '+255' },
    { value: 'tg', label: 'Togo', phoneCode: '+228' },
    { value: 'tn', label: 'Tunisia', phoneCode: '+216' },
    { value: 'ug', label: 'Uganda', phoneCode: '+256' },
    { value: 'zm', label: 'Zambia', phoneCode: '+260' },
    { value: 'zw', label: 'Zimbabwe', phoneCode: '+263' }
  ];

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewLogo(base64String);
        setFormData(prev => ({
          ...prev,
          logo: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save to localStorage with all data including logo
      localStorage.setItem('business_profile', JSON.stringify({
        ...formData,
        logo: previewLogo, // Save the base64 logo string
        created_at: Date.now(),
        updated_at: Date.now()
      }));
      
      completeStep(2);
      navigate('/features');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const getPhoneCode = () => {
    const country = africanCountries.find(c => c.value === formData.country);
    return country?.phoneCode || '';
  };

  return (
    <div className="flex-grow flex flex-col items-center px-16 py-8">
      <motion.h1 
        className="section-title mb-8 font-syne"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Set Up Business Profile
      </motion.h1>

      <motion.form 
        className="w-full max-w-2xl space-y-8"
        onSubmit={handleSubmit}
      >
        {/* Logo Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 dark-purple-glow animate-glow rounded-full" />
            <label
              htmlFor="logo-upload"
              className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-secondary relative z-10 cursor-pointer hover:bg-gray-50 transition-colors group"
            >
              {previewLogo ? (
                <div className="w-full h-full relative group">
                  <img 
                    src={previewLogo} 
                    alt="Business Logo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm">Change Logo</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center group-hover:text-gray-500 transition-colors">
                  <svg 
                    className="w-12 h-12 mx-auto mb-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                  <span className="text-sm">Upload Logo</span>
                </div>
              )}
            </label>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
            id="logo-upload"
          />
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-primary font-syne mb-2">
            Business Name *
          </label>
          <input
            id="businessName"
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full p-3 rounded-lg border border-gray-300 font-raleway placeholder:font-raleway"
            placeholder="Enter your business name"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-primary font-syne mb-2">
              Country *
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 font-raleway"
              required
            >
              <option value="" className="font-raleway">Select country</option>
              {africanCountries.map(country => (
                <option key={country.value} value={country.value} className="font-raleway">
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Number */}
          <div>
            <label htmlFor="registrationNumber" className="block text-primary font-syne mb-2">
              Business Registration Number *
            </label>
            <input
              id="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 font-raleway placeholder:font-raleway"
              placeholder="Enter registration number"
              required
            />
          </div>

          {/* Business Type */}
          <div>
            <label htmlFor="businessType" className="block text-primary font-syne mb-2">
              Business Type *
            </label>
            <select
              id="businessType"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 font-raleway"
              required
            >
              <option value="" className="font-raleway">Select business type</option>
              {businessTypes.map(type => (
                <option key={type.value} value={type.value} className="font-raleway">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Business Category */}
          <div>
            <label htmlFor="businessCategory" className="block text-primary font-syne mb-2">
              Business Category *
            </label>
            <select
              id="businessCategory"
              value={formData.businessCategory}
              onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 font-raleway"
              required
            >
              <option value="" className="font-raleway">Select business category</option>
              {businessCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-primary font-raleway mb-2">
              Phone Number *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                {getPhoneCode()}
              </span>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="flex-1 p-3 rounded-r-lg border border-gray-300"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-primary font-raleway mb-2">
              Business Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300"
              placeholder="Enter business email"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 dark-purple-glow animate-glow rounded-lg" />
          <button
            type="submit"
            className="w-full bg-[#666ed2] text-white py-4 px-6 rounded-lg font-raleway relative z-10 hover:bg-[#666ed2]/90 transition-colors"
          >
            Continue to Features
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}; 