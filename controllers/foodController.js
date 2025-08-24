import foodModel from "../models/foodmodel.js";

// Add food item
const addFood = async (req, res) => {
  // Cloudinary automatically gives a secure URL for the uploaded file
  let image_url = req.file.path;   // <-- use Cloudinary path, not local filename

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_url   // <-- store Cloudinary URL in DB
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food items
const removeFood = async (req, res) => {
  try {
    // just remove from DB, no need for fs.unlink (Cloudinary manages files)
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
