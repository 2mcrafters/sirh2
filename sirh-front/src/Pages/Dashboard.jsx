import React from 'react';
import { useSelector } from 'react-redux';

import PresenceStatsChart from '../Components/StatsChart';

const Dashboard = () => {
  const { user, roles } = useSelector((state) => state.auth);

  return (
    <div>
      <h2>Bienvenue, {user?.name}</h2>
      <h4>Rôle : {roles.join(', ')}</h4>
      <div className="p-4">
      <PresenceStatsChart periode="semaine" date="2025-04-29" />
      
    </div>
    </div>
  );
};

export default Dashboard;
