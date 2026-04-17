const sequelize = require("../config/db");
const Product = require("../models/Product");

async function addPremiumProduct() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    const images = [
      "http://localhost:5000/uploads/pinky_nfc_stand.png",
      "http://localhost:5000/uploads/pinky_nfc_stand_side.png",
      "http://localhost:5000/uploads/pinky_nfc_stand_lifestyle.png",
    ];

    const product = await Product.create({
      name: "3 QR pinky style NFC stand Premium",
      description: "Premium NFC stand featuring 3 customizable QR codes and a sleek pinky style design for modern business presence. Perfect for receptions, events, and consulting desks.",
      price: 1499.00,
      original_price: 3000.00,
      badge: "-50%,New,Hot",
      stock: 50,
      image_url: images[0],
      images,
      rating: 4.9,
      reviews_count: 124,
      is_active: true
    });

    console.log("Premium product added successfully:", product.toJSON());
    process.exit(0);
  } catch (error) {
    console.error("Error adding product:", error);
    process.exit(1);
  }
}

addPremiumProduct();
