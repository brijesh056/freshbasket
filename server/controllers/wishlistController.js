const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) return res.json({ success: true, products: [] });
    res.json({ success: true, products: wishlist.products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });
    const idx = wishlist.products.indexOf(productId);
    let added;
    if (idx === -1) { wishlist.products.push(productId); added = true; }
    else { wishlist.products.splice(idx, 1); added = false; }
    await wishlist.save();
    res.json({ success: true, added, message: added ? 'Added to wishlist' : 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
