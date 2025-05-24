import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../redux/store';
import { Toaster } from 'sonner';
import AuthContextProvider from '../context/authContext';

const Providers = ({children}) => {
  return (
    <>
    <BrowserRouter basename='/'>
      <Provider store={store}>
        <Toaster expand={false} position="top-right" richColors closeButton icon />
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
      </Provider>
    </BrowserRouter>
    </>
  )
}

export default Providers