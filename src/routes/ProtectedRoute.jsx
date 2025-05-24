import React, { useState ,useEffect } from 'react'
import { ROUTES_CONST } from './../constants/routeConstant'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './../hooks/useAuth'


const Protected = (props) => {
  const {Component} = props
  const [isLoggedIn, setLoggedIn] = useState(false)
  const { token } = useAuth();
  const navigate = useNavigate()

  useEffect(()=> {
    if(!token) {
      navigate(ROUTES_CONST.SIGN_IN)
    }else {
      setLoggedIn(true)
    }

  },[token])
  return (
    isLoggedIn && <Component/>
  )
}

export default Protected