// Script pour corriger toutes les URLs HTTP en HTTPS dans MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const OLD_URL = 'http://51.254.135.247:5000';
const NEW_URL = 'https://w-store.tn';

async function fixDatabaseUrls() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connecté à MongoDB\n');

    const db = mongoose.connection.db;

    // 1. Corriger les catégories
    console.log('1. Correction des catégories...');
    const categoriesResult = await db.collection('categories').updateMany(
      { image: { $regex: OLD_URL } },
      [{ $set: { image: { $replaceAll: { input: "$image", find: OLD_URL, replacement: NEW_URL } } } }]
    );
    console.log(`   ✓ ${categoriesResult.modifiedCount} catégories mises à jour`);

    // 2. Corriger les sous-catégories
    console.log('2. Correction des sous-catégories...');
    const subcategoriesResult = await db.collection('subcategories').updateMany(
      { image: { $regex: OLD_URL } },
      [{ $set: { image: { $replaceAll: { input: "$image", find: OLD_URL, replacement: NEW_URL } } } }]
    );
    console.log(`   ✓ ${subcategoriesResult.modifiedCount} sous-catégories mises à jour`);

    // 3. Corriger les produits (image principale)
    console.log('3. Correction des produits (image principale)...');
    const productsImageResult = await db.collection('products').updateMany(
      { image: { $regex: OLD_URL } },
      [{ $set: { image: { $replaceAll: { input: "$image", find: OLD_URL, replacement: NEW_URL } } } }]
    );
    console.log(`   ✓ ${productsImageResult.modifiedCount} produits (image) mis à jour`);

    // 4. Corriger les produits (images multiples)
    console.log('4. Correction des produits (images multiples)...');
    const products = await db.collection('products').find({ images: { $exists: true } }).toArray();
    let productsImagesUpdated = 0;
    
    for (const product of products) {
      if (product.images && Array.isArray(product.images)) {
        const updatedImages = product.images.map(img => 
          typeof img === 'string' ? img.replace(OLD_URL, NEW_URL) : img
        );
        
        if (JSON.stringify(updatedImages) !== JSON.stringify(product.images)) {
          await db.collection('products').updateOne(
            { _id: product._id },
            { $set: { images: updatedImages } }
          );
          productsImagesUpdated++;
        }
      }
    }
    console.log(`   ✓ ${productsImagesUpdated} produits (images multiples) mis à jour`);

    // 5. Corriger les marques
    console.log('5. Correction des marques...');
    const brandsResult = await db.collection('brands').updateMany(
      { logo: { $regex: OLD_URL } },
      [{ $set: { logo: { $replaceAll: { input: "$logo", find: OLD_URL, replacement: NEW_URL } } } }]
    );
    console.log(`   ✓ ${brandsResult.modifiedCount} marques mises à jour`);

    // 6. Vérification finale
    console.log('\n6. Vérification finale...');
    const remainingCategories = await db.collection('categories').countDocuments({ image: { $regex: OLD_URL } });
    const remainingSubcategories = await db.collection('subcategories').countDocuments({ image: { $regex: OLD_URL } });
    const remainingProducts = await db.collection('products').countDocuments({ 
      $or: [
        { image: { $regex: OLD_URL } },
        { images: { $regex: OLD_URL } }
      ]
    });
    const remainingBrands = await db.collection('brands').countDocuments({ logo: { $regex: OLD_URL } });

    console.log(`   Catégories restantes avec HTTP: ${remainingCategories}`);
    console.log(`   Sous-catégories restantes avec HTTP: ${remainingSubcategories}`);
    console.log(`   Produits restants avec HTTP: ${remainingProducts}`);
    console.log(`   Marques restantes avec HTTP: ${remainingBrands}`);

    if (remainingCategories + remainingSubcategories + remainingProducts + remainingBrands === 0) {
      console.log('\n✓ TOUTES LES URLs ONT ÉTÉ CORRIGÉES!');
    } else {
      console.log('\n⚠ Certaines URLs HTTP restent à corriger');
    }

    await mongoose.connection.close();
    console.log('\n✓ Déconnexion de MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixDatabaseUrls();
