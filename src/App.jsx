import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import { EntryScreen } from './pages/student/EntryScreen';
import { MessView } from './pages/student/MessView';
import { CanteenView } from './pages/student/CanteenView';
import { VendorLogin } from './pages/vendor/VendorLogin';
import { VendorDashboard } from './pages/vendor/VendorDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryScreen />} />
        <Route path="/mess" element={<MessView />} />
        <Route path="/canteen" element={<CanteenView />} />
        <Route path="/vendor" element={<VendorLogin />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
