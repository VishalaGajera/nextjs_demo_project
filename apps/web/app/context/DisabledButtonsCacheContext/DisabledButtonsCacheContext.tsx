import _noop from "lodash/noop";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { ButtonId } from "./buttonIds";

type DisabledButtonsCacheContextValue = {
  enable: (id: ButtonId) => void;
  disable: (id: ButtonId) => void;
  isDisabled: (id: ButtonId) => boolean;
};

type DisabledButtonsCacheProviderProps = {
  children: ReactNode;
};

type DisabledButtonsCacheReducerState = Record<ButtonId, boolean>;

type DisabledButtonsCacheReducerAction = {
  type: "enable" | "disable";
  id: ButtonId;
};

const DisabledButtonsCacheContext =
  createContext<DisabledButtonsCacheContextValue>({
    enable: _noop,
    disable: _noop,
    isDisabled: () => false,
  });

function disabledButtonsCacheReducer(
  state: DisabledButtonsCacheReducerState,
  action: DisabledButtonsCacheReducerAction
) {
  switch (action.type) {
    case "enable": {
      return { ...state, [action.id]: false };
    }

    case "disable": {
      return { ...state, [action.id]: true };
    }

    default:
      return state;
  }
}

export function DisabledButtonsCacheProvider({
  children,
}: Readonly<DisabledButtonsCacheProviderProps>) {
  const [state, dispatch] = useReducer<
    React.Reducer<
      DisabledButtonsCacheReducerState,
      DisabledButtonsCacheReducerAction
    >
  >(disabledButtonsCacheReducer, { onSubmit: false, onEdit: false });

  const enable = (id: ButtonId) => {
    dispatch({
      type: "enable",
      id,
    });
  };

  const disable = (id: ButtonId) => {
    dispatch({
      type: "disable",
      id,
    });
  };

  const isDisabled = (id: ButtonId) => {
    return state[id] || false;
  };

  const value = useMemo(() => {
    return { enable, disable, isDisabled };
  }, [state]);

  return (
    <DisabledButtonsCacheContext.Provider value={value}>
      {children}
    </DisabledButtonsCacheContext.Provider>
  );
}

export type UseDisabledButtonCacheReturn = {
  [K in keyof DisabledButtonsCacheContextValue]: () => ReturnType<
    DisabledButtonsCacheContextValue[K]
  >;
};

export function useDisabledButtonsCache(
  id: ButtonId
): UseDisabledButtonCacheReturn {
  const {
    enable: _enable,
    disable: _disable,
    isDisabled: _isDisabled,
  } = useContext<DisabledButtonsCacheContextValue>(DisabledButtonsCacheContext);

  return {
    enable: () => _enable(id),
    disable: () => _disable(id),
    isDisabled: () => _isDisabled(id),
  };
}
