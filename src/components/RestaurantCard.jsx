function RestaurantCard({
  restaurant,
  onViewMenu,
  onToggleFavorite,
  isFavorite,
}) {
  return (
    <div className="restaurant-card">

      {/* Restaurant Image */}
      <div className="restaurant-image-wrapper">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="restaurant-image"
        />

        {/* Favorite Button */}
        <button
          className="favorite-btn"
          onClick={() =>
            onToggleFavorite(restaurant)
          }
          aria-label="Add to favorites"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

      </div>

      <div className="restaurant-info">

        {/* Title + Rating */}
        <div className="restaurant-title">

          <h3>
            {restaurant.name}
          </h3>

          <span className="rating">
            ⭐ {restaurant.rating}
          </span>

        </div>

        {/* Cuisine */}
        <p className="cuisine">
          {restaurant.cuisine}
        </p>

        {/* Details */}
        <div className="restaurant-details">

          <span>
            🕒 {restaurant.deliveryTime}
          </span>

          <span>
            {restaurant.price}
          </span>

        </div>

        {/* View Menu */}
        <button
          className="view-menu-btn"
          onClick={() =>
            onViewMenu(restaurant)
          }
        >
          View Menu →
        </button>

      </div>

    </div>
  );
}

export default RestaurantCard;