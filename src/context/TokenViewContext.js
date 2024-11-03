import React, { createContext, useContext, useEffect, useState } from "react";

export const TokenViewContext = createContext();

export const TokenViewProvider = ({ children }) => {
  const [isTokenView, setIsTokenView] = useState(() => {
    return JSON.parse(localStorage.getItem("isTokenView")) || false;
  });

  useEffect(() => {
    localStorage.setItem("isTokenView", JSON.stringify(isTokenView));
  }, [isTokenView]);

  return (
    <TokenViewContext.Provider value={{ isTokenView, setIsTokenView }}>
      {children}
    </TokenViewContext.Provider>
  );
};

export const useTokenView = () => useContext(TokenViewContext);
