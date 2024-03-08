import { createContext, useState, useContext } from 'react';

export const JoyrideContext = createContext();

export const JoyrideProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <JoyrideContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </JoyrideContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(JoyrideContext);
  if (!context) {
    throw new Error('useTour must be used within a JoyrideContext');
  }
  return context;
};
