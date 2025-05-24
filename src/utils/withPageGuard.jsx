import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES_CONST } from '../constants/routeConstant';

export const withPageGuard = (WrappedComponent, permissionTitle, permissionLabel) => {
  return () => {
    const userDetails = useSelector(state=> state?.user);
    
    const [hasPermission, setHasPermission] = useState(false)
    const navigate = useNavigate()
  
    useEffect(()=> {
      if(!userDetails?.loading) {
        const checkPermission = userDetails?.data?.permissions?.filter(item=> item?.title === permissionTitle)
        console.log('checkPermission', checkPermission)
        if(checkPermission?.length) {
          const abc = checkPermission?.[0]?.items?.filter(el => el?.label === permissionLabel) 
          if(abc?.length) {
            setHasPermission(true)
          } else {
            setHasPermission(false)
            navigate(ROUTES_CONST.DASHBOARD)
          console.log('else inside')
          }
        } else {
          setHasPermission(false)
          navigate(ROUTES_CONST.DASHBOARD)
          console.log('else outside', userDetails)
        }
      }
    }, [userDetails])


    return hasPermission && <WrappedComponent/>;
  };
};