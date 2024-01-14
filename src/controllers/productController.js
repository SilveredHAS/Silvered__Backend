const Product = require("../models/product");
const User = require("../models/user");
const CryptoJS = require("crypto-js");

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
      discount,
      isCustomized,
      userMobile,
      priority,
      ratings,
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
      discount,
      isCustomized,
      userMobile,
      priority,
      ratings,
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
      discount,
      sellingPrice: price - (price * discount) / 100,
      isCustomized,
      priority,
      ratings,
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
    const savedProductId = savedProduct._id;
    console.log(savedProduct);
    console.log("Product Created Successfully!");

    if (isCustomized === "Yes" && userMobile !== "") {
      const user = await User.findOne({ mobileNumber: userMobile });
      if (user) {
        user.customization = savedProductId;
        await user.save();
      } else {
        res.status(401).json({
          message:
            "Prdouct Created Successfully, but User does not exist. Please enter correct mobile number",
        });
      }
    }
    // res.status(200).json(savedProduct);
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(savedProduct),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
  } catch (error) {
    res.status(500).json({ error: "Could not create the product" });
  }
};

const getAllProductsByCategory = async (req, res) => {
  try {
    console.log("Inside GetAllProductsByCategory Controller");
    console.log("Session data in GetAllProductsByCategory is ", req.session);
    console.log("Req body is ", req.body);
    const {
      category,
      variant,
      material,
      pattern,
      fit,
      color,
      sleeve,
      price,
      sortBy,
      pageNo,
    } = req.body;
    const itemsPerPage = 20;
    const itemsToSkip = pageNo === 0 ? 0 : (pageNo - 1) * itemsPerPage;
    console.log("Items to skip is ", itemsToSkip);
    let query = {};
    let sortCriteria = {};

    // Build the query object based on the provided filters
    if (category && Array.isArray(category) && category.length !== 0) {
      query.category = { $in: category };
    }
    if (variant && Array.isArray(variant) && variant.length !== 0) {
      query.variant = { $in: variant };
    }
    if (material && Array.isArray(material) && material.length !== 0) {
      query.material = { $in: material };
    }
    if (pattern && Array.isArray(pattern) && pattern.length !== 0) {
      query.pattern = { $in: pattern };
    }
    if (fit && Array.isArray(fit) && fit.length !== 0) {
      query.fit = { $in: fit };
    }
    if (color && Array.isArray(color) && color.length !== 0) {
      query.color = { $in: color };
    }
    if (sleeve && Array.isArray(sleeve) && sleeve.length !== 0) {
      query.sleeve = { $in: sleeve };
    }
    // if (price && Array.isArray(price) && price.length !== 0) {
    //   query.sellingPrice = buildPriceQuery(price);
    // }

    //sort criteria
    if (sortBy === "Price:Low to High") {
      sortCriteria = { price: 1 }; // Sort by price ascending
    } else if (sortBy === "Price:High to Low") {
      sortCriteria = { sellingPrice: -1 }; // Sort by price ascending
    } else if (sortBy === "Ratings") {
      sortCriteria = { ratings: -1 }; // Sort by ratings descending
    } else if (sortBy === "New Arrivals") {
      sortCriteria = { createdAt: -1 }; // Sort by time (assuming 'createdAt' field)
    } else {
      sortCriteria = { priority: 1 };
    }

    // Execute the query with the filters
    console.log("Final Query is ", query);
    console.log("Final Query is:", JSON.stringify(query, null, 2));
    console.log("Sort Criteria is ", sortCriteria);
    const filteredProducts = await Product.find(query)
      .sort(sortCriteria)
      .limit(parseInt(itemsPerPage))
      .skip(parseInt(itemsToSkip))
      .exec();
    console.log("Filtered Products are ", filteredProducts);
    const totalProducts = await Product.find(query).countDocuments().exec();
    console.log("Total Products are ", totalProducts);
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    console.log("Total Pages are ", totalPages);
    console.log("Current Page No is ", pageNo);

    const sensitiveData = {
      products: filteredProducts,
      totalPages: totalPages,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
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
    // res
    //   .status(200)
    //   .json({ message: "Product deleted successfully", deletedProduct });
    const sensitiveData = {
      message: "Product deleted successfully",
      deletedProduct,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
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
    let updateData = req.body; // Data to update from request body
    updateData.sellingPrice =
      updateData.price - (updateData.price * updateData.discount) / 100;
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
    // return res.status(200).json({ product: updatedProduct });
    const sensitiveData = { product: updatedProduct };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    console.log("Inside getProductById Controller");
    console.log("Session data is ", req.session);
    const productId = req.params.id;
    console.log("Product id is ", req.params.id);
    const product = await Product.findById(productId);
    // console.log("Found product is ", product);
    const sensitiveData = { product: product };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
    // return res.status(200).json({
    //   product: product,
    // });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the product by id" });
  }
};

module.exports = {
  createProduct,
  getAllProductsByCategory,
  deleteProductById,
  updateProductById,
  getProductById,
};
