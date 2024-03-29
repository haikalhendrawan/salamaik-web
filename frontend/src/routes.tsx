import {Routes, Route} from "react-router-dom"

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import RequireAuthLayout from "./layouts/auth/RequireAuthLayout";
import PersistLogin from "./layouts/auth/PersistLogin";

//pages
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import WorksheetPage from "./pages/WorksheetPage";
import ProfilePage from "./pages/ProfilePage";

// admin
import UserRef from "./pages/admin/UserRef";
import WorksheetRef from "./pages/admin/WorksheetRef";

// ----------------------------------------------------

export default function Router() {
  return (
   <Routes>

    <Route path="/login" element={<LoginPage/>} />

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route path="home" element={<TestPage />} />
        <Route path='worksheet' element={<WorksheetPage />} />
        <Route path='profile' element={<ProfilePage />} />
      </Route>
    {/* </Route> */}

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/admin" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route path="user" element={<UserRef />} />
        <Route path='worksheet' element={<WorksheetRef />} />
      </Route>
    {/* </Route> */}

   </Routes>
  );
}