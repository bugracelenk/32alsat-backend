const mongoose = require("mongoose");
const validation = require("../utils/validation");

exports.add_category = async (req, res, next) => {
  try {
    let category_name = req.body.category_name;

    let category = await mongoose.model("Category").create({ category_name });

    if (!category)
      return res.status(500).json({
        error: "Kategori oluşturulurken bir hata ile karşılaşıldı."
      });

    return res.status(201).json({
      message: "Kategori oluşturuldu",
      category
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.delete_category = async (req, res, next) => {
  try {
    let category_id = req.body.category_id;

    await validation.isValid(category_id, "category_id");

    let deleted_category = await mongoose
      .model("Category")
      .findByIdAndDelete(category_id);

    if (!deleted_category)
      return res.status(500).json({
        error: "Kategori silinirken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "Kategori başarılı bir şekilde silindi",
      deleted_category
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.approve_ilan = async (req, res, next) => {
  try {
    let ilan_id = req.body.ilan_id;

    await validation.isValid(ilan_id, "ilan_id");

    let ilan = await mongoose.model("Ilan").findById(ilan_id);

    ilan.isApproved = true;
    ilan.updated_at = Date.now();

    let _ilan = await ilan.save();

    if (_ilan === ilan || !_ilan)
      return res.status(500).json({
        error: "İlan onaylanırken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "İlan başarılı bir şekilde onaylandı.",
      request: {
        type: "GET",
        uri: `http://localhost:${process.env.PORT}/api/ilanlar/${ilan._id}`
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.disapprove_ilan = async (req, res, next) => {
  try {
    let ilan_id = req.body.ilan_id;

    await validation.isValid(ilan_id, "ilan_id");

    let ilan = await mongoose.model("Ilan").findById(ilan_id);

    ilan.isApproved = false;
    ilan.updated_at = Date.now();

    let _ilan = await ilan.save();

    if (_ilan === ilan || !_ilan)
      return res.status(500).json({
        error: "İlan onaylanırken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "İlan başarılı bir şekilde onaylanmadı.",
      request: {
        type: "GET",
        uri: `http://localhost:${process.env.PORT}/api/ilanlar/${ilan._id}`
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.approve_product = async (req, res, next) => {
  try {
    let product_id = req.body.product_id;

    await validation.isValid(product_id, "product_id");

    let product = await mongoose.model("Product").findById(product_id);

    product.isApproved = true;
    product.updated_at = Date.now();

    let _product = await product.save();

    if (_product === product || !_product)
      return res.status(500).json({
        error: "Ürün onaylanırken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "Ürün başarılı bir şekilde onaylandı.",
      request: {
        type: "GET",
        uri: `http://localhost:${process.env.PORT}/api/products/${product._id}`
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.disapprove_product = async (req, res, next) => {
  try {
    let product_id = req.body.product_id;

    await validation.isValid(product_id, "product_id");

    let product = await mongoose.model("Product").findById(product_id);

    product.isApproved = false;
    product.updated_at = Date.now();

    let _product = await product.save();

    if (_product === product || !_product)
      return res.status(500).json({
        error: "Ürün onaylanırken bir hata ile karşılaşıldı."
      });

    return res.status(200).json({
      message: "Ürün başarılı bir şekilde onaylanmadı.",
      request: {
        type: "GET",
        uri: `http://localhost:${process.env.PORT}/api/products/${product._id}`
      }
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};

exports.get_approvals = async (req, res, next) => {
  try {
    let ilanlar = await mongoose.model("Ilan").find({ isApproved: false });
    let products = await mongoose.model("Product").find({ isApproved: false });

    if (!ilanlar || !products)
      return res.status(500).json({
        error: "İlanlar veya ürünler getirilirken bir hata ile karşılaşıldı."
      });

    let results = [];

    if (ilanlar.length === 0 && products.length > 0) {
      results = [...results, products];
    } else if (ilanlar.length > 0 && products.length === 0) {
      results = [...results, ilanlar];
    } else if (ilanlar.length > 0 && products.length > 0) {
      results = [...results, ilanlar, products];
    }

    return res.status(200).json({
      results
    })
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      error: err.message
    });
  }
};
