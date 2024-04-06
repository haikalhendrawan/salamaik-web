import {Routes, Route} from "react-router-dom"

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import RequireAuthLayout from "./layouts/auth/RequireAuthLayout";
import PersistLogin from "./layouts/auth/PersistLogin";

//pages
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import WorksheetPage from "./pages/WorksheetPage";
import ProfilePage from "./pages/ProfilePage";

// admin
import UserRef from "./pages/admin/UserRef";
import WorksheetRefPage from "./pages/admin/WorksheetRefPage";

// ----------------------------------------------------

export default function Router() {
  return (
   <Routes>

    <Route path="/login" element={<LoginPage/>} />

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route path="home" element={<HomePage />} />
        <Route path='worksheet' element={<WorksheetPage />} />
        <Route path='profile' element={<ProfilePage />} />
      </Route>
    {/* </Route> */}

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/admin" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route path="user" element={<UserRef />} />
        <Route path='worksheet' element={<WorksheetRefPage />} />
      </Route>
    {/* </Route> */}

   </Routes>
  );
}