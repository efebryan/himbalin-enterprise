import { supabase } from './supabase'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Map Supabase product row to frontend-friendly shape */
function mapProduct(row) {
  return {
    ...row,
    image: row.image_url || row.image,        // DB uses image_url, frontend uses image
    oldPrice: row.old_price ?? row.oldPrice,   // DB uses old_price, frontend uses oldPrice
    priceUnit: row.price_unit ?? row.priceUnit ?? 'per piece',
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

/** Upload a brand asset (logo, favicon, avatar) to Supabase Storage */
export async function uploadBrandAsset(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `public/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('brand-assets')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('brand-assets')
    .getPublicUrl(filePath)

  return publicUrl
}

/** Update an admin profile */
export async function updateAdminProfile(id, updates) {
  const { error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('id', id)
  if (error) throw error
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

  // If status is Shipped or Delivered, send an email to the customer
  if (status === 'Shipped' || status === 'Delivered') {
    if (data && data.customer_email) {
      const isShipped = status === 'Shipped';
      const subject = isShipped ? `Your Order #${data.id.substring(0,8).toUpperCase()} has Shipped!` : `Your Order #${data.id.substring(0,8).toUpperCase()} has been Delivered!`;
      
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2B1A12;">Order Update: ${status}</h2>
          <p>Hello ${data.customer_name || 'Valued Customer'},</p>
          <p>We wanted to let you know that your order <strong>#${data.id.substring(0,8).toUpperCase()}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
          ${isShipped ? '<p>Your items are on the way. You can track your shipment using the tracking number on your invoice.</p>' : '<p>We hope you enjoy your purchase! Thank you for shopping with Himbalin Enterprise.</p>'}
          <br/>
          <p>Best regards,<br/>Himbalin Enterprise</p>
        </div>
      `;

      // We do not await this so it doesn't block the UI update
      supabase.functions.invoke('send-email', {
        body: {
          to: data.customer_email,
          subject,
          html: htmlContent
        }
      }).catch(err => console.error("Failed to trigger email notification:", err));
    }
  }

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
    .maybeSingle()
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

// ─── Notifications ──────────────────────────────────────────────────────────

/** Fetch all notifications (admin) */
export async function getNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

/** Mark a single notification as read */
export async function markNotificationRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
  if (error) throw error
}

/** Mark all unread notifications as read */
export async function markAllNotificationsRead() {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false)
  if (error) throw error
}

/** Delete a single notification */
export async function deleteNotification(id) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
  if (error) throw error
}

/** Delete all notifications */
export async function deleteAllNotifications() {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all rows
  if (error) throw error
}

// ── Product Categories ────────────────────────────────────────────────────────

/** Fetch all product categories sorted alphabetically */
export async function getCategories() {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data || []
}

/** Insert a new product category */
export async function addCategory(name) {
  const { data, error } = await supabase
    .from('product_categories')
    .insert([{ name }])
    .select()
    .single()
  if (error) throw error
  return data
}

/** Update an existing category name and sync product references */
export async function updateCategory(id, oldName, newName) {
  // 1. Update the name in category list
  const { data, error } = await supabase
    .from('product_categories')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  // 2. Cascade changes to products category column
  const { error: prodError } = await supabase
    .from('products')
    .update({ category: newName })
    .eq('category', oldName)
  if (prodError) {
    console.error("Failed to rename category references on products:", prodError)
  }

  return data
}

/** Delete a category and map referencing products to 'Other' */
export async function deleteCategory(id, name) {
  // 1. Delete from categories list
  const { error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', id)
  if (error) throw error

  // 2. Move products referencing deleted category to 'Other'
  const { error: prodError } = await supabase
    .from('products')
    .update({ category: 'Other' })
    .eq('category', name)
  if (prodError) {
    console.error("Failed to reset category references on products:", prodError)
  }
}


