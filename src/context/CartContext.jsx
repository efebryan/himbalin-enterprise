import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage so it persists across page refreshes
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("himbalin_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("himbalin_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Returns true if the product is already in the cart
  const isInCart = (productId) => cartItems.some((item) => item.id === productId);

  // Add a product — silently ignores if already present
  const addToCart = (product) => {
    if (isInCart(product.id)) return false; // already in cart
    setCartItems((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        priceUnit: product.priceUnit,
        quantity: 1,
        status: "In Stock",
      },
    ]);
    return true; // successfully added
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
