import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { isAuthEnabled, supabase } from "../../lib/supabaseClient";
import store from "../../store/store";
import { apiSlice } from "../../api/apiSlice";
import { AuthContext } from "./useAuth";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(isAuthEnabled);
  // Supabase re-fires SIGNED_IN on tab focus, not just on an actual login —
  // track the last user id so cache is only cleared when the identity really
  // changes.
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthEnabled || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      lastUserIdRef.current = data.session?.user?.id ?? null;
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setIsLoading(false);

      const newUserId = newSession?.user?.id ?? null;
      const isNewSignIn =
        event === "SIGNED_IN" && newUserId !== lastUserIdRef.current;
      lastUserIdRef.current = newUserId;

      if (event === "SIGNED_OUT" || isNewSignIn) {
        store.dispatch(apiSlice.util.resetApiState());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
