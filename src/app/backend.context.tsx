import React, { createContext, useEffect, useReducer } from "react";
import { BackendService } from "../backend";

const BackendContext = createContext<Partial<BackendService> | undefined>(
  undefined
);

function BackendProvider(props: {
  children: React.ReactNode;
  value: Partial<BackendService>;
}): React.ReactElement {
  return <BackendContext.Provider {...props} />;
}

type State<T> = {
  status: string;
  error: string | null;
  data: T;
};

function useBackend<T>({
  fetchFn,
  initialData,
}: {
  fetchFn: (backend: Partial<BackendService>) => Promise<T>;
  initialData: T;
}) {
  const backend = React.useContext(BackendContext);
  if (backend === undefined) {
    throw new Error(`useBackend must be used within a BackendProvider`);
  }

  type Action =
    | { type: "fetching" }
    | { type: "fetched"; payload: T }
    | { type: "error"; payload: string };

  const initialState = {
    status: "idle",
    error: null,
    data: initialData,
  };

  function reducer(state: State<T>, action: Action) {
    switch (action.type) {
      case "fetching":
        return { ...initialState, status: "fetching" };
      case "fetched":
        return { ...initialState, status: "fetched", data: action.payload };
      case "error":
        return { ...initialState, status: "error", error: action.payload };
      default: {
        throw new Error(`Unhandled action type`);
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      dispatch({ type: "fetching" });
      try {
        const response = await fetchFn(backend);
        if (cancelRequest) return;
        dispatch({ type: "fetched", payload: response });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: "error", payload: error.message });
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [fetchFn, backend]);

  return state;
}

export { BackendProvider, useBackend };
