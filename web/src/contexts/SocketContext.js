import React, { createContext } from 'react';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={{}}>
      {children}
    </SocketContext.Provider>
  );
}
