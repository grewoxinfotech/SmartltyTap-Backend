const sequelize = require("../config/db");
const Product = require("../models/Product");

async function addProduct() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    const images = [
      "http://localhost:5000/uploads/pvc_classic_front.png",
      "http://localhost:5000/uploads/pvc_classic_back.png",
      "http://localhost:5000/uploads/pvc_classic_mockup.png",
    ];

    const product = await Product.create({
      name: "SmartlyTap PVC Classic",
      description: "Durable, high-quality PVC card with custom full-color printing and NFC technology.",
      price: 999.00,
      stock: 100,
      image_url: images[0],
      images,
      is_active: true
    });

    console.log("Product added successfully:", product.toJSON());
    process.exit(0);
  } catch (error) {
    console.error("Error adding product:", error);
    process.exit(1);
  }
}

addProduct();
