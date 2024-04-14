import {Routes, Route, Navigate} from "react-router-dom"

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
import WorksheetLanding from "./sections/worksheet/WorksheetLanding";
import WorksheetKPPN from "./sections/worksheet/WorksheetKPPN";
import Page403 from "./pages/guard/Page403";
import MatrixPage from "./pages/MatrixPage";

// admin
import UserRef from "./pages/admin/UserRef";
import WorksheetRefPage from "./pages/admin/WorksheetRefPage";


// ----------------------------------------------------

export default function Router() {
  return (
   <Routes>

    {/* <Route element={<PersistLogin />}>  */}
      <Route element={<RequireAuthLayout allowedRoles={[1,2]}/>}> 
        <Route path="/" element={<Navigate to ="/home" />} />
      </Route>
    {/* </Route> */}

    <Route path="/login" element={<LoginPage/>} />

    <Route path='/403' element={<Page403/>} />

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route path="home" element={<HomePage />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='matrix' element={<MatrixPage />} />
      </Route>
    {/* </Route> */}

    {/* <Route element={<PersistLogin/>}> */}
    <Route path="/worksheet">
      <Route element={<RequireAuthLayout allowedRoles={[2]} />}>
        <Route index element={<WorksheetLanding />} />
      </Route>
      <Route path="kppn" element={<RequireAuthLayout allowedRoles={[1, 2]} />}>
        <Route index element={<WorksheetKPPN />} />
      </Route>
    </Route>
    {/* </Route> */}

    {/* <Route element={<PersistLogin/>}> */}
      <Route path="/admin" element={<RequireAuthLayout allowedRoles={[1]}/> }>
        <Route index element={<Navigate to="user"/>} />
        <Route path="user" element={<UserRef />} />
        <Route path='worksheet' element={<WorksheetRefPage />} />
      </Route>
    {/* </Route> */}

   </Routes>
  );
}