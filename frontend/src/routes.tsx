import {Routes, Route, Navigate} from "react-router-dom"

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import RequireAuthLayout from "./layouts/auth/RequireAuthLayout";
import ReverseAuthLayout from "./layouts/auth/ReverseAuthLayout";
import PersistLogin from "./layouts/auth/PersistLogin";

//pages
import HomePage from "./pages/HomePage";
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import RegisterPage from "./pages/auth/RegisterPage";
import WorksheetPage from "./pages/WorksheetPage";
import ProfilePage from "./pages/ProfilePage";
import WorksheetLanding from "./sections/worksheet/WorksheetLanding";
import WorksheetKanwil from "./sections/worksheet/WorksheetKanwil";
import Page403 from "./pages/guard/Page403";
import Page404 from "./pages/guard/Page404";
import MatrixPage from "./pages/MatrixPage";
import MatrixKPPN from "./sections/matrix/MatrixKPPN";
import FollowUpPage from "./pages/FollowUpPage";
import { LoadingProvider } from "./hooks/display/useLoading";

// admin
import UserRefPage from "./pages/admin/UserRefPage";
import WorksheetRefPage from "./pages/admin/WorksheetRefPage";
import RequireAuthHorizontalLayout from "./layouts/horizontal/RequireAuthHorizontalLayout";
import MatrixDetail from "./sections/matrix/MatrixDetail";
import FollowUpKPPN from "./sections/followUp/FollowUpKPPN";
import FollowUpDetail from "./sections/followUp/FollowUpDetail";
import StandardizationPage from "./pages/StandardizationPage";
import NotifInterfacePage from "./pages/admin/NotifInterfacePage";
// ----------------------------------------------------

export default function Router() {
  return (
   <Routes>

    <Route element={<PersistLogin />}> 
      <Route element={<RequireAuthLayout allowedRoles={[0, 1, 2, 3, 4, 99]}/>}> 
        <Route path="/" element={<Navigate to ="/home" />} />
      </Route>
    </Route>

    <Route element={<PersistLogin/>}>
      <Route element={<ReverseAuthLayout/>}>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/resetPassword" element={<ResetPasswordPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
      </Route>
    </Route>

    <Route element={<PersistLogin/>}>
      <Route path="/" element={<RequireAuthLayout allowedRoles={[0, 1, 2, 3, 4, 99]}/> }>
        <Route path="home" element={<HomePage />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='standard' element={<StandardizationPage />} />
        <Route path="worksheet" element={<WorksheetPage />}>
          <Route index element={<WorksheetLanding />} />
          <Route path="kppn" element={<WorksheetKanwil />} />
        </Route>
      </Route>
    </Route>

    {/* <Route element={<PersistLogin/>}>
      <Route path="/worksheet">
        <Route element={<RequireAuthLayout allowedRoles={[0, 1, 2, 3, 4, 99]} />}>
          <Route index element={<WorksheetLanding />} />
        </Route>
        <Route path="kppn" element={<RequireAuthLayout allowedRoles={[0, 1, 2, 3, 4, 99]} />}>
          <Route index element={<WorksheetKPPN />} />
        </Route>
      </Route>
    </Route> */}
    

    <Route element={<PersistLogin/>}>
      <Route path="/matrix" >
        <Route element={<RequireAuthLayout allowedRoles={[0, 1, 2, 3, 4, 99]} />}>
          <Route index element={<MatrixPage />} />
        </Route>
        <Route element={<RequireAuthHorizontalLayout allowedRoles={[0, 1, 2, 3, 4, 99]}/> }>
          <Route path="detail" element={<MatrixDetail />} />
        </Route>
      </Route>
    </Route>

    <Route element={<PersistLogin/>}>
      <Route path="/followUp" >
        <Route element={<RequireAuthLayout allowedRoles={[0, 1, 2, 3, 4, 99]} />}>
          <Route index element={<FollowUpPage />} />
        </Route>
        <Route element={<RequireAuthHorizontalLayout allowedRoles={[0, 1, 2, 3, 4, 99]}/>}>
          <Route path="detail" element={<FollowUpDetail />} />
        </Route>
      </Route>
    </Route>

    <Route element={<PersistLogin/>}>
      <Route path="/reference" element={<RequireAuthLayout allowedRoles={[2, 4, 99]}/> }>
        <Route index element={<Navigate to="user"/>} />
        <Route path="user" element={<UserRefPage />} />
      </Route>
    </Route>

    <Route element={<PersistLogin/>}>
      <Route path="/reference" element={<RequireAuthLayout allowedRoles={[4, 99]}/> }>
        <Route path='worksheet' element={<WorksheetRefPage />} />
      </Route>
    </Route>

    <Route element={<PersistLogin/>}>
      <Route path="/interface" element={<RequireAuthLayout allowedRoles={[4, 99]}/> }>
        <Route index element={<Navigate to="notification"/>} />
        <Route path="notification" element={<NotifInterfacePage />} />
      </Route>
    </Route>

    <Route element={<SimpleLayout />}>
      <Route path="/Page404" element={<Page404 />}/>
      <Route path="/*" element={<Page404 />}/>
    </Route>

   </Routes>
  );
}