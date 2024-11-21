import React, { createContext, useContext, useEffect, useState } from "react";

export const TokenViewContext = createContext();

export const TokenViewProvider = ({ children }) => {
  const [isTokenView, setIsTokenView] = useState(() => {
    return JSON.parse(localStorage.getItem("isTokenView")) || false;
  });

  const [selectedToken, setSelectedToken] = useState(null); // New state for selected token

  useEffect(() => {
    localStorage.setItem("isTokenView", JSON.stringify(isTokenView));
  }, [isTokenView]);

  return (
    <TokenViewContext.Provider
      value={{ isTokenView, setIsTokenView, selectedToken, setSelectedToken }}
    >
      {children}
    </TokenViewContext.Provider>
  );
};

export const useTokenView = () => useContext(TokenViewContext);
