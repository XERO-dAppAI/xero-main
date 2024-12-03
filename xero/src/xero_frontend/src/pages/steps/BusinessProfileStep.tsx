import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';
import { 
  Building2, 
  Globe2, 
  FileText, 
  Phone, 
  Mail, 
  ImagePlus,
  Store,
  Building,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          logo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save to localStorage
      localStorage.setItem('business_profile', JSON.stringify({
        ...formData,
        logo: previewLogo,
        created_at: Date.now(),
        updated_at: Date.now()
      }));
      
      // Complete this step and navigate to next
      await completeStep(2);
      navigate('/features');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const getPhoneCode = () => {
    const country = africanCountries.find(c => c.value === formData.country);
    return country?.phoneCode || '';
  };

  const iconContainerClass = `
    w-8 h-8 rounded-full flex items-center justify-center
    bg-gradient-to-br from-white/10 to-[#1a6363]/5
    backdrop-blur-[4px]
    border border-white/20
    shadow-[inset_0_0_8px_rgba(26,99,99,0.1)]
    relative
    before:absolute before:inset-0 before:rounded-full
    before:bg-gradient-to-br before:from-white/20 before:to-transparent
    before:backdrop-blur-[4px]
    hover:before:opacity-70
    transition-all duration-300
  `;

  const iconClass = "w-4 h-4 text-[#1a6363] relative z-10";

  return (
    <div className="max-w-3xl mx-auto w-full">
      <motion.h2 
        className="section-title mt-5 mb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-[#062424]">Set up your</span>{" "}
        <motion.span
          className="text-[#267c7c]"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          business
        </motion.span>
      </motion.h2>

      <motion.div className="relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl" />
        
        <motion.form 
          className="relative z-10 p-8 space-y-8"
          onSubmit={handleSubmit}
        >
          {/* Logo Upload with glassy effect */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="relative">
              {/* Glassy circle background */}
              <div className="absolute inset-0 rounded-full bg-[#062424]/5 backdrop-blur-md" />
              
              {/* Dashed border circle */}
              <label
                htmlFor="logo-upload"
                className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden cursor-pointer group"
                style={{
                  background: 'linear-gradient(145deg, rgba(26,99,99,0.05), rgba(6,36,36,0.1))',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '2px dashed rgba(26,99,99,0.3)',
                }}
              >
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                
                {previewLogo ? (
                  <div className="w-full h-full relative group">
                    <img 
                      src={previewLogo} 
                      alt="Business Logo" 
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{
                        background: 'linear-gradient(145deg, rgba(6,36,36,0.7), rgba(26,99,99,0.8))',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <ImagePlus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#1a6363] group-hover:text-[#062424] transition-colors">
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-sm font-syne">Upload Logo</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <Store className={iconClass} />
                </div>
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424] placeholder:text-[#062424]/50"
                placeholder="Enter your business name"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <Globe2 className={iconClass} />
                </div>
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424]"
                required
              >
                <option value="">Select country</option>
                {africanCountries.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Registration Number */}
            <div>
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <BadgeCheck className={iconClass} />
                </div>
                Registration Number *
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424] placeholder:text-[#062424]/50"
                placeholder="Enter registration number"
                required
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <Building2 className={iconClass} />
                </div>
                Business Type *
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424]"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Category */}
            <div>
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <Building className={iconClass} />
                </div>
                Business Category *
              </label>
              <select
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424]"
                required
              >
                <option value="">Select business category</option>
                {businessCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <Phone className={iconClass} />
                </div>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424] placeholder:text-[#062424]/50"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-[#062424] font-syne mb-2">
                <div className={iconContainerClass}>
                  <Mail className={iconClass} />
                </div>
                Business Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#062424]/5 border border-[#1a6363]/20 focus:border-[#1a6363] outline-none text-[#062424] placeholder:text-[#062424]/50"
                placeholder="Enter business email"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <motion.button
              className="group relative overflow-hidden rounded-3xl font-syne px-12 py-4 w-[380px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              {/* Glass effect background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#062424]/80 to-[#1a6363]/80 backdrop-blur-[4px]" />
              
              {/* Shine effect */}
              <div className="absolute inset-0">
                <div 
                  className="absolute inset-0 transform -translate-x-full animate-windshield bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>

              {/* Border glow */}
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />

              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                <span>Continue to Features</span>
                <motion.div
                  animate={{ 
                    x: [0, 5, 0] 
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}; 