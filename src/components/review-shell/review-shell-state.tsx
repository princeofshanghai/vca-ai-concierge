"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type ReviewShellStateValue = Readonly<{
  isSignedIn: boolean;
  setIsSignedIn: Dispatch<SetStateAction<boolean>>;
}>;

const ReviewShellStateContext = createContext<ReviewShellStateValue | null>(
  null,
);

const STORAGE_KEY = "vca-review-shell-is-signed-in";
const STORE_EVENT = "vca-review-shell-state-change";

function readStoredValue(): boolean {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // sessionStorage may be unavailable (private mode, etc.); fall through.
  }
  return true;
}

function writeStoredValue(value: boolean): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // sessionStorage may be unavailable; the in-memory snapshot still updates
    // via the dispatched event below so the UI stays consistent for the session.
  }
  window.dispatchEvent(new Event(STORE_EVENT));
}

function subscribe(onStoreChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener(STORE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(STORE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

// SSR default keeps the server and first client render aligned. After
// hydration, useSyncExternalStore switches to readStoredValue.
function getServerSnapshot(): boolean {
  return true;
}

type ReviewShellStateProviderProps = Readonly<{
  children: ReactNode;
}>;

export function ReviewShellStateProvider({
  children,
}: ReviewShellStateProviderProps) {
  const isSignedIn = useSyncExternalStore(
    subscribe,
    readStoredValue,
    getServerSnapshot,
  );

  const setIsSignedIn = useCallback<Dispatch<SetStateAction<boolean>>>(
    (action) => {
      const next =
        typeof action === "function"
          ? (action as (prev: boolean) => boolean)(isSignedIn)
          : action;
      writeStoredValue(next);
    },
    [isSignedIn],
  );

  const value = useMemo<ReviewShellStateValue>(
    () => ({ isSignedIn, setIsSignedIn }),
    [isSignedIn, setIsSignedIn],
  );

  return (
    <ReviewShellStateContext.Provider value={value}>
      {children}
    </ReviewShellStateContext.Provider>
  );
}

export function useReviewShellState() {
  const value = useContext(ReviewShellStateContext);

  if (!value) {
    throw new Error(
      "useReviewShellState must be used inside ReviewShellStateProvider",
    );
  }

  return value;
}
