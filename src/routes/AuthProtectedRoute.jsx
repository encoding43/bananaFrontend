import React, { useState, useEffect } from 'react';
import { ROUTES_CONST } from './../constants/routeConstant';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../hooks/useAuth';

const AuthProtected = (props) => {
  const { Component } = props;
  const [isLoggedIn, setLoggedIn] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // navigate(ROUTES_CONST.SIGN_IN)
      setLoggedIn(false);
    } else {
      navigate(ROUTES_CONST.DASHBOARD);
      setLoggedIn(true);
    }
  }, [token]);
  return !isLoggedIn && <Component />;
};

export default AuthProtected;
