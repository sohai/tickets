import React, { createContext } from "react";
import { BackendService } from "../backend";

const backend = new BackendService();

const BackendContext = createContext<BackendService>(backend);

function BackendProvider(props: {
  children: React.ReactNode;
}): React.ReactElement {
  return <BackendContext.Provider value={backend} {...props} />;
}

function useBackend() {
  const context = React.useContext(BackendContext);
  if (context === undefined) {
    throw new Error(`useBackend must be used within a BackendProvider`);
  }
  return context;
}

export { BackendProvider, useBackend };
