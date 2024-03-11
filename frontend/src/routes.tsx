import {Routes, Route} from "react-router-dom"

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import RequireAuthLayout from "./layouts/auth/RequireAuthLayout";
import PersistLogin from "./layouts/auth/PersistLogin";

//pages
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';

// ----------------------------------------------------

export default function Router() {
  return (
   <Routes>

    <Route path="/login" element={<LoginPage/>} />

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route path="home" element={<TestPage/>} />
      </Route>
    {/* </Route> */}

   </Routes>
  );
}