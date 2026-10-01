import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";

function Navbar() {
  const [showAuth, setShowAuth] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("foodieGoUser");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error(
          "User loading error:",
          error
        );
      }
    }

    return null;
  });

  const [cartCount, setCartCount] = useState(() => {
    const savedCart =
      localStorage.getItem("foodieGoCart");

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);

        return cart.reduce(
          (sum, item) =>
            sum + Number(item.quantity || 0),
          0
        );
      } catch (error) {
        console.error(
          "Cart loading error:",
          error
        );
      }
    }

    return 0;
  });

  /* =========================
     UPDATE CART COUNT
  ========================== */

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart =
        localStorage.getItem("foodieGoCart");

      if (savedCart) {
        try {
          const cart =
            JSON.parse(savedCart);

          const count =
            cart.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.quantity || 0
                ),
              0
            );

          setCartCount(count);
        } catch (error) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    const interval =
      setInterval(
        updateCartCount,
        500
      );

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* =========================
     LOGIN
  ========================== */

  const handleLogin = (
    loggedInUser
  ) => {
    setUser(loggedInUser);

    window.dispatchEvent(
      new Event(
        "foodieGoUserChanged"
      )
    );
  };

  /* =========================
     LOGOUT
  ========================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "foodieGoUser"
    );

    setUser(null);

    window.dispatchEvent(
      new Event(
        "foodieGoUserChanged"
      )
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     NAVIGATION
  ========================== */

  const scrollToSection = (
    sectionId
  ) => {
    const section =
      document.getElementById(
        sectionId
      );

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToRestaurants = () => {
    scrollToSection(
      "restaurants"
    );
  };

  const goToFavorites = () => {
    scrollToSection(
      "favorites"
    );
  };

  const goToOrders = () => {
    scrollToSection("orders");
  };

  const goToCart = () => {
    scrollToSection("cart");
  };

  const goToProfile = () => {
    scrollToSection(
      "profile"
    );
  };

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}

        <div
          className="logo"
          onClick={goToHome}
        >
          🍔 FoodieGo
        </div>

        {/* NAV LINKS */}

        <div className="nav-links">

          <span
            onClick={goToHome}
          >
            Home
          </span>

          <span
            onClick={
              goToRestaurants
            }
          >
            Restaurants
          </span>

          <span
            onClick={
              goToFavorites
            }
          >
            Favorites
          </span>

          <span
            onClick={goToOrders}
          >
            Orders
          </span>

          <span
            onClick={goToCart}
            className="navbar-cart"
          >
            Cart 🛒

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </span>

          {/* PROFILE */}

          {user && (
            <button
              className="profile-nav-btn"
              onClick={
                goToProfile
              }
            >
              👤 Profile
            </button>
          )}

          {/* USER / LOGIN */}

          {user ? (
            <div className="user-menu">

              <span className="user-name">
                {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() =>
                setShowAuth(true)
              }
            >
              Login
            </button>
          )}

        </div>
      </nav>

      {/* AUTH MODAL */}

      {showAuth && (
        <AuthModal
          onClose={() =>
            setShowAuth(false)
          }
          onLogin={
            handleLogin
          }
        />
      )}
    </>
  );
}

export default Navbar;