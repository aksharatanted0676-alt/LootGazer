#  LootGazer – Fantasy Guild Trading & Economy Management Dashboard

## 🎯 Problem Statement

In multiplayer fantasy gaming environments, managing inventories, auctions, trades, and guild economies can become increasingly complex. Players often struggle to track market activities, monitor transactions, manage assets, and analyze economic trends efficiently.

The goal of this project is to provide a centralized platform that simplifies trading operations, enhances transparency, and delivers valuable economic insights through an engaging fantasy-themed user interface.

---

## 📖 Project Description

LootGazer is a React-based web application designed to streamline fantasy guild trading and economic management.

The platform enables users to:

- Manage player inventories
- Track marketplace transactions
- Monitor auction activities
- Analyze economic trends
- Visualize gold circulation
- Manage guild resources
- Explore global trading networks

The application combines interactive dashboards, economic analytics, and fantasy-inspired design elements to create an immersive user experience.

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- JavaScript (ES6+)
- CSS3

### State Management
- React Context API
- React Hooks

### UI & Icons
- Lucide React

### Testing
- Vitest
- React Testing Library
- Jest DOM

### Development Tools
- ESLint
- Vite Development Server

---

## ✨ Features Implemented

### Authentication & User Management
- Login functionality
- Character registration/signup
- Active player management
- User profile handling

### Dashboard Analytics
- Gold circulation statistics
- Active auction tracking
- Trade volume monitoring
- Most traded item analysis
- High-value asset tracking

### Trading Hall
- Marketplace management
- Trade creation and execution
- Trade monitoring

### Auction Ledger
- Auction creation
- Auction tracking
- Seller activity monitoring
- Auction history

### Trade Ledger
- Transaction history
- Trade status management
- Trade auditing

### Inventory Finder
- Search inventories
- Item filtering
- Item details lookup

### Kingdom Network
- Guild connectivity overview
- Network visualization
- Kingdom management

### Royal Treasury
- Gold management
- Treasury monitoring
- Economy insights

### Global Trade Hub
- Global trading analytics
- Cross-server trade tracking
- Marketplace statistics

### Economy Monitoring
- Economy alerts
- Gold flow visualization
- Market trend analytics
- Historical economic tracking

### User Experience Enhancements
- Responsive design
- Theme switching
- Toast notifications
- Interactive dashboards
- Loading skeletons

---

## 🏗️ System Architecture

<img width="1408" height="768" alt="Gemini_Generated_Image_2ad0kf2ad0kf2ad0" src="https://github.com/user-attachments/assets/bad3c3ea-d6ce-45d8-941f-c6cef930cd3e" />


### Architecture Flow

1. User interacts with UI.
2. Components trigger actions.
3. Context API manages shared state.
4. Data is stored/retrieved from Local Storage.
5. Updated state re-renders components.

---

## 🧩 Component Architecture

<img width="1408" height="768" alt="Gemini_Generated_Image_gk1pdsgk1pdsgk1p" src="https://github.com/user-attachments/assets/8f625cb9-0ee3-4c8b-9507-cbaa63d8fc51" />

---

## 🔄 State Management

### GuildContext
Manages:

- Players
- Inventories
- Auctions
- Trades
- Guild Operations
- Active Player Data

### ThemeContext
Manages:

- Dark/Light Theme
- User Preferences
- UI Appearance

### React Hooks Used

- `useState`
- `useEffect`
- `useContext`

### Data Persistence

- Browser Local Storage
- Context-based Global State

---

## 📸 Screenshots

### Login / Signup

<img width="1456" height="837" alt="Screenshot 2026-06-15 at 2 43 17 AM" src="https://github.com/user-attachments/assets/d87b2f46-4c25-4248-9044-914683837519" />


<img width="1469" height="837" alt="Screenshot 2026-06-15 at 2 44 35 AM" src="https://github.com/user-attachments/assets/6014cf73-5097-4cbd-9bc8-552dccd62534" />




