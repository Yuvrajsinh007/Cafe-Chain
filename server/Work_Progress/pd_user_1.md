# CafeNet Backend Documentation

## 📊 System Architecture: Phone Number-Based Check-in + OTP Verification + Referral + Cafe Validation

-----

### 📌 Overview

CafeNet is a local cafe discovery and loyalty platform. The backend uses a **phone number-based identity** to drive a comprehensive set of features, including a new OTP verification system for secure registration and an XP system for gamification.

| Feature               | Description                                       |
| --------------------- | ------------------------------------------------- |
| ✅ **OTP-based Login** | Secure registration via phone (OTP verification)  |
| 🤝 Referral System    | Track referrers & allocate reward points          |
| 👨‍🍳 Cafe Accounts   | Staff can log visits & allocate rewards           |
| 🎁 Points System      | Track earned and redeemed points (per cafe)      |
| ✨ XP System         | Track user progress with experience points        |
| 🔒 Obfuscated Numbers | Secure storage for admin-only views               |

-----

## 🔑 OTP & User Authentication Module

This module handles the secure two-step registration and login process.

### 🔍 Core Features

| Feature                 | Details                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| 📱 Registration/Login   | Phone-based with OTP verification for registration, password or OTP for login |
| 🛡️ Secure Phone Suffix | Only visible to admin (`securePhoneId`)                            |
| 👤 Editable Profile     | Includes name & profile image                                      |
| 🤝 Referral Chain       | Auto point allocation (150 points on first visit by referred user) |
| 💰 Points System        | ₹500 spent = 50 points (default logic)                             |
| ✨ XP System            | XP is awarded for visits and a bonus is given for the first visit  |
| 📜 Transaction History  | Track visits, earned and redeemed points                           |

### 🧾 User & OTP API Endpoints

| Method | Endpoint                          | Description                                              |
| ------ | --------------------------------- | -------------------------------------------------------- |
| POST   | /api/users/request-otp           | Request a 6-digit OTP for phone verification             |
| POST   | /api/users/register               | Verify OTP and register user with phone, password, referral code |
| POST   | /api/users/login                  | Login using phone + password or OTP                      |
| GET    | /api/users/profile/:phone         | Retrieve profile info, points, and XP                    |
| PUT    | /api/users/profile/:phone         | Edit name/profile image                                  |
| GET    | /api/users/referral-chain/:phone  | View full referral tree                                  |
| GET    | /api/users/history/:phone         | View visit history                                       |
| GET    | /api/users/rewards/:phone         | View reward transaction history                          |
| POST   | /api/users/log-visit              | Cafe staff logs a user's visit and awards points/XP    |

-----

## 📂 Data Models

### User Model

The user model has been updated to store points on a per-cafe basis and to track XP.

```json
{
  "name": String,
  "phone": { "type": String, "unique": true },
  "securePhoneId": { "type": String, "unique": true },
  "password": String,
  "profilePic": String,
  "points": [
    {
      "cafeId": { "type": "ObjectId", "ref": "Cafe" },
      "totalPoints": { "type": Number, "default": 0 }
    }
  ],
  "referredBy": String,
  "referralCode": String,
  "referralChildren": ["String"],
  "createdAt": Date,
  "visitLogs": [{ "type": "ObjectId", "ref": "VisitLog" }],
  "rewardLogs": [{ "type": "ObjectId", "ref": "RewardTransaction" }],
  "hasMultiplier": { "type": Boolean, "default": false },
  "xp": { "type": Number, "default": 0 }
}
```

### OTP Model

A temporary model to store OTPs, which expire automatically.

```json
{
  "phone": { "type": String, "required": true, "unique": true },
  "otp": { "type": String, "required": true },
  "createdAt": { "type": Date, "expires": 600 }
}
```

### Cafe Model

A basic model to represent a cafe.

```json
{
  "name": { "type": String, "required": true },
  "address": String,
  "phone": String,
  "ownerId": { "type": "ObjectId", "ref": "User" },
  "cafeCode": { "type": String, "unique": true }
}
```

### VisitLog Model

Logs a user's visit to a cafe.

```json
{
  "userId": { "type": "ObjectId", "ref": "User" },
  "cafeId": { "type": "ObjectId", "ref": "Cafe" },
  "amountSpent": Number,
  "pointsEarned": Number,
  "xpEarned": Number,
  "timestamp": Date
}
```

### RewardTransaction Model

Logs all points-related transactions.

```json
{
  "userId": { "type": "ObjectId", "ref": "User" },
  "cafeId": { "type": "ObjectId", "ref": "Cafe" },
  "type": { "type": String, "enum": ["earn", "redeem", "referral_bonus"] },
  "points": Number,
  "description": String,
  "timestamp": Date
}
```

-----

## 🧰 Middleware

| Middleware               | Purpose                             |
| ------------------------ | ----------------------------------- |
| `validatePhoneNumber`    | Ensures valid phone format          |
| `authenticateUserJWT`    | Protects user endpoints             |

-----

## 🗂 Folder Structure

```
/routes
  users.js
/controllers
  userController.js
  otpController.js
/models
  User.js
  OTP.js
  Cafe.js
  RewardTransaction.js
  VisitLog.js
/middleware
  auth.js
  validate.js
/config
  db.js
.env
server.js
```