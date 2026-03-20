# 🚆 Metro Perceptron Planner

A modern, full-stack application that predicts metro train arrival times using a **simple Perceptron model** implemented in TypeScript. The application features a futuristic UI with glassmorphism, smooth Framer Motion animations, and interactive visualizations.

## ✨ Features

- **Route Setup**: Define your own metro routes with custom stations, distances, speeds, and dwell times.
- **Time Prediction**: Predict precise arrival times for every station based on physical parameters.
- **Journey Visualization**: Watch an animated train travel along your custom route with real-time arrival estimates.
- **Perceptron Trainer**: Provide historical data and watch the model "learn" using gradient descent, complete with weights visualization and MSE graphs.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (Dark Mode & Glassmorphism)
- **Animations**: Framer Motion
- **Data Fetching**: Axios + React Query
- **Charts**: Recharts

### Backend
- **Server**: Node.js + Express + TypeScript
- **Logic**: Custom Perceptron implementation (no heavy ML libraries)
- **Shared States**: In-memory storage for routes and weights

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm

### Installation

1. Clone the repository.
2. In the root directory, install all dependencies:
   ```bash
   npm run install-all
   ```

### Running the Application

To run both the frontend and backend simultaneously:
```bash
npm start
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

## 🧠 The Perceptron Model

The model approximates travel time (y) as a linear combination of physical features (x_i):
`TravelTime = (w_distance * distance) + (w_speed * speed) + (w_dwell * dwell) + bias`

The **Trainer** uses Gradient Descent to adjust these weights based on your input samples, minimizing the Mean Squared Error over specified epochs.

---
Built with ❤️ by Antigravity
