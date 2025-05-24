import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useCheckPermission = (permissionTitle, permissionLabel) => {
  const userDetails = useSelector((state) => state?.user);
  console.log('userDetails', userDetails);
  const [hasPermission, setHasPermission] = useState(false);
  // console.log("testshasPermission" , hasPermission);

  useEffect(() => {
    if (!userDetails?.loading) {
      const checkPermission = userDetails?.data?.permissions?.filter(
        (item) => item?.title === permissionTitle,
      );
      // console.log('checkPermission', checkPermission)
      if (checkPermission?.length) {
        const abc = checkPermission?.[0]?.items?.filter(
          (el) => el?.label === permissionLabel,
        );
        if (abc?.length) {
          setHasPermission(true);
          // console.log('hasDeleteUserPermission if inside')
        } else {
          setHasPermission(false);
        }
      } else {
        setHasPermission(false);
        // console.log('hasDeleteUserPermission else outside', userDetails)
      }
    }
  }, [userDetails]);

  console.log('hasPermission', hasPermission);

  return hasPermission;
};
