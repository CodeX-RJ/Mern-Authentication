import React, { useState, createContext } from 'react';

export const UserEmailContext = createContext();

export const UserEmailProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');

  return (
    <UserEmailContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserEmailContext.Provider>
  );
};
