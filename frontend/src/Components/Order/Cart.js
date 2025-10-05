import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Cart.css";

// ✅ Import local images from assets folder
import greenTea from "../../assets/images/greentea.jpg";
import blackTea from "../../assets/images/blacktea.jpg";
import oolongTea from "../../assets/images/oolongtea.jpg";
import sencha from "../../assets/images/senchatea.jpg";
import matcha from "../../assets/images/matchatea.jpg";
import dragonWell from "../../assets/images/dragonwelltea.jpg";

// ✅ Product list with local image imports
const products = [
  { id: 1, name: "Green Tea", price: 10, image: greenTea },
  { id: 2, name: "Black Tea", price: 12, image: blackTea },
  { id: 3, name: "Oolong Tea", price: 15, image: oolongTea },
  { id: 4, name: "Sencha", price: 14, image: sencha },
  { id: 5, name: "Matcha", price: 20, image: matcha },
  { id: 6, name: "Dragon Well", price: 18, image: dragonWell },
];

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }
    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      saveCart(cart.filter((item) => item.id !== id));
    } else {
      saveCart(cart.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      ));
    }
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const goToPayment = () => {
    localStorage.setItem("totals", JSON.stringify({ subtotal, shipping, total }));
    navigate("/payment");
  };

  return (
    <div className="cart-app">
      <Header cartCount={cart.reduce((t, i) => t + i.qty, 0)} />

      <div className="content-container">
        <section className="products-section">
          <h2>Our Teas</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <button onClick={() => addToCart(product)} className="add-to-cart">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={`cart-slider ${isCartOpen ? "open" : ""}`}>
        <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>${item.price} × {item.qty}</p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value || 0))}
                      min="1"
                    />
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-item">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={goToPayment}>
                Proceed to Checkout
              </button>
              <button onClick={() => saveCart([])} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
