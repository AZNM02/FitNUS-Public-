<div align="center">
  <h1>🏋️‍♂️ FitNUS: Fitness Tracking App</h1>
  <p>
    <img src="https://img.shields.io/badge/React%20Native-Expo-blue" alt="React Native Expo" />
    <img src="https://img.shields.io/badge/Node.js-Express-green" alt="Node.js Express" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen" alt="MongoDB Atlas" />
    <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-lightgrey" alt="Platform" />
  </p>
  <p>A cross-platform fitness and nutrition tracking app built with React Native (Expo), a Node.js/Express REST API, and MongoDB Atlas.</p>
</div>

---

## 🚀 Motivation

Singapore's fast-paced lifestyle makes maintaining a healthy routine challenging, especially for students and working adults. FitNUS is designed to help users easily track their fitness and nutrition, making healthy living more accessible and organised — all from a single mobile app.

---

## 🎯 What the App Does

FitNUS is a full-stack fitness companion that lets users:

- Log workouts and view their complete exercise history
- Record daily meals and track calorie intake
- Find nearby gyms in real time using their device's GPS
- Schedule upcoming workouts on a weekly calendar and receive push notifications as reminders

---

## 👤 User Stories

- *As a university student*, I want to track and plan my workout routine so I stay consistent throughout the semester.
- *As a health-conscious user*, I want to log my meals and calorie intake to better manage my diet.
- *As a busy working adult*, I want to schedule workouts at convenient times and be reminded automatically.

---

## 📱 App Screens & Features

### Welcome Screen
The entry point of the app. Displays the FitNUS logo and a **Start** button that navigates to the Home dashboard.

### Home Dashboard
A central navigation hub with four clearly labelled buttons routing to each major section of the app:
- Activity Log
- Nutrition Log
- Nearest Gyms
- Workout Schedule

### Activity Log
Fetches all previously logged workouts from the backend and displays them in a scrollable list. Each entry shows the exercise name and duration/set details, stamped with the date it was recorded.

### Add Exercise
A form that lets users log a new workout entry with the following fields:
- Exercise name
- Duration / number of sets
- Weight (kg)
- Reps
- Distance travelled (km)

On submission, the data is `POST`ed to the Express API and saved to MongoDB.

### Nutrition Log
Fetches all logged meals from the backend and displays each entry's name, calorie count, and the date it was added.

### Add Meal
A simple form for recording a new meal with:
- Meal name
- Calorie count

On submission, the data is `POST`ed to the Express API and persisted in MongoDB.

### Gym Finder *(Mobile only)*
Uses `expo-location` to request the user's current GPS coordinates, then queries the **Google Places Nearby Search API** to find gyms within a 5 km radius. Results are rendered as map markers on a full-screen `react-native-maps` `MapView`, with a distinct marker for the user's own position. The web build shows a graceful fallback message since GPS/maps are mobile-only.

### Workout Schedule *(Mobile only)*
A weekly calendar view powered by `react-native-swiper` and `moment.js` that allows users to:
- Swipe between weeks (previous, current, next)
- Select a day and add named workout tasks to it
- Pick a specific date and time via the native `DateTimePicker`
- Delete individual tasks from the list
- Receive a **local push notification** (via `expo-notifications`) as a reminder before each scheduled workout

Tasks are persisted locally using `@react-native-async-storage/async-storage` so they survive app restarts without requiring a server round-trip.

---

## 🗂️ Project Structure

```
FitNUS/
├── app/                        # Expo Router screens (file-based routing)
│   ├── index.jsx               # Welcome / landing screen
│   ├── Home.jsx                # Main dashboard
│   ├── Gymfinder.jsx           # Web fallback for Gym Finder
│   ├── Gymfinder.native.jsx    # Native Gym Finder (GPS + Google Maps)
│   ├── Activities/
│   │   ├── ActivityLog.jsx     # View logged exercises
│   │   └── AddExercise.jsx     # Log a new exercise
│   ├── NutritionLog/
│   │   ├── Nutrition.jsx       # View logged meals
│   │   └── AddMeal.jsx         # Log a new meal
│   └── Schedule/
│       ├── Schedule.jsx        # Web fallback for Schedule
│       └── Schedule.native.jsx # Native weekly scheduler + notifications
├── components/
│   ├── Button.jsx              # Reusable styled button
│   └── UserField.jsx           # Reusable text input field
├── FITNUS_backend/             # Node.js / Express REST API
│   ├── app.js                  # Express server, routes, MongoDB connection
│   ├── MealDetails.js          # Mongoose schema for meals
│   └── WorkoutDetails.js       # Mongoose schema for workouts
├── assets/                     # Fonts and images
├── constants/                  # Colour tokens and icon references
└── hooks/                      # Custom React hooks (colour scheme, theme)
```

---

## 🛠️ Tech Stack

### Frontend (Mobile & Web)
| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform UI framework |
| **Expo** (~51) | Managed workflow, dev server, native module access |
| **Expo Router** | File-based navigation (tabs + stack) |
| **react-native-maps** | Interactive map view for Gym Finder |
| **expo-location** | Device GPS for Gym Finder |
| **react-native-swiper** | Swipeable weekly calendar |
| **expo-notifications** | Local push notifications for workout reminders |
| **@react-native-async-storage/async-storage** | Offline-first local task persistence |
| **@react-native-community/datetimepicker** | Native date/time picker for scheduling |
| **Axios** | HTTP client for API requests |
| **Moment.js** | Date formatting and week calculation |
| **TypeScript** | Type safety across shared hooks and constants |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **Mongoose** | MongoDB ODM / schema validation |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **date-fns** | Server-side date utilities |

### External APIs
| API | Purpose |
|---|---|
| **Google Places Nearby Search API** | Fetching gym locations near the user |

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns `{ status: "Started" }` |
| `POST` | `/addmeal` | Save a new meal `{ name, calories }` |
| `GET` | `/meals` | Retrieve all logged meals |
| `POST` | `/addworkout` | Save a new workout `{ name, duration, weight, reps, distance }` |
| `GET` | `/exercises` | Retrieve all logged exercises |

### MongoDB Schemas

**MealInfo**
```
name: String
calories: String
date: Date (auto-set on creation)
```

**WorkoutInfo**
```
name: String
duration: String
weight: String
reps: String
distance: String
date: Date (auto-set on creation)
```

---

## 📦 Getting Started

### Prerequisites
- Node.js ≥ 18
- Expo CLI (`npm install -g expo-cli`)
- Android emulator / iOS simulator, or the **Expo Go** app on a physical device
- A MongoDB Atlas cluster
- A Google Maps Platform API key with the **Places API** enabled

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/FitNUS.git
cd FitNUS
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file (or configure via EAS) in the project root:
```env
EXPO_PUBLIC_API_BASE_URL=http://<your-server-ip>:3000
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
```

### 4. Start the backend
```bash
cd FITNUS_backend
npm install
npm start
```

### 5. Start the Expo dev server
```bash
cd ..
npx expo start
```

Scan the QR code with **Expo Go** or press `a` / `i` to open in an emulator.

---

## 🏗️ Build & Deployment

This project uses **EAS (Expo Application Services)** for building production-ready binaries.

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

EAS configuration is defined in [`eas.json`](eas.json). The Android package name is `com.aznm.FITNUS`.
