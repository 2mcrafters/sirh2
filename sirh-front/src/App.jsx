import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import ViewProfileLayer from './Pages/ViewProfileLayer'
import { AuthProvider } from './context/AuthContext'
import PresenceDashboard from './Components/Statistique/PresenceDashboard'
import BulkAddDepartmentPage from './Pages/BulkAddDepartmentPage'
import DepartmentsListPage from './Pages/DepartmentsListPage'
import EditDepartmentPage from './Pages/EditDepartmentPage'
import UsersListPage from './Pages/UsersListPage'
import UserFormPage from './Pages/UserFormPage'
import AbsenceRequestsListPage from './Pages/AbsenceRequestsListPage'
import AddAbsenceRequestPage from './Pages/AddAbsenceRequestPage'
import EditAbsenceRequestPage from './Pages/EditAbsenceRequestPage'
import PointagesListPage from './Pages/PointagesListPage'
import AddPointagePage from './Pages/AddPointagePage'
import EditPointagePage from './Pages/EditPointagePage'
import "./degrade.css"


//fetch slices
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './Redux/Slices/userSlice';
import { fetchDepartments } from './Redux/Slices/departementSlice';
import { fetchAbsenceRequests } from './Redux/Slices/absenceRequestSlice';
import { fetchPointages } from './Redux/Slices/pointageSlice';
import { fetchPresenceStats } from './Redux/Slices/presenceStatsSlice';


function App() {

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.isSuccess && auth.token) {
      dispatch(fetchUsers());
      dispatch(fetchDepartments());
      dispatch(fetchAbsenceRequests());
      dispatch(fetchPointages());
      // dispatch(fetchPresenceStats());
      
    }
  }, [auth.isSuccess, auth.token, dispatch]);



  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with MasterLayout */}
        <Route element={<MasterLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view-profile" element={<ViewProfileLayer />} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/statistiques' element={<PresenceDashboard/>} />

          <Route path="users" element={<UsersListPage />} />
        <Route path="users/add" element={<UserFormPage />} />
        <Route path="users/:id/edit" element={<UserFormPage />} />
       
          
          {/* Department routes */}
          <Route path="/departments" element={<DepartmentsListPage />} />
          <Route path="/departments/add" element={<BulkAddDepartmentPage />} />
          <Route path="/departments/:id/edit" element={<EditDepartmentPage />} />
          
     
          
          {/* Absence request routes */}
          <Route path="/absences" element={<AbsenceRequestsListPage />} />
          <Route path="/absences/add" element={<AddAbsenceRequestPage />} />
          <Route path="/absences/:id/edit" element={<EditAbsenceRequestPage />} />
          
          {/* Pointage routes */}
          <Route path="/pointages" element={<PointagesListPage />} />
          <Route path="/pointages/add" element={<AddPointagePage />} />
          <Route path="/pointages/:id/edit" element={<EditPointagePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App