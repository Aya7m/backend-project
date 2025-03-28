import cloudinary from "../lib/cloudinary.js";
import Product from "../model/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // find all products
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getFlashOverProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFlashOver: true }); // find all products
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getNewProducts = async (req, res) => {
    try {
        const products = await Product.find({ isNew: true }); // find all products
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getisFreeShippingProduct = async (req, res) => {
    try {
        const products = await Product.find({ isFreeShipping: true }); // find all products
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


// create a product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        



        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloduinary");
            } catch (error) {
                console.log("error deleting image from cloduinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
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
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// get product by name
export const getProductByName = async (req, res) => {
    try {
        console.log("🔍 البحث عن المنتج:", req.params.name); // ✅ التحقق من القيمة المستلمة

        const { name } = req.params;
        const products = await Product.find({
            name: { $regex: new RegExp(name, "i") }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.json(products);
    } catch (error) {
        console.error("Error in getProductByName controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
