const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    restaurantName: {
      type: String,
      default: "",
    },

    restaurantId: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Order Placed",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Order Placed",
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    deliveryDetails: {
      fullName: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      instructions: {
        type: String,
        default: "",
      },
    },

    // Kept for compatibility with old orders
    deliveryAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);