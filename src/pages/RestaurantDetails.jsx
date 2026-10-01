import { useState } from "react";
import restaurants from "../data/restaurants";

function RestaurantDetails() {
  const [restaurant] = useState(restaurants[0]);

  return (
    <main className="restaurant-details-page">

      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="details-image"
      />

      <div className="details-content">

        <h1>{restaurant.name}</h1>

        <p className="details-cuisine">
          {restaurant.cuisine}
        </p>

        <div className="details-info">
          <span>⭐ {restaurant.rating}</span>
          <span>🕒 {restaurant.deliveryTime}</span>
          <span>{restaurant.price}</span>
        </div>

        <p className="details-description">
          Enjoy delicious food prepared with fresh ingredients
          and delivered quickly to your doorstep.
        </p>

        <button className="order-btn">
          Order Now 🛒
        </button>

      </div>

    </main>
  );
}

export default RestaurantDetails;