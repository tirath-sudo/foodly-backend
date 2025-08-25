import foodModel from "../models/foodmodel.js";

// Add food item (image already uploaded by multer-storage-cloudinary)
const addFood = async (req, res) => {
  try {
    const image_url = req.file?.path || ""; // Cloudinary secure URL
    if (!image_url) {
      return res.json({ success: false, message: "Image required" });
    }

    const food = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_url,
    });

    res.json({ success: true, message: "Food Added", data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove
const removeFood = async (req, res) => {
  try {
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
