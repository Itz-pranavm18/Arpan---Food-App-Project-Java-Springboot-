import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Trash2, Minus, Plus } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPlacing(true);
    try {
      const items = cart.map(item => ({ menuItemId: item.id, quantity: item.quantity }));
      await API.post('/orders', { items });
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Failed to place order", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-container text-center mt-4">
        <div className="card" style={{ padding: '3rem' }}>
          <h2>🎉 Order Placed Successfully!</h2>
          <p className="mt-2">Your food will be on its way soon.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container text-center mt-4">
        <h2>Your Cart is Empty</h2>
        <p className="mt-2">Looks like you haven't added anything yet.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item card">
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="item-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16}/></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16}/></button>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(total + 2.99).toFixed(2)}</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
