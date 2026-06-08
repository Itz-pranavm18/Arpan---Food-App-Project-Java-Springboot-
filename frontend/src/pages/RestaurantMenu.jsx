import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, menuResponse] = await Promise.all([
          API.get(`/restaurants/${id}`),
          API.get(`/menu/restaurant/${id}`)
        ]);
        setRestaurant(resResponse.data);
        setMenu(menuResponse.data);
      } catch (error) {
        console.error("Error fetching menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-4">Loading menu...</div>;
  if (!restaurant) return <div className="text-center mt-4">Restaurant not found</div>;

  return (
    <div className="menu-container">
      <div className="restaurant-header card">
        <img 
          src={restaurant.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
          alt={restaurant.name} 
          className="header-img"
        />
        <div className="header-info">
          <h1>{restaurant.name}</h1>
          <p className="header-address">📍 {restaurant.address}</p>
          <p>{restaurant.description}</p>
        </div>
      </div>

      <div className="menu-section">
        <h2>Menu</h2>
        <div className="menu-grid">
          {menu.length === 0 ? (
            <p>No items available right now.</p>
          ) : (
            menu.map((item) => (
              <div key={item.id} className="menu-item card">
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-desc">{item.description}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="item-img" />
                  )}
                  <button 
                    className="btn btn-primary add-btn"
                    onClick={() => addToCart(item)}
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
