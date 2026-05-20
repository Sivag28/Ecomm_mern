import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sampleProducts = [
  // home-living
  {
    name: 'Pillows',
    description: 'Soft decorative pillows for living rooms and bedrooms',
    price: 29,
    category: 'home-living',
    brand: 'HomeCo',
    countInStock: 120,
    images: ['/images/products/pillows.jpg'],
    rating: 4.5,
    numReviews: 42,
    reviews: []
  },
  {
    name: 'Planters',
    description: 'Ceramic planters to brighten indoor spaces',
    price: 22,
    category: 'home-living',
    brand: 'GreenThumb',
    countInStock: 80,
    images: ['/images/products/planters.jpg'],
    rating: 4.4,
    numReviews: 18,
    reviews: []
  },
  {
    name: 'Vases',
    description: 'Handcrafted vases in assorted sizes',
    price: 35,
    category: 'home-living',
    brand: 'Studio',
    countInStock: 60,
    images: ['/images/products/vases.jpg'],
    rating: 4.6,
    numReviews: 26,
    reviews: []
  },

  // jewelry-accessories
  {
    name: 'Necklaces',
    description: 'Delicate necklaces for everyday wear',
    price: 45,
    category: 'jewelry-accessories',
    brand: 'Bijou',
    countInStock: 70,
    images: ['/images/products/necklaces.jpg'],
    rating: 4.7,
    numReviews: 64,
    reviews: []
  },
  {
    name: 'Rings',
    description: 'Minimal and statement rings in various finishes',
    price: 32,
    category: 'jewelry-accessories',
    brand: 'GemWorks',
    countInStock: 50,
    images: ['/images/products/rings.jpg'],
    rating: 4.5,
    numReviews: 39,
    reviews: []
  },
  {
    name: 'Bracelets',
    description: 'Handmade bracelets with quality clasps',
    price: 28,
    category: 'jewelry-accessories',
    brand: 'Wristly',
    countInStock: 90,
    images: ['/images/products/bracelets.jpg'],
    rating: 4.4,
    numReviews: 21,
    reviews: []
  },

  // clothing-wearables
  {
    name: 'Hats',
    description: 'Stylish hats for all seasons',
    price: 25,
    category: 'clothing-wearables',
    brand: 'HeadStart',
    countInStock: 110,
    images: ['/images/products/hats.jpg'],
    rating: 4.3,
    numReviews: 30,
    reviews: []
  },
  {
    name: 'Scarves',
    description: 'Soft wool and silk scarves',
    price: 29,
    category: 'clothing-wearables',
    brand: 'WrapCo',
    countInStock: 95,
    images: ['/images/products/scarves.jpg'],
    rating: 4.5,
    numReviews: 44,
    reviews: []
  },
  {
    name: 'Knitted Apparel',
    description: 'Cozy knitted sweaters and cardigans',
    price: 65,
    category: 'clothing-wearables',
    brand: 'KnitHouse',
    countInStock: 40,
    images: ['/images/products/knitted-apparel.jpg'],
    rating: 4.6,
    numReviews: 51,
    reviews: []
  },

  // bags-purses
  {
    name: 'Leather Bags',
    description: 'Premium leather bags and satchels',
    price: 120,
    category: 'bags-purses',
    brand: 'LeatherWorks',
    countInStock: 34,
    images: ['/images/products/leather-bags.jpg'],
    rating: 4.7,
    numReviews: 29,
    reviews: []
  },
  {
    name: 'Tote Bags',
    description: 'Durable canvas tote bags for daily use',
    price: 28,
    category: 'bags-purses',
    brand: 'CarryAll',
    countInStock: 120,
    images: ['/images/products/tote-bags.jpg'],
    rating: 4.2,
    numReviews: 15,
    reviews: []
  },
  {
    name: 'Wallets',
    description: 'Slim wallets with multiple compartments',
    price: 39,
    category: 'bags-purses',
    brand: 'Pocket',
    countInStock: 85,
    images: ['/images/products/wallets.jpg'],
    rating: 4.4,
    numReviews: 20,
    reviews: []
  },

  // art-collectibles
  {
    name: 'Paintings',
    description: 'Original and print paintings by local artists',
    price: 180,
    category: 'art-collectibles',
    brand: 'Artisan',
    countInStock: 12,
    images: ['/images/products/paintings.jpg'],
    rating: 4.8,
    numReviews: 9,
    reviews: []
  },
  {
    name: 'Sculptures',
    description: 'Handcrafted sculptures in mixed media',
    price: 240,
    category: 'art-collectibles',
    brand: 'Form',
    countInStock: 8,
    images: ['/images/products/sculptures.jpg'],
    rating: 4.7,
    numReviews: 5,
    reviews: []
  },
  {
    name: 'Illustrations',
    description: 'Limited edition illustrations and prints',
    price: 55,
    category: 'art-collectibles',
    brand: 'InkWorks',
    countInStock: 30,
    images: ['/images/products/illustrations.jpg'],
    rating: 4.6,
    numReviews: 12,
    reviews: []
  },

  // stationery-party
  {
    name: 'Notebooks',
    description: 'Handbound notebooks and journals',
    price: 14,
    category: 'stationery-party',
    brand: 'PaperCo',
    countInStock: 200,
    images: ['/images/products/notebooks.jpg'],
    rating: 4.5,
    numReviews: 48,
    reviews: []
  },
  {
    name: 'Greeting Cards',
    description: 'Illustrated greeting cards for every occasion',
    price: 4,
    category: 'stationery-party',
    brand: 'CardWorks',
    countInStock: 300,
    images: ['/images/products/greeting-cards.jpg'],
    rating: 4.4,
    numReviews: 67,
    reviews: []
  },
  {
    name: 'Party Decorations',
    description: 'Decorations and banners for parties and events',
    price: 22,
    category: 'stationery-party',
    brand: 'Celebrate',
    countInStock: 140,
    images: ['/images/products/party-decorations.jpg'],
    rating: 4.3,
    numReviews: 18,
    reviews: []
  },

  // bath-beauty
  {
    name: 'Handmade Soaps',
    description: 'Natural handcrafted soaps with essential oils',
    price: 8,
    category: 'bath-beauty',
    brand: 'Pure',
    countInStock: 220,
    images: ['/images/products/handmade-soaps.jpg'],
    rating: 4.6,
    numReviews: 72,
    reviews: []
  },
  {
    name: 'Lip Balms',
    description: 'Moisturizing lip balms in multiple flavors',
    price: 5,
    category: 'bath-beauty',
    brand: 'Lush',
    countInStock: 300,
    images: ['/images/products/lip-balms.jpg'],
    rating: 4.4,
    numReviews: 60,
    reviews: []
  },
  {
    name: 'Skincare Products',
    description: 'Gentle skincare products for daily use',
    price: 24,
    category: 'bath-beauty',
    brand: 'Glow',
    countInStock: 150,
    images: ['/images/products/skincare-products.jpg'],
    rating: 4.5,
    numReviews: 33,
    reviews: []
  },

  // toys-games
  {
    name: 'Wooden Toys',
    description: 'Eco-friendly wooden toys for children',
    price: 30,
    category: 'toys-games',
    brand: 'PlayWell',
    countInStock: 90,
    images: ['/images/products/wooden-toys.jpg'],
    rating: 4.6,
    numReviews: 40,
    reviews: []
  },
  {
    name: 'Board Games',
    description: 'Fun board games for family nights',
    price: 45,
    category: 'toys-games',
    brand: 'GameHub',
    countInStock: 60,
    images: ['/images/products/board-games.jpg'],
    rating: 4.7,
    numReviews: 55,
    reviews: []
  },
  {
    name: 'Plush Toys',
    description: 'Soft plush toys for kids of all ages',
    price: 20,
    category: 'toys-games',
    brand: 'Cuddle',
    countInStock: 130,
    images: ['/images/products/plush-toys.jpg'],
    rating: 4.5,
    numReviews: 47,
    reviews: []
  },

  // weddings-events
  {
    name: 'Wedding Decor',
    description: 'Elegant decorations for weddings and events',
    price: 75,
    category: 'weddings-events',
    brand: 'Eventful',
    countInStock: 25,
    images: ['/images/products/wedding-decor.jpg'],
    rating: 4.8,
    numReviews: 11,
    reviews: []
  },
  {
    name: 'Bouquets',
    description: 'Fresh and dried bouquets for special occasions',
    price: 45,
    category: 'weddings-events',
    brand: 'Bloom',
    countInStock: 40,
    images: ['/images/products/bouquets.jpg'],
    rating: 4.6,
    numReviews: 19,
    reviews: []
  },
  {
    name: 'Invitations',
    description: 'Custom invitations and RSVP cards',
    price: 12,
    category: 'weddings-events',
    brand: 'PaperInvite',
    countInStock: 200,
    images: ['/images/products/invitations.jpg'],
    rating: 4.4,
    numReviews: 23,
    reviews: []
  },

  // pet-supplies
  {
    name: 'Pet Beds',
    description: 'Comfortable beds for pets of all sizes',
    price: 55,
    category: 'pet-supplies',
    brand: 'Paws',
    countInStock: 46,
    images: ['/images/products/pet-beds.jpg'],
    rating: 4.5,
    numReviews: 32,
    reviews: []
  },
  {
    name: 'Pet Collars',
    description: 'Durable and stylish pet collars',
    price: 15,
    category: 'pet-supplies',
    brand: 'Fetch',
    countInStock: 180,
    images: ['/images/products/pet-collars.jpg'],
    rating: 4.3,
    numReviews: 27,
    reviews: []
  },
  {
    name: 'Pet Toys',
    description: 'Engaging toys to keep pets active',
    price: 12,
    category: 'pet-supplies',
    brand: 'PlayPet',
    countInStock: 210,
    images: ['/images/products/pet-toys.jpg'],
    rating: 4.4,
    numReviews: 54,
    reviews: []
  },

  // seasonal-holiday
  {
    name: 'Festive Decorations',
    description: 'Seasonal decorations to celebrate holidays',
    price: 34,
    category: 'seasonal-holiday',
    brand: 'Festivity',
    countInStock: 140,
    images: ['/images/products/festive-decorations.jpg'],
    rating: 4.5,
    numReviews: 38,
    reviews: []
  },
  {
    name: 'Seasonal Gifts',
    description: 'Curated gift sets for seasonal giving',
    price: 48,
    category: 'seasonal-holiday',
    brand: 'Gifter',
    countInStock: 90,
    images: ['/images/products/seasonal-gifts.jpg'],
    rating: 4.6,
    numReviews: 21,
    reviews: []
  },
  {
    name: 'Gift Wraps',
    description: 'Premium gift wraps and ribbons',
    price: 9,
    category: 'seasonal-holiday',
    brand: 'WrapIt',
    countInStock: 260,
    images: ['/images/products/gift-wraps.jpg'],
    rating: 4.3,
    numReviews: 16,
    reviews: []
  },

  // craft-supplies
  {
    name: 'Beads',
    description: 'Assorted beads for jewelry making and crafts',
    price: 6,
    category: 'craft-supplies',
    brand: 'CraftPlus',
    countInStock: 400,
    images: ['/images/products/beads.jpg'],
    rating: 4.4,
    numReviews: 80,
    reviews: []
  },
  {
    name: 'Buttons',
    description: 'Decorative and functional buttons in packs',
    price: 5,
    category: 'craft-supplies',
    brand: 'SewMate',
    countInStock: 320,
    images: ['/images/products/buttons.jpg'],
    rating: 4.2,
    numReviews: 28,
    reviews: []
  },
  {
    name: 'Trims',
    description: 'Decorative trims and ribbons for sewing projects',
    price: 7,
    category: 'craft-supplies',
    brand: 'TrimWorks',
    countInStock: 150,
    images: ['/images/products/trims.jpg' ],
    rating: 4.3,
    numReviews: 14,
    reviews: []
  }
];


