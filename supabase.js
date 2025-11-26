// supabase.js
// ======================================================================
//    Supabase Client — Aya Elsayed Store
// ======================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ================================================================
// ️⚠️ ضع بيانات مشروعك هنا
// ================================================================
export const SUPABASE_URL = "https://qccpddjnozehorhleegz.supabase.co";
export const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjY3BkZGpub3plaG9yaGxlZWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTc0NzEsImV4cCI6MjA3OTE5MzQ3MX0.WzG0u9c6wY9eTTh0olIzrPSSPoHhuQhmLTS7zPxXBGA";

// ================================================================
// إنشاء الاتصال
// ================================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ======================================================================
//  Storage Upload — رفع صورة المنتج داخل public/products/
// ======================================================================

export async function uploadImage(file) {
  const fileName = `products/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("public")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.log("❌ خطأ في رفع الصورة:", error.message);
    return null;
  }

  // الحصول على رابط الصورة
  const { data: url } = supabase.storage
    .from("public")
    .getPublicUrl(fileName);

  return url.publicUrl;
}

// ======================================================================
//  Insert Product — إضافة منتج جديد
// ======================================================================
export async function addProduct(title, description, price, image_url, stock = 0) {
  const { data, error } = await supabase.from("products").insert([
    {
      title,
      description,
      price,
      image_url,
      stock,
    },
  ]);

  if (error) {
    console.error("❌ خطأ أثناء إضافة المنتج:", error);
    return null;
  }

  return data;
}

// ======================================================================
//  Get All Products — جلب جميع المنتجات
// ======================================================================
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ خطأ أثناء جلب المنتجات:", error);
    return [];
  }

  return data;
}

// ======================================================================
// Delete Product — حذف منتج
// ======================================================================
export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("❌ خطأ أثناء حذف المنتج:", error);
    return false;
  }

  return true;
}

// ======================================================================
// Update Product — تعديل منتج
// ======================================================================
export async function updateProduct(id, fields) {
  const { error } = await supabase.from("products").update(fields).eq("id", id);

  if (error) {
    console.error("❌ خطأ أثناء تعديل المنتج:", error);
    return false;
  }

  return true;
}

// ======================================================================
// Fetch Orders — جلب الطلبات
// ======================================================================
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ خطأ أثناء جلب الطلبات:", error);
    return [];
  }

  return data;
}

// ======================================================================
// Update Order Status — تغيير حالة الطلب
// ======================================================================
export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("❌ خطأ تغيير حالة الطلب:", error);
    return false;
  }

  return true;
}
