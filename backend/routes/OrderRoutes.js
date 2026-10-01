const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

/* =====================================================
   CREATE ORDER
===================================================== */

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      items,
      total,
      paymentMethod,
      deliveryAddress,
      deliveryDetails,
    } = req.body;

    /* ---------- USER VALIDATION ---------- */

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
    }

    /* ---------- ITEMS VALIDATION ---------- */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one item is required",
      });
    }

    /* ---------- TOTAL VALIDATION ---------- */

    if (
      total === undefined ||
      total === null ||
      Number(total) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid order total is required",
      });
    }

    /* ---------- DELIVERY VALIDATION ---------- */

    const details = deliveryDetails || {};

    if (
      !details.fullName ||
      !details.phone ||
      !details.address ||
      !details.city ||
      !details.pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete delivery details are required",
      });
    }

    /* ---------- CLEAN ITEMS ---------- */

    const cleanItems = items.map((item) => ({
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || "",
      restaurantName:
        item.restaurantName || "",
      restaurantId:
        item.restaurantId || "",
    }));

    /* ---------- CREATE ORDER ---------- */

    const order = new Order({
      userId,

      items: cleanItems,

      total: Number(total),

      status: "Order Placed",

      paymentMethod:
        paymentMethod || "Cash on Delivery",

      deliveryDetails: {
        fullName:
          details.fullName || "",

        phone:
          details.phone || "",

        address:
          details.address || "",

        city:
          details.city || "",

        pincode:
          details.pincode || "",

        instructions:
          details.instructions || "",
      },

      deliveryAddress:
        deliveryAddress ||
        `${details.address}, ${details.city} - ${details.pincode}`,
    });

    const savedOrder =
      await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =====================================================
   GET ALL ORDERS OF USER
===================================================== */

router.get(
  "/user/:userId",
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const orders =
        await Order.find({
          userId,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error(
        "Get User Orders Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* =====================================================
   GET SINGLE ORDER
===================================================== */

router.get(
  "/:orderId",
  async (req, res) => {
    try {
      const { orderId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          orderId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      const order =
        await Order.findById(
          orderId
        ).lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "Get Single Order Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

router.put(
  "/:orderId/status",
  async (req, res) => {
    try {
      const { orderId } =
        req.params;

      const { status } =
        req.body;

      const allowedStatuses = [
        "Order Placed",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
      ];

      if (
        !mongoose.Types.ObjectId.isValid(
          orderId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          orderId,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        message:
          "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;