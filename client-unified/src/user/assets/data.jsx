// Dummy data for CafeNet application
// This will be replaced with actual API calls when backend is ready

export const userData = {
  id: 1,
  name: "Deep",
  email: "deep@gmail.com",
  points: 1800,
  referredCount: 6,
  profileImage: "/assets/profile-placeholder.jpg"
};

export const cafes = [
  {
    id: 1,
    name: "The Cafe de meet",
    location: "Downtown, City Center",
    tag: "WiFi • Pet Friendly",
    features: ["WiFi", "Pet Friendly", "Quiet", "Study"],
    image: "/assets/cafe1.jpg",
    rating: 4.5,
    distance: "0.5km"
  },
  {
    id: 2,
    name: "Cafe Soul",
    location: "Arts District",
    tag: "Quiet • Study",
    features: ["Quiet", "Study", "Student Discount", "Meeting Space"],
    image: "/assets/cafe2.jpg",
    rating: 4.2,
    distance: "1.2km"
  },
  {
    id: 3,
    name: "Brew & Bean",
    location: "University Area",
    tag: "Student Discount",
    features: ["Student Discount", "WiFi", "Meeting Space", "Family Friendly"],
    image: "/assets/cafe3.jpg",
    rating: 4.7,
    distance: "0.8km"
  },
  {
    id: 4,
    name: "Urban Coffee",
    location: "Business District",
    tag: "Meeting Space",
    features: ["Meeting Space", "WiFi", "Quiet", "Study"],
    image: "/assets/cafe4.jpg",
    rating: 4.3,
    distance: "1.5km"
  },
  {
    id: 5,
    name: "Cozy Corner",
    location: "Residential Area",
    tag: "Family Friendly",
    features: ["Family Friendly", "Pet Friendly", "WiFi", "Quiet"],
    image: "/assets/cafe5.jpg",
    rating: 4.6,
    distance: "2.1km"
  }
];

export const rewards = {
  pointsEarned: 1300,
  referredCount: 6,
  referralCode: "DEEP2024"
};

export const history = [
  {
    id: 1,
    cafeName: "cafeshop",
    points: 50,
    type: "earned",
    date: "2024-01-15",
    description: "Visit reward"
  },
  {
    id: 2,
    cafeName: "cafesoul",
    points: -100,
    type: "redeemed",
    date: "2024-01-14",
    description: "Coffee reward"
  },
  {
    id: 3,
    cafeName: "Brew & Bean",
    points: 75,
    type: "earned",
    date: "2024-01-13",
    description: "Referral bonus"
  },
  {
    id: 4,
    cafeName: "Urban Coffee",
    points: -50,
    type: "redeemed",
    date: "2024-01-12",
    description: "Pastry reward"
  }
];

// API endpoints (to be used when backend is ready)
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  
  // User
  USER_PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
  CHANGE_PASSWORD: '/api/user/password',
  
  // Cafes
  GET_CAFES: '/api/cafes',
  GET_CAFE_BY_ID: '/api/cafes/:id',
  GET_NEARBY_CAFES: '/api/cafes/nearby',
  
  // Points & Rewards
  GET_USER_POINTS: '/api/user/points',
  GET_REWARDS: '/api/user/rewards',
  REDEEM_REWARD: '/api/user/rewards/redeem',
  
  // History
  GET_VISIT_HISTORY: '/api/user/history/visits',
  GET_POINTS_HISTORY: '/api/user/history/points',
  
  // Referrals
  GET_REFERRAL_CODE: '/api/user/referral',
  GET_REFERRAL_HISTORY: '/api/user/referrals',
  
  // Admin (if user is admin)
  ADMIN_CAFES: '/api/admin/cafes',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_DASHBOARD: '/api/admin/dashboard'
};

// Sample API response structures
export const API_RESPONSES = {
  user: {
    id: 1,
    name: "Deep",
    email: "deep@gmail.com",
    points: 1800,
    referredCount: 6,
    profileImage: "/assets/profile-placeholder.jpg",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  
  cafe: {
    id: 1,
    name: "The Cafe de meet",
    description: "A cozy cafe in the heart of downtown",
    location: "Downtown, City Center",
    address: "123 Main St, City Center",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    tags: ["WiFi", "Pet Friendly", "Quiet"],
    rating: 4.5,
    totalVisits: 1250,
    image: "/assets/cafe1.jpg",
    openingHours: {
      monday: "7:00 AM - 8:00 PM",
      tuesday: "7:00 AM - 8:00 PM",
      wednesday: "7:00 AM - 8:00 PM",
      thursday: "7:00 AM - 8:00 PM",
      friday: "7:00 AM - 9:00 PM",
      saturday: "8:00 AM - 9:00 PM",
      sunday: "8:00 AM - 7:00 PM"
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  
  reward: {
    id: 1,
    name: "Free Coffee",
    description: "Get a free coffee of your choice",
    pointsRequired: 100,
    cafeId: 1,
    cafeName: "The Cafe de meet",
    isActive: true,
    expiresAt: "2024-12-31T23:59:59Z",
    createdAt: "2024-01-01T00:00:00Z"
  }
}; 