// Auto-generate products from images in frontend/public/images/products
// Creates one product per image without repetition or suffixes.
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products');

// Files that are used as category cover tiles (one per category). Skip creating
// a product entry for those exact filenames so we don't duplicate the cover image.
const categoryKeys = ['home-living','jewelry-accessories','clothing-wearables','bags-purses','art-collectibles','stationery-party','bath-beauty','toys-games','weddings-events','pet-supplies','seasonal-holiday','craft-supplies'];

// Explicit filename -> category overrides to match your requested remapping
const filenameCategoryOverrides = {
  'calligraphy': 'art-collectibles',
  'customized-gifts': 'weddings-events',
  'hair-accessories': 'jewelry-accessories',
  'hand-stitched-kercheifs': 'clothing-wearables',
  'handmade-ornaments': 'seasonal-holiday',
  'keepsakes': 'toys-games',
  'card-games': 'toys-games',
  'pet-toys': 'pet-supplies',
  'pet toys': 'pet-supplies'
};

function detectCategoryFromName(name) {
  const n = name.toLowerCase();
  if (/pillows|planters|vases|chairs|cutting|sofa|home|living|bookcase|table|pillow/.test(n)) return 'home-living';
  if (/necklace|ring|earring|bracelet|jewel|jewelry|keychain|keepsake|beads/.test(n)) return 'jewelry-accessories';
  if (/hat|scarves|glove|knitted|tshirt|clothing|apparel|custom-tshirts|scarves|hats/.test(n)) return 'clothing-wearables';
  if (/bag|purse|wallet|tote|leather|pouch|purses/.test(n)) return 'bags-purses';
  if (/painting|portrait|illustration|sculpture|miniature|wall-art|art|portrait|paintings|illustrations/.test(n)) return 'art-collectibles';
  if (/notebook|greeting|invitation|party|card|cards|wrap|gift-wrap|party-decorations|greeting-cards/.test(n)) return 'stationery-party';
  if (/soap|scrub|skincare|lip|balm|bath|beauty|candles|handmade-soaps|skincare-products/.test(n)) return 'bath-beauty';
  if (/board|card-game|card-games|plush|wooden-toys|toy|games|board-games|plush-toys|toys-games/.test(n)) return 'toys-games';
  if (/wedding|bouquet|wedding-decor|weddings-events|bouquets|invitations/.test(n)) return 'weddings-events';
  if (/pet|pet-bed|pet-toy|pet-collar|pet-beds|pet-collars|pet-toys|pet-supplies/.test(n)) return 'pet-supplies';
  if (/festive|seasonal|holiday|seasonal-gifts|festive-decorations|seasonal-holiday/.test(n)) return 'seasonal-holiday';
  if (/bead|button|trim|trims|diy|craft|yarn|embroid|custom-stamps|craft-supplies|hands|hand-dyed|cutting-boards/.test(n)) return 'craft-supplies';
  // fallback
  return 'home-living';
}

