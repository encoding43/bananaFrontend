import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth }  from "../../hooks/useAuth.jsx"
import LaborContractorDashboard from './components/LaborContractorDashboard.jsx';
import SupplierDashboard from './components/SupplierDashboard.js';

const Dashboard = () => {
  const {token} = useAuth();
  const user = useSelector((state) => state?.user);

  return (
    <>
      {
        token ? 
          user?.data?.type === 'contractor' ? <LaborContractorDashboard/> : 
          <SupplierDashboard/> 
        : ''
      }
    
    </>
  );
};

export default Dashboard;
