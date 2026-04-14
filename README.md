# 💍 Shadi Brain – Mobile App (Frontend)

A modern **React Native (CLI)** mobile application for managing wedding planning, budgets, events, and tasks collaboratively with family members.

---

## 🚀 Tech Stack

* **React Native CLI**
* **TypeScript**
* **React Navigation (Stack)**
* **Zustand (State Management)**
* **Axios (API Handling)**
* **Formik + Yup (Forms & Validation)**

---

## 📁 Project Structure

```id="s3h2kd"
src/
│── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Header.tsx
│
│── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │
│   ├── weddings/
│   │   ├── MyWeddingsScreen.tsx
│   │   ├── CreateWeddingScreen.tsx
│   │
│   ├── events/
│   │   ├── EventsScreen.tsx
│   │
│   ├── HomeScreen.tsx
│
│── navigation/
│   ├── RootStack.tsx
│   ├── AuthStack.tsx
│   ├── AppStack.tsx
│
│── store/
│   └── authStore.ts
│
│── utils/
│   ├── axios.ts
│   ├── storage.ts
│   ├── validation.ts
│   ├── toast.ts
│
│── constants/
│   └── index.ts
```

---

## 🔐 Authentication Flow

* JWT-based authentication
* Token stored securely using AsyncStorage
* Zustand used for global auth state

```id="2hzlsk"
Login → Save Token → Store User → Navigate to App
```

---

## 🧭 Navigation Flow

```id="pjz91s"
RootStack
   ├── AuthStack (Login / Register)
   └── AppStack (Home → Weddings → Events)
```

---

## 📱 Core Screens

### 🔑 Auth

* Login Screen
* Register Screen

### 🏠 Home

* Dashboard UI
* Budget Overview
* Quick Actions

### 💒 Weddings

* List all weddings
* Create new wedding

### 🎉 Events

* Event listing per wedding
* Event-based navigation

---

## 🧩 Reusable Components

### 🔹 Button

* Variants: Primary, Outline
* Loading state support

### 🔹 Input

* Label + Error handling
* Password toggle
* Clean UI

### 🔹 Header

* Reusable across screens
* Title, subtitle, avatar, notification

---

## 🌐 API Integration

Axios instance configured:

```id="3e0l2o"
Authorization: Bearer <token>
```

* Auto attaches JWT token
* Centralized API handling

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```id="9xt2b8"
git clone <repo-url>
cd frontend
```

---

### 2. Install Dependencies

```id="k9e4zt"
npm install
```

---

### 3. Start Metro

```id="iqwzlb"
npx react-native start
```

---

### 4. Run App

#### Android

```id="c3bl3q"
npx react-native run-android
```


## 🔧 Environment Setup

Update API base URL in:

```id="wokc3z"
src/utils/axios.ts
```

```ts id="dtrm3b"
baseURL: "http://localhost:5000/api"
```

👉 For Android Emulator:

```id="7rmk7m"
http://10.0.2.2:5000/api
```

---

## 🧪 Testing

* Use real backend APIs
* Ensure token is set after login
* Verify navigation flow

---

## 📌 Features Implemented

* ✅ Authentication (Login/Register)
* ✅ Navigation (Auth + App separation)
* ✅ Wedding Management UI
* ✅ Event Flow (basic)
* ✅ Reusable UI Components
* ✅ Form Validation
* ✅ API Integration

---

## 🚧 Upcoming Features

* Expense Tracking
* Task Management
* Notifications
* Charts & Analytics
* Multi-user collaboration UI

---

## 🎨 UI/UX Highlights

* Clean wedding-themed design
* Soft color palette
* Mobile-first UX
* Minimal & intuitive layouts

---

## 👨‍💻 Author

Built with ❤️ Ehatisham Khan

---

## ⭐ Notes

* Uses React Native CLI (no Expo)
* Scalable folder structure
* Clean separation of concerns
* Production-ready architecture

---
