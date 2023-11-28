const Product = require("../models/product");

// Controller function to create a new product
const createProduct = async (req, res) => {
  try {
    console.log("In create-product controller");
    const {
      productName,
      productDescription,
      category,
      variant,
      material,
      pattern,
      color,
      fit,
      sleeve,
      price,
      gsm,
      frontImageUrl,
      backImageUrl,
      womenImageUrl,
      zoomImageUrl,
      mocupImageUrl,
    } = req.body;

    console.log(
      productName,
      productDescription,
      category,
      variant,
      material,
      pattern,
      color,
      fit,
      sleeve,
      price,
      gsm,
      frontImageUrl,
      backImageUrl,
      womenImageUrl,
      zoomImageUrl,
      mocupImageUrl
    );

    // Create a new product instance using the Product model
    const newProduct = new Product({
      name: productName,
      description: productDescription,
      category,
      variant,
      ratings: 0,
      material,
      pattern,
      color,
      fit,
      sleeve,
      price,
      gsm,
      images: [
        frontImageUrl,
        backImageUrl,
        womenImageUrl,
        zoomImageUrl,
        mocupImageUrl,
      ],
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();
    console.log(savedProduct);
    console.log("Product Created Successfully!");
    res.status(200).json(savedProduct); // Send back the saved product as JSON
  } catch (error) {
    res.status(500).json({ error: "Could not create the product" });
  }
};

const getAllProductsByCategory = async (req, res) => {
  try {
    console.log("Inside GetAllProductsByCategory Controller");
    const category = req.query.category; // Get category from the query parameter
    console.log("Category is ", category);
    // Find products by the provided category
    const products = await Product.find({ category });
    console.log("Products are ", products);
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

const updateProductById = async (req, res) => {
  try {
    console.log("Inside Update Product By Id Controller");
    const productId = req.params.id;
    const updateData = req.body; // Data to update from request body
    console.log("The Product Id is ", productId);
    console.log("The Update Product Data is ", updateData);
    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true } // To return the updated product
    );

    if (!updatedProduct) {
      console.log("Product Not Found");
      return res.status(404).json({ message: "Product not found" });
    }

    // Respond with the updated product details
    console.log("The Product Updated Successfully!");
    return res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getAllProductsByCategory,
  deleteProductById,
  updateProductById,
};