### Dashboard
<img width="1470" height="834" alt="Screenshot 2026-06-15 at 2 46 01 AM" src="https://github.com/user-attachments/assets/0345d0e6-0fb7-45c9-a9eb-bf9a14e8c374" />
<img width="1468" height="834" alt="Screenshot 2026-06-15 at 2 46 10 AM" src="https://github.com/user-attachments/assets/55ea5874-987c-4c69-958d-97c6a18760f2" />
<img width="1470" height="840" alt="Screenshot 2026-06-15 at 2 46 23 AM" src="https://github.com/user-attachments/assets/b2477245-63b5-4707-a994-9a82e43c2c18" />




### Trading Hall

<img width="1470" height="823" alt="Screenshot 2026-06-15 at 2 48 12 AM" src="https://github.com/user-attachments/assets/e70ed96e-be5a-4412-8aae-d5f2440f7856" />


<img width="1470" height="836" alt="Screenshot 2026-06-15 at 2 48 21 AM" src="https://github.com/user-attachments/assets/516f70e8-958a-41ad-9102-d44213c41cb6" />




### Auction Ledger
<img width="1470" height="824" alt="Screenshot 2026-06-15 at 2 49 48 AM" src="https://github.com/user-attachments/assets/3263ff84-2def-40e5-9933-f0d8595f7b67" />




### Inventory Finder
<img width="1469" height="833" alt="Screenshot 2026-06-15 at 2 50 29 AM" src="https://github.com/user-attachments/assets/55575d49-0fe0-4ad7-b62c-ab500154a5d9" />




### Royal Treasury
<img width="837" height="700" alt="Screenshot 2026-06-15 at 2 52 15 AM" src="https://github.com/user-attachments/assets/66e08475-158d-4f1d-9bc2-c5c2ae94e9df" />




### Kingdom Network
<img width="1470" height="835" alt="Screenshot 2026-06-15 at 2 53 49 AM" src="https://github.com/user-attachments/assets/540128c1-6f32-468c-b965-a54113e0a3a2" />




### Global Trade Hub
<img width="1470" height="835" alt="Screenshot 2026-06-15 at 2 54 40 AM" src="https://github.com/user-attachments/assets/345f704d-9242-4b29-b70a-fcee7be7e6d3" />




### Market Trend Analytics
<img width="1459" height="786" alt="Screenshot 2026-06-15 at 2 55 57 AM" src="https://github.com/user-attachments/assets/b563b1f9-f1ce-45ea-8ad3-a2fbc5db340c" />
<img width="1470" height="837" alt="Screenshot 2026-06-15 at 2 56 12 AM" src="https://github.com/user-attachments/assets/d2b7f451-7062-49ed-87f0-284a17776148" />




---

## ⚠️ Challenges Faced

- Managing shared state across multiple pages.
- Persisting application data using Local Storage.
- Implementing economic analytics and gold circulation tracking.
- Designing reusable UI components.
- Maintaining responsive layouts across devices.
- Handling navigation and state synchronization.

---

## 🚀 Future Enhancements

### Backend Integration
- Node.js
- Express.js
- MongoDB / PostgreSQL

### Real-Time Features
- WebSocket Integration
- Live Trade Updates
- Real-Time Notifications

### Security & Authentication
- JWT Authentication
- Role-Based Access Control
- Secure API Integration

### Advanced Analytics
- AI-powered Market Prediction
- Automated Recommendations
- Economic Forecasting

### Multiplayer Features
- Guild Chat
- Collaborative Trading
- Real-Time Player Interaction

### Deployment
- Docker Support
- AWS Deployment
- Vercel Hosting

---

## 🎯 Conclusion

LootGazer successfully delivers a fantasy-themed guild trading and economy management platform that simplifies inventory tracking, auction monitoring, trade management, and market analysis.

Using React, Context API, and modern frontend development practices, the project provides a scalable, responsive, and engaging user experience while demonstrating strong component architecture and efficient state management.
