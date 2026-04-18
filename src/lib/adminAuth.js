/**
 * adminAuth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Low-level admin auth helpers. Prefer using AdminAuthContext in components.
 * These helpers are for server-side or utility usage.
 */

import { supabase } from './supabase'

// ── Sign in ──────────────────────────────────────────────────────────────────
/**
 * Authenticates a user via Supabase Auth and then verifies they are in
 * the admin_users table. Throws descriptive errors on all failure paths.
 */
export async function adminSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    // Normalise error messages to avoid leaking account existence info
    if (error.status === 400 || error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password.')
    }
    if (error.status === 429 || error.message.includes('rate limit')) {
      throw new Error('Too many requests. Please wait and try again.')
    }
    throw new Error('Authentication failed. Please try again.')
  }

  // Verify admin role
  const { data: adminRecord, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, full_name, role, avatar_url, last_sign_in')
    .eq('id', data.user.id)
    .single()

  if (adminError || !adminRecord) {
    await supabase.auth.signOut()
    throw new Error('Access denied. This account does not have admin privileges.')
  }

  // Update last_sign_in stamp
  await supabase.rpc('update_admin_last_sign_in', { admin_id: data.user.id }).catch(() => {})

  return { user: data.user, admin: adminRecord, session: data.session }
}

// ── Sign out ─────────────────────────────────────────────────────────────────
export async function adminSignOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ── Get session ───────────────────────────────────────────────────────────────
/**
 * Returns the current session and admin record, or null if unauthenticated.
 * Always re-validates against admin_users on each call.
 */
export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('id, email, full_name, role, avatar_url, last_sign_in')
    .eq('id', session.user.id)
    .single()

  if (error || !admin) return null

  return { session, admin }
}

// ── Auth state listener ───────────────────────────────────────────────────────
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

// ── Admin check ───────────────────────────────────────────────────────────────
/** Returns true if signed-in user is an admin. */
export async function checkIsAdmin() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  return !!data
}

// ── Admin user management (super_admin only) ──────────────────────────────────
export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addAdminUser({ id, email, fullName, role = 'admin' }) {
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ id, email, full_name: fullName, role }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeAdminUser(id) {
  const { error } = await supabase.from('admin_users').delete().eq('id', id)
  if (error) throw error
}
