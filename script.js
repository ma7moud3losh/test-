  import { supabase } from "./supabase.js";

  const productsContainer = document.getElementById("products");

  // ================================
  //  تحميل المنتجات من Supabase
  // ================================
  async function loadProducts() {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ خطأ أثناء تحميل المنتجات:", error);
      productsContainer.innerHTML = "<p>حدث خطأ أثناء تحميل المنتجات</p>";
      return;
    }

    if (!products || products.length === 0) {
      productsContainer.innerHTML = "<p>لا توجد منتجات بعد</p>";
      return;
    }

    // عرض المنتجات
    productsContainer.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}" 
     alt="${product.title}">

        <h3>${product.title}</h3>
        <p>${product.description || ""}</p>
        <span>${product.price} جنيه</span>
        <button onclick="addToCart('${product.title}', '${product.price}', '${product.image_url}')">
          🛒 أضف إلى السلة
        </button>
      `;

      productsContainer.appendChild(card);
    });
  }

  loadProducts();

  // ================================
  //  دالة إضافة منتج للسلة
  // ================================
  window.addToCart = function (name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name,
        price: Number(price),
        image,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("✅ تم إضافة المنتج إلى السلة!");
  };

