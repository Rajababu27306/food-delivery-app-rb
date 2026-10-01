import { useState } from "react";

function Profile() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("foodieGoUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(
    user?.name || ""
  );

  if (!user) {
    return (
      <section
        id="profile"
        className="profile-page"
      >
        <div className="profile-box">

          <div className="profile-avatar">
            👤
          </div>

          <h2>
            My Profile
          </h2>

          <p className="profile-login-message">
            Please login to view your profile.
          </p>

        </div>
      </section>
    );
  }

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      name: name,
    };

    localStorage.setItem(
      "foodieGoUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <section
      id="profile"
      className="profile-page"
    >

      <div className="profile-box">

        {/* Avatar */}

        <div className="profile-avatar">
          👤
        </div>

        <h2>
          My Profile
        </h2>

        <p className="profile-welcome">
          Welcome to FoodieGo!
        </p>


        {/* EDIT MODE */}

        {isEditing ? (

          <div className="profile-edit-form">

            <label>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

            <div className="profile-buttons">

              <button
                className="profile-save-btn"
                onClick={saveProfile}
              >
                Save Changes
              </button>

              <button
                className="profile-cancel-btn"
                onClick={() => {
                  setName(user.name);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        ) : (

          <>

            {/* USER INFORMATION */}

            <div className="profile-info">

              <div className="profile-info-item">

                <span className="profile-label">
                  👤 Name
                </span>

                <strong>
                  {user.name}
                </strong>

              </div>


              <div className="profile-info-item">

                <span className="profile-label">
                  📧 Email
                </span>

                <strong>
                  {user.email}
                </strong>

              </div>

            </div>


            {/* EDIT BUTTON */}

            <button
              className="profile-edit-btn"
              onClick={() =>
                setIsEditing(true)
              }
            >
              ✏️ Edit Profile
            </button>

          </>

        )}

      </div>

    </section>
  );
}

export default Profile;