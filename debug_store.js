const localStore = require('./localStore');
console.log('Testing localStore...');
localStore.getAllProducts().then(products => {
    console.log(`✅ Success! Found ${products.length} products.`);
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
