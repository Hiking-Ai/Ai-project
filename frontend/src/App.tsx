// src/App.tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Navbar } from "./components/layout/Navbar.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-row min-h-screen">
          <Navbar />
          <div className="flex-1 w-full flex flex-col">
            <AppRoutes />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
