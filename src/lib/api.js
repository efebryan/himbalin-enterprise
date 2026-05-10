import { supabase } from './supabase'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Map Supabase product row to frontend-friendly shape */
function mapProduct(row) {
  return {
    ...row,
    image: row.image_url || row.image,        // DB uses image_url, frontend uses image
    oldPrice: row.old_price ?? row.oldPrice,   // DB uses old_price, frontend uses oldPrice
  }
}

// ── Products ────────────────────────────────────────────────────────────────

/** Fetch all products, optional category filter */
export async function getProducts({ category } = {}) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (category && category !== 'All Products') {
    query = query.eq('category', category)
  }
  const { data, error } = await query
  if (error) throw error
  return (data || []).map(mapProduct)
}

/** Fetch top-rated products for the homepage Best Selling section */
export async function getBestSellingProducts(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('rating', { ascending: false })
    .order('reviews', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data || []).map(mapProduct)
}

/** Fetch a single product by ID */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/** Upload a product image to Supabase Storage */
export async function uploadProductImage(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `public/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return publicUrl
}

/** Create a new product (admin) */
export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Update a product (admin) */
export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Delete a product (admin) */
export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ─── Orders ──────────────────────────────────────────────────────────────────

/** Fetch all orders (admin) */
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Update order status (admin) */
export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Place a new order (frontend checkout - direct insertion) */
export async function placeOrder({ customerName, customerEmail, items, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_name: customerName,
      customer_email: customerEmail,
      items,
      total,
      status: 'Pending',
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Initialize Paystack Checkout via Edge Function */
export async function initializePaystackCheckout(payload) {
  const { data, error } = await supabase.functions.invoke('create-paystack-checkout', {
    body: payload,
  })
  
  if (error) {
    throw new Error(error.message || 'Failed to initialize checkout')
  }
  
  if (data?.error) {
    throw new Error(data.error)
  }
  
  return data
}

// ─── Customers ───────────────────────────────────────────────────────────────

/** Fetch all customers (admin) */
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ─── Newsletter Subscribers ──────────────────────────────────────────────────

/** Subscribe an email to the newsletter */
export async function subscribeEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }])
    .select()
    .single()
  // Ignore duplicate key errors (email already exists)
  if (error && error.code !== '23505') throw error
  return data
}

// ─── Contact Messages ────────────────────────────────────────────────────────

/** Save a contact form submission */
export async function sendContactMessage({ name, email, subject, message }) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, subject, message }])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Fetch all contact messages (admin) */
export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/** Mark a message as read (admin) */
export async function markMessageRead(id) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id)
  if (error) throw error
}

// ── Published Reviews (public) ───────────────────────────────────────────────

/** Fetch published reviews for the public Testimonials section */
export async function getPublishedReviews() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── Site Settings ────────────────────────────────────────────────────────────

/** Fetch site settings (single row) */
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()
  if (error) throw error
  return data
}

/** Update site settings (admin) */
export async function updateSiteSettings(id, updates) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
