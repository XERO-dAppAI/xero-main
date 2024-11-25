export const validateBusinessProfile = {
    businessName: (value: string) => {
        if (value.length < 2) return "Business name must be at least 2 characters";
        if (value.length > 100) return "Business name must be less than 100 characters";
        return null;
    },

    registrationNumber: (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 8) {
            return "Registration number must be at least 8 digits";
        }
        if (digits.length > 12) {
            return "Registration number must not exceed 12 digits";
        }
        if (!/^\d+$/.test(digits)) {
            return "Registration number must contain only numbers";
        }
        return null;
    },

    phoneNumber: (value: string) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 9) return "Phone number must be at least 9 digits";
        if (digits.length > 15) return "Phone number must be less than 15 digits";
        return null;
    },

    email: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "Please enter a valid email address";
        }
        return null;
    },

    businessCategory: (value: string) => {
        const validCategories = ['supermarket', 'grocery', 'restaurant', 'food_chain'];
        if (!validCategories.includes(value)) {
            return "Please select a valid business category";
        }
        return null;
    },
}; 