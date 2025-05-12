
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import presenceStatsReducer from '../Slices/presenceStatsSlice';
import userReducer from '../Slices/userSlice';
import departmentReducer from '../Slices/departementSlice';
import absenceRequestReducer from '../Slices/absenceRequestSlice';
import pointageReducer from '../Slices/pointageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    presence: presenceStatsReducer,
    users: userReducer,
    departments: departmentReducer,
    absenceRequests: absenceRequestReducer,
    pointages: pointageReducer,
  }
});
