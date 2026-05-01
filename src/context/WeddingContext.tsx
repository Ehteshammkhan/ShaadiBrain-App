import React, { createContext, useContext, useState } from "react";

const WeddingContext = createContext<any>(null);

export const WeddingProvider = ({ children }: any) => {
  const [activeWedding, setActiveWedding] = useState<any>(null);

  return (
    <WeddingContext.Provider
      value={{
        activeWedding,
        setActiveWedding,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => useContext(WeddingContext);