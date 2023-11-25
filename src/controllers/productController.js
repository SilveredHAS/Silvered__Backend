const Product = require("../models/product");

// Controller function to create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price /* other fields */ } = req.body;

    // Create a new product instance using the Product model
    // const newProduct = new Product({
    //   name,
    //   description,
    //   price,
    //   // other fields as needed
    // });

    const newProduct = new Product({
      name: "Orange Henley TShirt",
      description: "Slim tshirt for boys",
      price: 4,
      ratings: 1,
      details: {
        material: "Nylon",
        pattern: "Printed",
        fit: "Stomach Fit",
        color: "Orange",
        sleeve: "Half",
      },
      category: "tshirt",
      images: [
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FVNeck.jpg?alt=media&token=0cd9f0a1-2345-48a4-9174-cbcdcfd38fa5",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FTShirtImage.jpg?alt=media&token=9e830fd5-f851-4a91-8891-c8001c5964d5",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FRoundNeck.jpg?alt=media&token=2a7bc4d8-3b9c-499c-8d5e-64dcb7a259f5",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FCollar.jpg?alt=media&token=7b75644a-e7fa-4bab-8fa2-ccbd56f77072",
      ],
      // other fields as needed
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct); // Send back the saved product as JSON
  } catch (error) {
    res.status(500).json({ error: "Could not create the product" });
  }
};

const getAllProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category; // Get category from the query parameter

    // Find products by the provided category
    const products = await Product.find({ category });

    res.status(200).json(products); // Send back the products as JSON
  } catch (error) {
    res.status(500).json({ error: "Could not fetch products" });
  }
};

module.exports = { createProduct, getAllProductsByCategory };