let productsWithImages = [];
try {
  const files = fs.readdirSync(imagesDir).filter(f => /\.jpe?g$|\.png$/i.test(f));
  productsWithImages = files.map((file) => {
    const base = path.parse(file).name; // e.g. 'pillows'
    // If this file is exactly a category cover image, skip creating a product for it
    if (categoryKeys.includes(base)) return null;
    const displayName = base.replace(/-/g, ' ');
    // Apply explicit overrides first
    const category = filenameCategoryOverrides[base] || detectCategoryFromName(base);
    const price = Math.floor(Math.random() * 90) + 10;
    const countInStock = Math.floor(Math.random() * 200) + 5;
    const rating = +(Math.random() * 1.5 + 3.5).toFixed(1);
    const numReviews = Math.floor(Math.random() * 200);

    return {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      description: `Handmade or curated ${displayName} suitable for its category.`,
      price,
      category,
      brand: category.split('-')[0] || 'Maker',
      countInStock,
      images: [`/images/products/${file}`],
      rating,
      numReviews,
      reviews: []
    };
  }).filter(Boolean);
} catch (err) {
  console.warn('Could not read images directory, falling back to sampleProducts array.', err.message);
  // If directory not readable, fallback to previously defined sampleProducts
  productsWithImages = sampleProducts.map((p) => ({ ...p, images: p.images && p.images.length ? p.images : ['/images/products/default.jpg'] }));
}


const seedDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI is not set. Please set your MongoDB Atlas connection string in backend/.env or as an environment variable.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin1234',
        isAdmin: true,
      });
      console.log('Created admin user for seeding');
    }

    const productsToInsert = productsWithImages.map(p => {
      const image = Array.isArray(p.images) && p.images.length ? p.images[0] : (p.image || '/images/products/default.jpg');
      const { images, ...rest } = p;
      return {
        ...rest,
        image,
        user: adminUser._id,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Successfully seeded ${createdProducts.length} products`);

    const categoryCounts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('\nProducts seeded by category:');
    categoryCounts.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });

    console.log('\nSeeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
