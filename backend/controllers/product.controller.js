import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongodb
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryRespesponse = null;

    if (image) {
      try {
        cloudinaryRespesponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      } catch (uploadError) {
        console.error("Cloudinary upload failed, using fallback:", uploadError.message);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryRespesponse?.secure_url
        ? cloudinaryRespesponse.secure_url
        : (image && !image.startsWith("data:") ? image : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),
      category,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image && product.image.includes("cloudinary")) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary");
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct Controller");

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in RecommendedProduct Controller");

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });

    res.json({ products });
  } catch (error) {
    console.log("Error in GetProductsByCategory Controller");

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in ToggleFeaturedProduct Controller");

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuedProducts = await Product.find({ isFeatured: true });
    // Update your cache with the featured products
    await redis.set("featured_products", JSON.stringify(featuedProducts));
  } catch (error) {
    console.log("Error in updateFeaturedProductsCache function");
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log("Error in getProductById Controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFilteredProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;

    let query = {};

    if (category && category !== "all") {
      if (Array.isArray(category)) {
        query.category = { $in: category.map((c) => c.toLowerCase()) };
      } else if (typeof category === "string") {
        const categoryList = category.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
        if (categoryList.length > 1) {
          query.category = { $in: categoryList };
        } else if (categoryList.length === 1) {
          query.category = categoryList[0];
        }
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = {};
    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else if (sort === "title_asc") {
      sortOption.name = 1;
    } else if (sort === "title_desc") {
      sortOption.name = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const products = await Product.find(query).sort(sortOption);
    res.json({ products });
  } catch (error) {
    console.log("Error in getFilteredProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
