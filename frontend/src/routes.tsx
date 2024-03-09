import TestPage from './pages/TestPage';
import {Routes, Route} from "react-router-dom"

// ----------------------------------------------------

export default function Router() {
  return (
   <Routes>
      <Route path="/home" element={<TestPage />} />
      <Route path="/back" element={<TestPage />} />
   </Routes>
  );
}