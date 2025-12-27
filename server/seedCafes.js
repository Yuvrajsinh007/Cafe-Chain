// seedCafes.js
const mongoose = require("mongoose");
const Cafe = require("./models/Cafe");
require("dotenv").config();

// Dummy owner ObjectIds (replace with real User IDs later if available)
const dummyOwners = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

const cafes = [
  { 
    name: "The Cafe de Meet", 
    address: "Ahmedabad", 
    phone: "9876543210", 
    ownerId: dummyOwners[0], 
    cafeCode: "CAFE001",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    features: ["Free WiFi", "Good for work", "Artisanal"]
  },
  { 
    name: "Cafe Soul", 
    address: "Vadodara", 
    phone: "9876543211", 
    ownerId: dummyOwners[1], 
    cafeCode: "CAFE002",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    features: ["Live music", "Specialty coffee", "Cozy atmosphere"]
  },
  { 
    name: "Brew & Bean", 
    address: "Rajkot", 
    phone: "9876543212", 
    ownerId: dummyOwners[2], 
    cafeCode: "CAFE003",
    image: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff",
    features: ["Outdoor seating", "Pet-friendly", "Good for study"]
  },
  { 
    name: "Latte Lounge", 
    address: "Surat", 
    phone: "9876543213", 
    ownerId: dummyOwners[3], 
    cafeCode: "CAFE004",
    image: "https://images.unsplash.com/photo-1527169402691-a3fbf1c2b3e0",
    features: ["Artisanal bakery", "Instagram-worthy", "Quiet space"]
  },
  { 
    name: "Mocha Magic", 
    address: "Gandhinagar", 
    phone: "9876543214", 
    ownerId: dummyOwners[4], 
    cafeCode: "CAFE005",
    image: "https://images.unsplash.com/photo-1445077100181-a33e9ac94db0",
    features: ["Late-night open", "Cozy sofas", "Free WiFi"]
  },
];

const seedCafes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing cafes
    await Cafe.deleteMany({});
    console.log("🗑️ Old cafes removed");

    // Insert new cafes
    await Cafe.insertMany(cafes);
    console.log("🌱 Cafes seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding cafes:", err);
    process.exit(1);
  }
};

seedCafes();