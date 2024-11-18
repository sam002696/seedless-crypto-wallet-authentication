import React, { createContext, useContext, useState } from "react";

export const AssetListContext = createContext();

export const AssetListProvider = ({ children }) => {
  const [showAssetList, setShowAssetList] = useState(false);

  return (
    <AssetListContext.Provider value={{ showAssetList, setShowAssetList }}>
      {children}
    </AssetListContext.Provider>
  );
};

export const useAssetList = () => useContext(AssetListContext);
