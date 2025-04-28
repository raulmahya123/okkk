const prisma = require('../prisma');


exports.getAllProducts = async (req, res) => {
  const merchantId = parseInt(req.query.merchantId);

  const products = await prisma.product.findMany({
    where: { merchantId },
    include: {
      variants: true,
    },
  });

  res.json(products);
};

exports.createProduct = async (req, res) => {
  const { merchantId, name, description, basePrice, hasVariant, variants } = req.body;

  const product = await prisma.product.create({
    data: {
      merchantId,
      name,
      description,
      basePrice,
      hasVariant,
      variants: hasVariant ? {
        create: variants.map(v => ({
          color: v.color,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
          price: v.price || basePrice,
        }))
      } : undefined
    }
  });

  res.json(product);
};


// Endpoint untuk mengupdate produk
exports.updateProduct = async (req, res) => {
  const { id } = req.params; // ID produk yang akan diupdate
  const { merchantId, name, description, basePrice, hasVariant, variants } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        merchantId,
        name,
        description,
        basePrice,
        hasVariant,
        variants: hasVariant ? {
          upsert: variants.map(v => ({
            where: { id: v.id || 0 }, // Jika ID varian ada, update; jika tidak, buat baru
            create: {
              color: v.color,
              size: v.size,
              sku: v.sku,
              stock: v.stock,
              price: v.price || basePrice,
            },
            update: {
              color: v.color,
              size: v.size,
              sku: v.sku,
              stock: v.stock,
              price: v.price || basePrice,
            },
          }))
        } : undefined,
      },
    });

    // Kirimkan response dengan produk yang sudah diperbarui
    res.json(updatedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate produk' });
  }
};
