const validateProduct = (req, res, next) => {
    const { name, description, price, category, brand } = req.body;
  
    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }
  
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }
  
    next();
  };
  
  module.exports = {
    validateProduct,
  };