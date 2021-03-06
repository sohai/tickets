import React, { createContext, useEffect, useReducer, useState } from "react";

const BackendContext = createContext<any>(undefined);

function BackendProvider(props: {
  children: React.ReactNode;
  value: any;
}): React.ReactElement {
  return <BackendContext.Provider {...props} />;
}

type State<T> = {
  status: string;
  error: string | null;
  data: T;
};

function useBackend<T, F = null>({
  fetchFn,
  initialData,
  pause = false,
}: {
  fetchFn: (backend: any, args?: F) => Promise<T>;
  initialData: T;
  pause?: boolean;
}): [State<T>, Function] {
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
  const [refechCount, setRefetchCount] = useState(0);
  const [fetcchArgs, setFetchArgs] = useState<F>();

  const refetch = (args: F) => {
    setRefetchCount(refechCount + 1);
    setFetchArgs(args);
  };

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      dispatch({ type: "fetching" });
      try {
        const response = await fetchFn(backend, fetcchArgs);
        if (cancelRequest) return;
        dispatch({ type: "fetched", payload: response });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: "error", payload: error.message });
      }
    };

    if (!pause || refechCount > 0) {
      fetchData();
    }

    return function cleanup() {
      cancelRequest = true;
    };
  }, [fetchFn, backend, fetcchArgs, pause, refechCount]);

  return [state, refetch];
}

export { BackendProvider, useBackend };
