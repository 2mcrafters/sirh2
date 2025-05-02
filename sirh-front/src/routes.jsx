import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterLayout from './masterLayout/MasterLayout';
import Dashboard from './Pages/Dashboard';
import BulkAddDepartmentPage from './Pages/BulkAddDepartmentPage';
import DepartmentsListPage from './Pages/DepartmentsListPage';
import EditDepartmentPage from './Pages/EditDepartmentPage';
import UsersListPage from './Pages/UsersListPage';
import UserFormPage from './Pages/UserFormPage';
import AbsenceRequestsListPage from './Pages/AbsenceRequestsListPage';
import AddAbsenceRequestPage from './Pages/AddAbsenceRequestPage';
import EditAbsenceRequestPage from './Pages/EditAbsenceRequestPage';
import PointagesListPage from './Pages/PointagesListPage';
import AddPointagePage from './Pages/AddPointagePage';
import EditPointagePage from './Pages/EditPointagePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MasterLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="departments" element={<DepartmentsListPage />} />
        <Route path="departments/add" element={<BulkAddDepartmentPage />} />
        <Route path="departments/:id/edit" element={<EditDepartmentPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="users/add" element={<UserFormPage />} />
        <Route path="users/:id/edit" element={<UserFormPage />} />
        <Route path="absences" element={<AbsenceRequestsListPage />} />
        <Route path="absences/add" element={<AddAbsenceRequestPage />} />
        <Route path="absences/:id/edit" element={<EditAbsenceRequestPage />} />
        <Route path="pointages" element={<PointagesListPage />} />
        <Route path="pointages/add" element={<AddPointagePage />} />
        <Route path="pointages/:id/edit" element={<EditPointagePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;