import React, { useState, createContext } from 'react';

export const UserEmailContext = createContext();

export const UserEmailProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userMe, setUserMe] = useState(null);

  return (
    <UserEmailContext.Provider value={{ userEmail, setUserEmail, loggedIn, setLoggedIn }}>
      {children}
    </UserEmailContext.Provider>
  );
};
