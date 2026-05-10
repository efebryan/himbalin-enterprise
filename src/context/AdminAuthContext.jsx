import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// ─── Context ───────────────────────────────────────────────────────────────────
const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminAuthProvider({ children }) {
  const [admin, setAdmin]       = useState(null);   // admin_users record
  const [session, setSession]   = useState(null);   // supabase session
  const [loading, setLoading]   = useState(true);   // initial hydration

  // ── Verify the current session user is in admin_users ─────────────────────
  const hydrateAdmin = useCallback(async (currentSession) => {
    if (!currentSession?.user) {
      setAdmin(null);
      setSession(null);
      return;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, avatar_url, last_sign_in")
      .eq("id", currentSession.user.id)
      .single();

    if (error || !data) {
      // Authenticated in Supabase Auth but not an admin — sign out
      await supabase.auth.signOut();
      setAdmin(null);
      setSession(null);
      return;
    }

    setSession(currentSession);
    setAdmin(data);
  }, []);

  // ── Bootstrap: restore session on mount ───────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      hydrateAdmin(s).finally(() => setLoading(false));
    });

    // Subscribe to token refresh / sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        hydrateAdmin(newSession);
      }
    );

    return () => subscription.unsubscribe();
  }, [hydrateAdmin]);

  // ── Sign in ────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: adminRecord, error: adminErr } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, avatar_url, last_sign_in")
      .eq("id", data.user.id)
      .single();

    if (adminErr || !adminRecord) {
      await supabase.auth.signOut();
      throw new Error("Access denied. This account does not have admin privileges.");
    }

    // Update last_sign_in
    await supabase.rpc("update_admin_last_sign_in", { admin_id: data.user.id });

    setSession(data.session);
    setAdmin(adminRecord);
    return adminRecord;
  }, []);

  // ── Sign out ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setSession(null);
  }, []);

  const updateLocalAdmin = useCallback((updates) => {
    setAdmin((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = {
    admin,
    session,
    loading,
    isAuthenticated: !!admin && !!session,
    signIn,
    signOut,
    updateLocalAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
