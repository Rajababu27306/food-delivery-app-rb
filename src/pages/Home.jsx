
import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantDetails from "./RestaurantDetails";

function Home() {
  /* =====================================================
     DATA
  ===================================================== */

  const [restaurants, setRestaurants] = useState([]);

  const [selectedRestaurant, setSelectedRestaurant] =
    useState(null);

  /* =====================================================
     SEARCH / FILTER
  ===================================================== */

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /* =====================================================
     CART
  ===================================================== */

  const [cart, setCart] = useState(() => {
    const savedCart =
      localStorage.getItem("foodieGoCart");

    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        return [];
      }
    }

    return [];
  });

  /* =====================================================
     FAVORITES
  ===================================================== */

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites =
      localStorage.getItem("foodieGoFavorites");

    if (savedFavorites) {
      try {
        return JSON.parse(savedFavorites);
      } catch (error) {
        return [];
      }
    }

    return [];
  });

  /* =====================================================
     ORDERS
  ===================================================== */

  const [orders, setOrders] = useState(() => {
    const savedOrders =
      localStorage.getItem("foodieGoOrders");

    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (error) {
        return [];
      }
    }

    return [];
  });

  /* =====================================================
     CHECKOUT
  ===================================================== */

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    instructions: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  /* =====================================================
     ORDER TRACKING
  ===================================================== */

  const [trackingOrder, setTrackingOrder] =
    useState(null);

  const statusList = [
    "Order Placed",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const statusSteps = {
    "Order Placed": 0,
    Confirmed: 1,
    Preparing: 2,
    "Out for Delivery": 3,
    Delivered: 4,
  };

  /* =====================================================
     LOAD RESTAURANTS
  ===================================================== */

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const module =
          await import("../data/restaurants");

        const data =
          module.restaurants ||
          module.default ||
          [];

        setRestaurants(data);
      } catch (error) {
        console.error(
          "Restaurant loading error:",
          error
        );
      }
    };

    loadRestaurants();
  }, []);

  /* =====================================================
     SAVE CART
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "foodieGoCart",
      JSON.stringify(cart)
    );
  }, [cart]);

  /* =====================================================
     SAVE FAVORITES
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "foodieGoFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* =====================================================
     SAVE ORDERS
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "foodieGoOrders",
      JSON.stringify(orders)
    );
  }, [orders]);

  /* =====================================================
     FILTER RESTAURANTS
  ===================================================== */

  const categories = [
    "All",
    ...new Set(
      restaurants
        .map(
          (restaurant) =>
            restaurant.cuisine
        )
        .filter(Boolean)
    ),
  ];

  const filteredRestaurants =
    restaurants.filter(
      (restaurant) => {
        const matchesSearch =
          restaurant.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          restaurant.cuisine
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          selectedCategory === "All" ||
          restaurant.cuisine ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  /* =====================================================
     FAVORITE
  ===================================================== */

  const toggleFavorite = (
    restaurant
  ) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (item) =>
          item.id === restaurant.id
      );

      if (exists) {
        return prev.filter(
          (item) =>
            item.id !==
            restaurant.id
        );
      }

      return [
        ...prev,
        restaurant,
      ];
    });
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = (
    item,
    restaurant = selectedRestaurant
  ) => {
    setCart((prev) => {
      const existing =
        prev.find(
          (cartItem) =>
            cartItem.name ===
              item.name &&
            cartItem.restaurantName ===
              restaurant?.name
        );

      if (existing) {
        return prev.map(
          (cartItem) =>
            cartItem.name ===
              item.name &&
            cartItem.restaurantName ===
              restaurant?.name
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
                }
              : cartItem
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: 1,
          restaurantName:
            restaurant?.name ||
            "",
          restaurantId:
            restaurant?.id ||
            "",
          image:
            item.image ||
            restaurant?.image ||
            "",
        },
      ];
    });
  };

  /* =====================================================
     REMOVE CART ITEM
  ===================================================== */

  const removeFromCart = (
    item
  ) => {
    setCart((prev) =>
      prev.filter(
        (cartItem) =>
          !(
            cartItem.name ===
              item.name &&
            cartItem.restaurantName ===
              item.restaurantName
          )
      )
    );
  };

  /* =====================================================
     UPDATE QUANTITY
  ===================================================== */

  const updateQuantity = (
    item,
    change
  ) => {
    setCart((prev) =>
      prev
        .map((cartItem) => {
          if (
            cartItem.name ===
              item.name &&
            cartItem.restaurantName ===
              item.restaurantName
          ) {
            return {
              ...cartItem,
              quantity:
                cartItem.quantity +
                change,
            };
          }

          return cartItem;
        })
        .filter(
          (cartItem) =>
            cartItem.quantity > 0
        )
    );
  };

  /* =====================================================
     CART TOTAL
  ===================================================== */

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  /* =====================================================
     CART COUNT
  ===================================================== */

  const cartCount = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0),
    0
  );

  /* =====================================================
     LOAD USER ORDERS FROM MONGODB
  ===================================================== */

  const fetchOrders = async () => {
    const savedUser =
      localStorage.getItem(
        "foodieGoUser"
      );

    if (!savedUser) {
      setOrders([]);
      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      if (!user?.id) {
        return;
      }

      const response =
        await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "Unable to fetch orders:",
          data.message
        );
        return;
      }

      const formattedOrders =
        (data.orders || []).map(
          (order) => {
            const currentStatus =
              order.status ||
              "Order Placed";

            return {
              id:
                order._id
                  ? "FG" +
                    order._id
                      .toString()
                      .slice(-8)
                  : "FG" +
                    Date.now()
                      .toString()
                      .slice(-8),

              backendOrderId:
                order._id || null,

              items:
                order.items || [],

              total:
                Number(
                  order.total || 0
                ),

              status:
                currentStatus,

              statusStep:
                statusSteps[
                  currentStatus
                ] ?? 0,

              date:
                order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString()
                  : new Date().toLocaleString(),

              paymentMethod:
                order.paymentMethod ||
                "Cash on Delivery",

              deliveryAddress:
                order.deliveryAddress ||
                "",

              estimatedTime:
                currentStatus ===
                "Delivered"
                  ? "Delivered"
                  : "30–40 min",

              customer: {
                fullName:
                  user.name || "",

                phone: "",

                address:
                  order.deliveryAddress ||
                  "",

                city: "",

                pincode: "",

                instructions: "",
              },
            };
          }
        );

      setOrders(
        formattedOrders
      );
    } catch (error) {
      console.error(
        "Fetch Orders Error:",
        error
      );
    }
  };

  /* =====================================================
     FETCH ORDERS ON LOAD + LOGIN
  ===================================================== */

  useEffect(() => {
    fetchOrders();

    const handleUserChange = () => {
      fetchOrders();
    };

    window.addEventListener(
      "foodieGoUserChanged",
      handleUserChange
    );

    return () => {
      window.removeEventListener(
        "foodieGoUserChanged",
        handleUserChange
      );
    };
  }, []);

  /* =====================================================
     REFRESH ORDERS EVERY 10 SECONDS
  ===================================================== */

  useEffect(() => {
    const interval =
      setInterval(() => {
        fetchOrders();
      }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const placeOrder = async () => {
    const savedUser =
      localStorage.getItem(
        "foodieGoUser"
      );

    if (!savedUser) {
      alert(
        "Please login before placing an order."
      );
      return;
    }

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      );
      return;
    }

    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {
      alert(
        "Please fill all required delivery details."
      );
      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      const deliveryAddress =
        `${customer.fullName}, ${customer.phone}, ${customer.address}, ${customer.city}, ${customer.pincode}`;

      const orderData = {
        userId: user.id,

        items: cart.map(
          (item) => ({
            name: item.name,
            price: Number(
              item.price || 0
            ),
            quantity: Number(
              item.quantity || 1
            ),
            image:
              item.image || "",
            restaurantName:
              item.restaurantName ||
              "",
          })
        ),

        total: cartTotal,

        paymentMethod,

        deliveryAddress,
      };

      const response =
        await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              orderData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to place order."
        );
        return;
      }

      const backendOrder =
        data.order;

      const newOrder = {
        id:
          backendOrder?._id
            ? "FG" +
              backendOrder._id
                .toString()
                .slice(-8)
            : "FG" +
              Date.now()
                .toString()
                .slice(-8),

        backendOrderId:
          backendOrder?._id ||
          null,

        items:
          backendOrder?.items ||
          cart,

        total:
          Number(
            backendOrder?.total ||
              cartTotal
          ),

        status:
          backendOrder?.status ||
          "Order Placed",

        statusStep: 0,

        date:
          backendOrder?.createdAt
            ? new Date(
                backendOrder.createdAt
              ).toLocaleString()
            : new Date().toLocaleString(),

        paymentMethod:
          backendOrder?.paymentMethod ||
          paymentMethod,

        deliveryAddress,

        estimatedTime:
          "30–40 min",

        customer: {
          ...customer,
        },
      };

      setOrders((prev) => [
        newOrder,
        ...prev,
      ]);

      setCart([]);

      localStorage.removeItem(
        "foodieGoCart"
      );

      setShowCheckout(false);

      setTrackingOrder(
        newOrder
      );

      alert(
        "🎉 Order placed successfully!"
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Place Order Error:",
        error
      );

      alert(
        "Unable to connect to backend. Please make sure backend is running."
      );
    }
  };

  /* =====================================================
     UPDATE ORDER STATUS
  ===================================================== */

  const updateOrderStatus = async (
    order
  ) => {
    if (
      !order?.backendOrderId
    ) {
      return;
    }

    const currentStep =
      statusSteps[
        order.status
      ] ?? 0;

    if (
      currentStep >=
      statusList.length - 1
    ) {
      return;
    }

    const nextStatus =
      statusList[
        currentStep + 1
      ];

    try {
      const response =
        await fetch(
          `http://localhost:5000/api/orders/${order.backendOrderId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status:
                nextStatus,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "Status update failed:",
          data.message
        );
        return;
      }

      const updatedOrder =
        data.order;

      const formattedOrder = {
        ...order,

        status:
          updatedOrder.status,

        statusStep:
          statusSteps[
            updatedOrder.status
          ] ?? 0,

        estimatedTime:
          updatedOrder.status ===
          "Delivered"
            ? "Delivered"
            : "30–40 min",
      };

      setOrders((prev) =>
        prev.map((item) =>
          item.backendOrderId ===
          order.backendOrderId
            ? formattedOrder
            : item
        )
      );

      setTrackingOrder(
        formattedOrder
      );
    } catch (error) {
      console.error(
        "Update Status Error:",
        error
      );
    }
  };

  /* =====================================================
     AUTO TRACKING
  ===================================================== */

  useEffect(() => {
    if (!trackingOrder) {
      return;
    }

    if (
      trackingOrder.status ===
      "Delivered"
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        updateOrderStatus(
          trackingOrder
        );
      }, 5000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [trackingOrder]);

  /* =====================================================
     MANUAL NEXT STATUS
  ===================================================== */

  const simulateNextStatus = async () => {
    if (!trackingOrder) {
      return;
    }

    await updateOrderStatus(
      trackingOrder
    );
  };

  /* =====================================================
     CHECKOUT USER
  ===================================================== */

  const openCheckout = () => {
    const savedUser =
      localStorage.getItem(
        "foodieGoUser"
      );

    if (!savedUser) {
      alert(
        "Please login before checkout."
      );
      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      setCustomer((prev) => ({
        ...prev,
        fullName:
          prev.fullName ||
          user.name ||
          "",
      }));
    } catch (error) {
      console.error(
        "User data error:",
        error
      );
    }

    setShowCheckout(true);
  };

  /* =====================================================
     RESTAURANT DETAILS
  ===================================================== */

  if (selectedRestaurant) {
    return (
      <>
        <RestaurantDetails
          restaurant={
            selectedRestaurant
          }
          onBack={() =>
            setSelectedRestaurant(
              null
            )
          }
          onAddToCart={
            addToCart
          }
        />

        <section
          id="cart"
          className="cart-section"
        >
          <h2>🛒 Your Cart</h2>

          {cart.length === 0 ? (
            <p>
              Your cart is empty.
            </p>
          ) : (
            <div className="cart-container">
              {cart.map(
                (item, index) => (
                  <div
                    className="cart-item"
                    key={
                      `${item.name}-${item.restaurantName}-${index}`
                    }
                  >
                    <div>
                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ₹
                        {item.price}
                      </p>
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item,
                            1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}

              <h3>
                Total: ₹
                {cartTotal}
              </h3>

              <button
                onClick={
                  openCheckout
                }
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </section>
      </>
    );
  }

  /* =====================================================
     MAIN HOME
  ===================================================== */

  return (
    <main>

      {/* HERO */}

      <section className="hero">
        <div className="hero-content">

          <h1>
            Delicious Food,
            <br />
            Delivered Fast 🍔
          </h1>

          <p>
            Order your favourite
            food from the best
            restaurants near you.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search restaurants or food..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <button>
              🔍 Search
            </button>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}

      <section className="category-section">

        <h2>
          Explore Categories
        </h2>

        <div className="category-list">

          {categories.map(
            (category) => (
              <button
                key={category}
                className={
                  selectedCategory ===
                  category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}

        </div>
      </section>

      {/* RESTAURANTS */}

      <section
        id="restaurants"
        className="restaurants-section"
      >

        <div className="section-header">

          <div>
            <h2>
              Popular Restaurants
            </h2>

            <p>
              Discover delicious
              food around you
            </p>
          </div>

          <span>
            {filteredRestaurants.length}{" "}
            restaurants
          </span>

        </div>

        <div className="restaurant-grid">

          {filteredRestaurants.length >
          0 ? (
            filteredRestaurants.map(
              (restaurant) => (
                <RestaurantCard
                  key={
                    restaurant.id ||
                    restaurant._id ||
                    restaurant.name
                  }
                  restaurant={
                    restaurant
                  }
                  onViewMenu={() =>
                    setSelectedRestaurant(
                      restaurant
                    )
                  }
                  onToggleFavorite={
                    toggleFavorite
                  }
                  isFavorite={favorites.some(
                    (item) =>
                      item.id ===
                      restaurant.id
                  )}
                />
              )
            )
          ) : (
            <div className="no-results">
              <h3>
                😔 No restaurants found
              </h3>

              <p>
                Try another search
                or category.
              </p>
            </div>
          )}

        </div>

      </section>

      {/* FAVORITES */}

      <section
        id="favorites"
        className="favorites-section"
      >

        <h2>
          ❤️ Your Favorites
        </h2>

        {favorites.length === 0 ? (
          <p>
            You haven't added any
            restaurant to favorites
            yet.
          </p>
        ) : (
          <div className="restaurant-grid">

            {favorites.map(
              (restaurant) => (
                <RestaurantCard
                  key={
                    restaurant.id ||
                    restaurant.name
                  }
                  restaurant={
                    restaurant
                  }
                  onViewMenu={() =>
                    setSelectedRestaurant(
                      restaurant
                    )
                  }
                  onToggleFavorite={
                    toggleFavorite
                  }
                  isFavorite={true}
                />
              )
            )}

          </div>
        )}

      </section>

      {/* CART */}

      <section
        id="cart"
        className="cart-section"
      >

        <div className="section-header">
          <div>
            <h2>
              🛒 Your Cart
            </h2>

            <p>
              {cartCount} item
              {cartCount !== 1
                ? "s"
                : ""}{" "}
              in your cart
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h3>
              🛒 Your cart is empty
            </h3>

            <p>
              Add some delicious
              food to continue.
            </p>
          </div>
        ) : (
          <div className="cart-container">

            {cart.map(
              (item, index) => (
                <div
                  className="cart-item"
                  key={
                    `${item.name}-${item.restaurantName}-${index}`
                  }
                >

                  <div className="cart-item-info">

                    {item.image && (
                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        className="cart-item-image"
                      />
                    )}

                    <div>
                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.restaurantName}
                      </p>

                      <strong>
                        ₹
                        {item.price}
                      </strong>
                    </div>

                  </div>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item,
                          -1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-cart-btn"
                    onClick={() =>
                      removeFromCart(
                        item
                      )
                    }
                  >
                    Remove
                  </button>

                </div>
              )
            )}

            <div className="cart-summary">

              <h3>
                Total: ₹
                {cartTotal}
              </h3>

              <button
                className="checkout-btn"
                onClick={
                  openCheckout
                }
              >
                Proceed to Checkout →
              </button>

            </div>

          </div>
        )}

      </section>

      {/* ORDERS */}

      <section
        id="orders"
        className="orders-section"
      >

        <div className="section-header">

          <div>
            <h2>
              📦 My Orders
            </h2>

            <p>
              Your previous orders
            </p>
          </div>

          {orders.length > 0 && (
            <button
              onClick={() => {
                setOrders([]);
                localStorage.removeItem(
                  "foodieGoOrders"
                );
              }}
            >
              Clear Local History
            </button>
          )}

        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>
              📦 No orders yet
            </h3>

            <p>
              Your placed orders
              will appear here.
            </p>
          </div>
        ) : (
          <div className="orders-container">

            {orders.map(
              (order) => (
                <div
                  className="order-card"
                  key={
                    order.backendOrderId ||
                    order.id
                  }
                >

                  <div className="order-header">

                    <div>
                      <h3>
                        Order #
                        {order.id}
                      </h3>

                      <p>
                        {order.date}
                      </p>
                    </div>

                    <span className="order-status">
                      {order.status}
                    </span>

                  </div>

                  <div className="order-items">

                    {order.items.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="order-item"
                          key={
                            `${item.name}-${index}`
                          }
                        >

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="order-item-image"
                            />
                          ) : (
                            <div className="order-item-placeholder">
                              🍔
                            </div>
                          )}

                          <div>
                            <strong>
                              {
                                item.name
                              }
                            </strong>

                            <p>
                              ₹
                              {
                                item.price
                              }{" "}
                              ×{" "}
                              {
                                item.quantity
                              }
                            </p>
                          </div>

                        </div>
                      )
                    )}

                  </div>

                  <div className="order-details">

                    <p>
                      <strong>
                        Payment:
                      </strong>{" "}
                      {
                        order.paymentMethod
                      }
                    </p>

                    <p>
                      <strong>
                        Delivery:
                      </strong>{" "}
                      {
                        order.deliveryAddress
                      }
                    </p>

                    <h3>
                      Total: ₹
                      {
                        order.total
                      }
                    </h3>

                  </div>

                  <div className="order-actions">

                    <button
                      onClick={() =>
                        setTrackingOrder(
                          order
                        )
                      }
                    >
                      🚚 Track Order
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </section>

      {/* TRACKING */}

      {trackingOrder && (
        <section
          className="tracking-section"
        >

          <div className="tracking-box">

            <button
              className="tracking-close"
              onClick={() =>
                setTrackingOrder(
                  null
                )
              }
            >
              ✕
            </button>

            <h2>
              🚚 Track Your Order
            </h2>

            <p>
              Order #
              {
                trackingOrder.id
              }
            </p>

            <div className="tracking-progress">

              {statusList.map(
                (
                  status,
                  index
                ) => (
                  <div
                    className={
                      index <=
                      trackingOrder.statusStep
                        ? "tracking-step active"
                        : "tracking-step"
                    }
                    key={status}
                  >

                    <div className="tracking-circle">
                      {index <
                      trackingOrder.statusStep
                        ? "✓"
                        : index ===
                          trackingOrder.statusStep
                        ? "●"
                        : index + 1}
                    </div>

                    <span>
                      {status}
                    </span>

                  </div>
                )
              )}

            </div>

            <div className="tracking-current">

              <h3>
                Current Status:
              </h3>

              <strong>
                {
                  trackingOrder.status
                }
              </strong>

              <p>
                {trackingOrder.status ===
                "Delivered"
                  ? "🎉 Your order has been delivered!"
                  : "Your order is being processed."}
              </p>

            </div>

            {trackingOrder.status !==
              "Delivered" && (
              <button
                className="simulate-status-btn"
                onClick={
                  simulateNextStatus
                }
              >
                Simulate Next Status →
              </button>
            )}

          </div>

        </section>
      )}

      {/* CHECKOUT */}

      {showCheckout && (
        <div className="checkout-overlay">

          <div className="checkout-box">

            <button
              className="checkout-close"
              onClick={() =>
                setShowCheckout(
                  false
                )
              }
            >
              ✕
            </button>

            <h2>
              🛍️ Checkout
            </h2>

            <p>
              Complete your
              delivery details.
            </p>

            <div className="checkout-form">

              <input
                type="text"
                placeholder="Full Name"
                value={
                  customer.fullName
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    fullName:
                      e.target.value,
                  })
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={
                  customer.phone
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    phone:
                      e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Complete Address"
                value={
                  customer.address
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={
                  customer.city
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    city:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Pincode"
                value={
                  customer.pincode
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    pincode:
                      e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Delivery Instructions (Optional)"
                value={
                  customer.instructions
                }
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    instructions:
                      e.target.value,
                  })
                }
              />

              <div className="payment-method">

                <h3>
                  Payment Method
                </h3>

                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  Cash on Delivery
                </label>

                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={
                      paymentMethod ===
                      "UPI"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  UPI
                </label>

              </div>

              <div className="checkout-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{cartTotal}
                </strong>

              </div>

              <button
                className="place-order-btn"
                onClick={
                  placeOrder
                }
              >
                🚀 Place Order
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Home;

