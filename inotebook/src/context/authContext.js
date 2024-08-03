import React, { createContext, useState, useContext,useEffect } from 'react';
import Cookies  from 'js-cookie';

const _authContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [UserType, SetUserType] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for auth cookie on component mount
        if (Cookies.get('token')) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userDetail) => {

        setIsAuthenticated(true);
        SetUserType(userDetail?.UserType)
        setUser(userDetail);
    };

    const logout = () => {
        Cookies.remove('token');
        setIsAuthenticated(false);
        SetUserType('')
        setUser(null);
    };

  return (
    <_authContext.Provider value={{ isAuthenticated,user,login,logout,UserType }}>
      {children}
    </_authContext.Provider>
  );
};


export default _authContext;