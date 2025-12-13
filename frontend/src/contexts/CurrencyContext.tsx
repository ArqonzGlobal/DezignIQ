import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CurrencyContextType {
  currencyCode: string;
  currencySymbol: string;
  setCurrency: (code: string, symbol: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const setCurrency = (code: string, symbol: string) => {
    setCurrencyCode(code);
    setCurrencySymbol(symbol);
  };

  return (
    <CurrencyContext.Provider value={{ currencyCode, currencySymbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
