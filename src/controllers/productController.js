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
      name: "Yellow RoundNeck TShirt",
      description: "Nice tshirt for boys",
      price: 5,
      ratings: 3,
      details: {
        material: "Nylon",
        pattern: "Printed",
        fit: "Stomach Fit",
        color: "Orange",
        sleeve: "Half",
      },
      category: "tshirt",
      images: [
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FVNeck_Full_Sleeve%2FFRONT.jpg?alt=media&token=73ced109-27bc-40b9-bbb5-85de55aa00d8",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FVNeck_Full_Sleeve%2FBACK.jpg?alt=media&token=de7cc905-0e33-4466-8e50-fa1d975e9a58",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FVNeck_Full_Sleeve%2F51HRwYnffwL._SX679_.jpg?alt=media&token=d603bd5d-80ac-4b97-8d5a-4489118cb802",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FVNeck_Full_Sleeve%2Faa79a4c78077db300c941085d9a02953.jpg?alt=media&token=ba962bc8-93dc-45a3-9445-fd10e910f8e3",
        "https://firebasestorage.googleapis.com/v0/b/silvered.appspot.com/o/Ecommerce_Store%2FTshirts%2FVNeck_Full_Sleeve%2Fmoc.jpg?alt=media&token=ba071fc2-2832-4d69-ab9c-5d6c222d3719",
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

const deleteProductById = async (req, res) => {
  const productId = req.params.id; // Get product ID from request parameters
  console.log("Product ID is ", productId);
  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      console.log("Product Not Found!");
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product deleted successfully");
    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.log("Could not delete product");
    res
      .status(500)
      .json({ error: "Could not delete product", message: error.message });
  }
};

module.exports = { createProduct, getAllProductsByCategory, deleteProductById };
