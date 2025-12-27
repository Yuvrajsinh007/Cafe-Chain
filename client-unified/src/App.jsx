import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import User App
import UserApp from './user/App';

// Import Cafe App  
import CafeApp from './cafe/App';

import AdminApp from './admin/App';

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        {/* User frontend routes - accessible at /user/* */}
        <Route path="/user/*" element={<UserApp />} />
        
        {/* Cafe frontend routes - accessible at /cafe/* */}
        <Route path="/cafe/*" element={<CafeApp />} />

        <Route path="/pithad/*" element={<AdminApp />} />

        
        {/* Default redirect to user frontend */}
        <Route path="/" element={<Navigate to="/user" replace />} />
        
        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
