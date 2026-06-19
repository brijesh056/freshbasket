require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

const categories = [
  { name: 'Fruits', icon: '🍎' },
  { name: 'Vegetables', icon: '🥦' },
  { name: 'Dairy & Milk', icon: '🥛' },
  { name: 'Bread & Bakery', icon: '🍞' },
  { name: 'Rice & Grains', icon: '🌾' },
  { name: 'Pulses & Dal', icon: '🫘' },
  { name: 'Oil & Ghee', icon: '🫙' },
  { name: 'Beverages', icon: '🥤' },
  { name: 'Tea & Coffee', icon: '☕' },
  { name: 'Snacks', icon: '🍿' },
  { name: 'Biscuits', icon: '🍪' },
  { name: 'Instant Food', icon: '🍜' },
  { name: 'Frozen Food', icon: '🧊' },
  { name: 'Spices', icon: '🌶️' },
  { name: 'Dry Fruits', icon: '🥜' },
  { name: 'Personal Care', icon: '🧴' },
  { name: 'Baby Care', icon: '👶' },
  { name: 'Household Items', icon: '🏠' },
  { name: 'Cleaning Products', icon: '🧹' },
  { name: 'Pet Food', icon: '🐾' }
];

const imgs = {
  'Fruits': [
    // index 0 - Red Apples
    'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&auto=format',
    // index 1 - Bananas
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format',
    // index 2 - Mango
    'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format',
    // index 3 - Orange
    'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&auto=format',
    // index 4 - Green Grapes
    'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&auto=format',
    // index 5 - Watermelon
    'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400&auto=format',
    // index 6 - Papaya
    'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400&auto=format',
    // index 7 - Pomegranate
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format',
    // index 8 - Kiwi
    'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400&auto=format',
    // index 9 - Pineapple
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&auto=format',
    // index 10 - Strawberries
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&auto=format',
    // index 11 - Guava
    'https://images.unsplash.com/photo-1536613549548-a2af6f497f28?w=400&auto=format',
  ],
  'Vegetables': [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format',
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&auto=format',
    'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&auto=format',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&auto=format',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&auto=format',
    'https://images.unsplash.com/photo-1566842600175-97dca489844f?w=400&auto=format',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&auto=format',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format',
    'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&auto=format',
  ],
  'Dairy & Milk': [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&auto=format',
    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format',
    'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&auto=format',
    'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&auto=format',
    'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=400&auto=format',
    'https://images.unsplash.com/photo-1612187530902-9145769a68a4?w=400&auto=format',
  ],
  'Bread & Bakery': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format',
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400&auto=format',
    'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&auto=format',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format',
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&auto=format',
    'https://images.unsplash.com/photo-1534432182912-63863115e106?w=400&auto=format',
  ],
  'Rice & Grains': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format',
    'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format',
    'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=400&auto=format',
    'https://images.unsplash.com/photo-1604542031658-5799ca5d7936?w=400&auto=format',
    'https://images.unsplash.com/photo-1556040220-4096d522378d?w=400&auto=format',
  ],
  'Pulses & Dal': [
    'https://images.unsplash.com/photo-1585996770215-5d23e44ab2c3?w=400&auto=format',
    'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&auto=format',
    'https://images.unsplash.com/photo-1515543237350-b3ecd177f7f7?w=400&auto=format',
    'https://images.unsplash.com/photo-1627482665690-13833196ca4e?w=400&auto=format',
    'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&auto=format',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&auto=format',
  ],
  'Oil & Ghee': [
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format',
    'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&auto=format',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format',
    'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&auto=format',
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format',
  ],
  'Beverages': [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format',
    'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=400&auto=format',
    'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=400&auto=format',
    'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&auto=format',
    'https://images.unsplash.com/photo-1473946598891-2c8b5c41c9b5?w=400&auto=format',
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&auto=format',
  ],
  'Tea & Coffee': [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format',
    'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400&auto=format',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format',
    'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format',
    'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format',
  ],
  'Snacks': [
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&auto=format',
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&auto=format',
    'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format',
    'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&auto=format',
    'https://images.unsplash.com/photo-1575576357924-65eb9f20498d?w=400&auto=format',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format',
  ],
  'Biscuits': [
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format',
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format',
    'https://images.unsplash.com/photo-1612198790700-0f7c9af4bd71?w=400&auto=format',
    'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=400&auto=format',
    'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?w=400&auto=format',
    'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&auto=format',
  ],
  'Instant Food': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format',
    'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=400&auto=format',
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&auto=format',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&auto=format',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format',
  ],
  'Frozen Food': [
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&auto=format',
    'https://images.unsplash.com/photo-1567206563114-c179906b01d5?w=400&auto=format',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&auto=format',
    'https://images.unsplash.com/photo-1568901839119-631418a3910d?w=400&auto=format',
  ],
  'Spices': [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format',
    'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&auto=format',
    'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&auto=format',
    'https://images.unsplash.com/photo-1599909533731-8e807fef34a1?w=400&auto=format',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format',
    'https://images.unsplash.com/photo-1506368083636-6defb67639a3?w=400&auto=format',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&auto=format',
  ],
  'Dry Fruits': [
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&auto=format',
    'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400&auto=format',
    'https://images.unsplash.com/photo-1607174116888-0e0ab3e0f2d8?w=400&auto=format',
    'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&auto=format',
    'https://images.unsplash.com/photo-1563412580-f1b62e506502?w=400&auto=format',
    'https://images.unsplash.com/photo-1573723374773-20212a5f5acc?w=400&auto=format',
  ],
  'Personal Care': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format',
    'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&auto=format',
    'https://images.unsplash.com/photo-1631390869882-8f5e08cfe6b7?w=400&auto=format',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&auto=format',
  ],
  'Baby Care': [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format',
    'https://images.unsplash.com/photo-1584839404100-e4ac5c4afb8d?w=400&auto=format',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&auto=format',
  ],
  'Household Items': [
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&auto=format',
    'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=400&auto=format',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format',
  ],
  'Cleaning Products': [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&auto=format',
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&auto=format',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&auto=format',
    'https://images.unsplash.com/photo-1600757800886-9a4f41a76fbe?w=400&auto=format',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&auto=format',
  ],
  'Pet Food': [
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format',
    'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&auto=format',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&auto=format',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=400&auto=format',
  ],
};

const getImg = (category, index) => {
  const list = imgs[category] || imgs['Fruits'];
  return list[index % list.length];
};

const products = [
  // FRUITS (12)
  { name: 'Fresh Red Apples (1 kg)', category: 'Fruits', price: 149, discountPrice: 129, stock: 100, unit: 'kg', rating: 4.5, numReviews: 42, description: 'Crispy and sweet red apples, freshly sourced from Himachal Pradesh.', isFeatured: true },
  { name: 'Bananas (1 dozen)', category: 'Fruits', price: 60, discountPrice: 49, stock: 150, unit: 'dozen', rating: 4.3, numReviews: 38, description: 'Ripe yellow bananas, rich in potassium and natural energy.' },
  { name: 'Mango Alphonso (1 kg)', category: 'Fruits', price: 299, discountPrice: 249, stock: 80, unit: 'kg', rating: 4.8, numReviews: 65, description: 'Premium Alphonso mangoes from Ratnagiri — the king of mangoes.', isFeatured: true },
  { name: 'Orange Valencia (1 kg)', category: 'Fruits', price: 99, discountPrice: 85, stock: 120, unit: 'kg', rating: 4.2, numReviews: 29, description: 'Juicy Valencia oranges packed with Vitamin C.' },
  { name: 'Green Seedless Grapes (500g)', category: 'Fruits', price: 89, discountPrice: 75, stock: 90, unit: '500g', rating: 4.4, numReviews: 33, description: 'Seedless green grapes, fresh and sweet. Perfect for snacking.' },
  { name: 'Watermelon (1 piece ~3kg)', category: 'Fruits', price: 120, discountPrice: 99, stock: 50, unit: 'piece', rating: 4.6, numReviews: 55, description: 'Large fresh watermelon, perfect for summer hydration.' },
  { name: 'Papaya (1 kg)', category: 'Fruits', price: 79, discountPrice: 65, stock: 70, unit: 'kg', rating: 4.1, numReviews: 21, description: 'Ripe papaya, great for digestion and rich in Vitamin A.' },
  { name: 'Pomegranate (2 pcs)', category: 'Fruits', price: 149, discountPrice: 129, stock: 60, unit: '2 pcs', rating: 4.5, numReviews: 47, description: 'Fresh pomegranates rich in antioxidants and iron.' },
  { name: 'Kiwi (6 pcs)', category: 'Fruits', price: 199, discountPrice: 169, stock: 55, unit: '6 pcs', rating: 4.3, numReviews: 28, description: 'Imported Kiwi fruits, tangy and nutritious — Vitamin C rich.' },
  { name: 'Pineapple (1 piece)', category: 'Fruits', price: 89, discountPrice: 75, stock: 40, unit: 'piece', rating: 4.0, numReviews: 18, description: 'Fresh pineapple, sweet and tangy. Great for juices.' },
  { name: 'Strawberries (250g)', category: 'Fruits', price: 129, discountPrice: 109, stock: 60, unit: '250g', rating: 4.6, numReviews: 52, description: 'Fresh red strawberries, sweet and juicy. Perfect for desserts.', isFeatured: true },
  { name: 'Guava (500g)', category: 'Fruits', price: 59, discountPrice: 49, stock: 80, unit: '500g', rating: 4.2, numReviews: 24, description: 'Fresh guavas, high in Vitamin C and dietary fibre.' },

  // VEGETABLES (12)
  { name: 'Tomatoes (1 kg)', category: 'Vegetables', price: 45, discountPrice: 39, stock: 200, unit: 'kg', rating: 4.2, numReviews: 61, description: 'Fresh red tomatoes, perfect for curries and salads.', isFeatured: true },
  { name: 'Onions (1 kg)', category: 'Vegetables', price: 39, discountPrice: 32, stock: 250, unit: 'kg', rating: 4.0, numReviews: 44, description: 'Premium quality onions, essential for Indian cooking.' },
  { name: 'Potatoes (1 kg)', category: 'Vegetables', price: 35, discountPrice: 28, stock: 300, unit: 'kg', rating: 4.1, numReviews: 58, description: 'Fresh potatoes, ideal for curries, fries and more.' },
  { name: 'Spinach / Palak (250g)', category: 'Vegetables', price: 29, discountPrice: 24, stock: 100, unit: '250g', rating: 4.3, numReviews: 31, description: 'Fresh tender spinach leaves, rich in iron and calcium.' },
  { name: 'Broccoli (500g)', category: 'Vegetables', price: 79, discountPrice: 65, stock: 80, unit: '500g', rating: 4.4, numReviews: 37, description: 'Fresh green broccoli florets, a superfood powerhouse.' },
  { name: 'Carrots (1 kg)', category: 'Vegetables', price: 55, discountPrice: 45, stock: 150, unit: 'kg', rating: 4.2, numReviews: 39, description: 'Crunchy orange carrots, great for juicing and cooking.' },
  { name: 'Capsicum Green (500g)', category: 'Vegetables', price: 49, discountPrice: 42, stock: 90, unit: '500g', rating: 4.0, numReviews: 22, description: 'Fresh green capsicum for salads, stir-fries and curries.' },
  { name: 'Cauliflower (1 piece)', category: 'Vegetables', price: 45, discountPrice: 39, stock: 70, unit: 'piece', rating: 4.1, numReviews: 26, description: 'Fresh white cauliflower for aloo gobi and soups.' },
  { name: 'Bottle Gourd / Lauki (500g)', category: 'Vegetables', price: 29, discountPrice: 25, stock: 120, unit: '500g', rating: 3.9, numReviews: 15, description: 'Fresh lauki, ideal for healthy cooking and weight management.' },
  { name: 'Lady Finger / Bhindi (500g)', category: 'Vegetables', price: 39, discountPrice: 33, stock: 100, unit: '500g', rating: 4.0, numReviews: 19, description: 'Tender okra pods, perfect for bhindi masala.' },
  { name: 'Cucumber (500g)', category: 'Vegetables', price: 29, discountPrice: 24, stock: 130, unit: '500g', rating: 4.1, numReviews: 28, description: 'Fresh cucumbers, great for salads and raita.' },
  { name: 'Green Peas / Matar (500g)', category: 'Vegetables', price: 49, discountPrice: 42, stock: 90, unit: '500g', rating: 4.3, numReviews: 34, description: 'Fresh green peas for pulao, curries and snacks.' },

  // DAIRY & MILK (8)
  { name: 'Amul Gold Full Cream Milk (1L)', category: 'Dairy & Milk', price: 66, discountPrice: 66, stock: 200, unit: '1L', rating: 4.6, numReviews: 89, description: 'Full cream pasteurised milk, rich in protein and calcium.', isFeatured: true },
  { name: 'Amul Salted Butter (500g)', category: 'Dairy & Milk', price: 275, discountPrice: 265, stock: 100, unit: '500g', rating: 4.7, numReviews: 76, description: 'Creamy salted butter made from fresh cream.' },
  { name: 'Amul Fresh Paneer (200g)', category: 'Dairy & Milk', price: 85, discountPrice: 79, stock: 150, unit: '200g', rating: 4.5, numReviews: 63, description: 'Fresh soft cottage cheese — perfect for curries and snacks.' },
  { name: 'Mother Dairy Curd (500g)', category: 'Dairy & Milk', price: 45, discountPrice: 40, stock: 120, unit: '500g', rating: 4.4, numReviews: 54, description: 'Thick set curd, creamy and fresh.' },
  { name: 'Amul Cheese Slices (200g)', category: 'Dairy & Milk', price: 130, discountPrice: 119, stock: 80, unit: '200g', rating: 4.3, numReviews: 42, description: 'Processed cheese slices for sandwiches and burgers.' },
  { name: 'Nestle A+ Toned Milk (1L)', category: 'Dairy & Milk', price: 62, discountPrice: 62, stock: 150, unit: '1L', rating: 4.5, numReviews: 47, description: 'Toned milk with essential nutrients for daily health.' },
  { name: 'Mother Dairy Sweet Lassi (200ml)', category: 'Dairy & Milk', price: 25, discountPrice: 22, stock: 100, unit: '200ml', rating: 4.2, numReviews: 35, description: 'Sweet lassi — refreshing chilled drink packed with probiotics.' },
  { name: 'Epigamia Greek Yogurt (400g)', category: 'Dairy & Milk', price: 149, discountPrice: 129, stock: 60, unit: '400g', rating: 4.4, numReviews: 31, description: 'Thick and creamy Greek yogurt with live cultures.' },

  // BREAD & BAKERY (6)
  { name: 'Britannia White Bread (400g)', category: 'Bread & Bakery', price: 45, discountPrice: 42, stock: 100, unit: '400g', rating: 4.2, numReviews: 48, description: 'Soft white sandwich bread, freshly baked.', isFeatured: true },
  { name: 'Britannia Brown Bread (400g)', category: 'Bread & Bakery', price: 55, discountPrice: 49, stock: 80, unit: '400g', rating: 4.3, numReviews: 39, description: 'Whole wheat brown bread, healthy and nutritious.' },
  { name: 'Pav Dinner Rolls (6 pcs)', category: 'Bread & Bakery', price: 30, discountPrice: 28, stock: 120, unit: '6 pcs', rating: 4.1, numReviews: 26, description: 'Soft dinner rolls — perfect for vada pav and bhaji.' },
  { name: 'Sesame Burger Buns (4 pcs)', category: 'Bread & Bakery', price: 45, discountPrice: 40, stock: 90, unit: '4 pcs', rating: 4.2, numReviews: 31, description: 'Soft sesame-topped burger buns.' },
  { name: 'Butter Croissant (4 pcs)', category: 'Bread & Bakery', price: 89, discountPrice: 79, stock: 50, unit: '4 pcs', rating: 4.4, numReviews: 23, description: 'Flaky, buttery croissants — fresh from the bakery.' },
  { name: 'Multigrain Bread (400g)', category: 'Bread & Bakery', price: 65, discountPrice: 58, stock: 70, unit: '400g', rating: 4.5, numReviews: 41, description: 'Healthy multigrain bread with seeds and whole grains.' },

  // RICE & GRAINS (6)
  { name: 'India Gate Basmati Rice (5 kg)', category: 'Rice & Grains', price: 549, discountPrice: 499, stock: 80, unit: '5kg', rating: 4.7, numReviews: 82, description: 'Premium aged Basmati rice — long grain, aromatic.', isFeatured: true },
  { name: 'Fortune Chakki Fresh Atta (10 kg)', category: 'Rice & Grains', price: 389, discountPrice: 349, stock: 100, unit: '10kg', rating: 4.6, numReviews: 74, description: 'Whole wheat chakki fresh atta for soft rotis.' },
  { name: 'Quaker Rolled Oats (500g)', category: 'Rice & Grains', price: 99, discountPrice: 85, stock: 120, unit: '500g', rating: 4.5, numReviews: 66, description: 'Quick-cook rolled oats — healthy breakfast option.' },
  { name: 'Suji Fine Semolina (500g)', category: 'Rice & Grains', price: 35, discountPrice: 29, stock: 150, unit: '500g', rating: 4.2, numReviews: 28, description: 'Fine semolina for upma, halwa and idli.' },
  { name: 'Thick Poha Flattened Rice (500g)', category: 'Rice & Grains', price: 35, discountPrice: 29, stock: 140, unit: '500g', rating: 4.3, numReviews: 33, description: 'Thick flattened rice — perfect for poha breakfast.' },
  { name: 'Sona Masoori Rice (5 kg)', category: 'Rice & Grains', price: 349, discountPrice: 319, stock: 90, unit: '5kg', rating: 4.4, numReviews: 51, description: 'Lightweight aromatic rice, ideal for everyday meals.' },

  // PULSES & DAL (6)
  { name: 'Toor Dal / Arhar Dal (1 kg)', category: 'Pulses & Dal', price: 149, discountPrice: 129, stock: 100, unit: 'kg', rating: 4.4, numReviews: 57, description: 'Clean polished toor dal — protein-rich daily essential.', isFeatured: true },
  { name: 'Moong Dal Yellow (1 kg)', category: 'Pulses & Dal', price: 139, discountPrice: 119, stock: 100, unit: 'kg', rating: 4.3, numReviews: 44, description: 'Hulled yellow moong dal — light and easy to digest.' },
  { name: 'Chana Dal Split (1 kg)', category: 'Pulses & Dal', price: 119, discountPrice: 99, stock: 120, unit: 'kg', rating: 4.2, numReviews: 36, description: 'Split chickpeas — high in protein and fibre.' },
  { name: 'Masoor Dal Red (1 kg)', category: 'Pulses & Dal', price: 109, discountPrice: 95, stock: 110, unit: 'kg', rating: 4.1, numReviews: 29, description: 'Red lentils — quick cooking and nutritious.' },
  { name: 'Kashmiri Rajma (500g)', category: 'Pulses & Dal', price: 79, discountPrice: 69, stock: 90, unit: '500g', rating: 4.5, numReviews: 63, description: 'Authentic Kashmiri rajma for the best rajma chawal.' },
  { name: 'Whole Urad Dal Black (1 kg)', category: 'Pulses & Dal', price: 129, discountPrice: 115, stock: 80, unit: 'kg', rating: 4.3, numReviews: 38, description: 'Whole black urad dal for dal makhani and idli batter.' },

  // OIL & GHEE (6)
  { name: 'Amul Pure Cow Ghee (1L)', category: 'Oil & Ghee', price: 599, discountPrice: 549, stock: 60, unit: '1L', rating: 4.8, numReviews: 91, description: 'Pure cow ghee with rich aroma — made from fresh butter.', isFeatured: true },
  { name: 'Fortune Sunflower Oil (1L)', category: 'Oil & Ghee', price: 145, discountPrice: 129, stock: 100, unit: '1L', rating: 4.4, numReviews: 52, description: 'Refined sunflower oil — light, healthy cooking oil.' },
  { name: 'Saffola Gold Oil (1L)', category: 'Oil & Ghee', price: 185, discountPrice: 169, stock: 80, unit: '1L', rating: 4.5, numReviews: 67, description: 'Blended edible oil for better heart health.' },
  { name: 'Kachi Ghani Mustard Oil (1L)', category: 'Oil & Ghee', price: 175, discountPrice: 155, stock: 90, unit: '1L', rating: 4.3, numReviews: 41, description: 'Cold-pressed mustard oil with pungent authentic flavour.' },
  { name: 'Parachute Virgin Coconut Oil (500ml)', category: 'Oil & Ghee', price: 189, discountPrice: 169, stock: 70, unit: '500ml', rating: 4.6, numReviews: 58, description: 'Cold pressed virgin coconut oil — pure and natural.' },
  { name: 'Figaro Extra Virgin Olive Oil (500ml)', category: 'Oil & Ghee', price: 499, discountPrice: 449, stock: 45, unit: '500ml', rating: 4.7, numReviews: 48, description: 'Extra virgin olive oil — ideal for salads and light cooking.' },

  // BEVERAGES (6)
  { name: 'Tropicana Orange Juice (1L)', category: 'Beverages', price: 130, discountPrice: 115, stock: 80, unit: '1L', rating: 4.3, numReviews: 49, description: '100% fruit juice with no added sugar.', isFeatured: true },
  { name: 'Real Mango Juice (1L)', category: 'Beverages', price: 120, discountPrice: 105, stock: 90, unit: '1L', rating: 4.2, numReviews: 42, description: 'Real fruit juice with natural mango flavour.' },
  { name: 'Coca Cola (2L)', category: 'Beverages', price: 99, discountPrice: 89, stock: 100, unit: '2L', rating: 4.1, numReviews: 73, description: 'Classic refreshing cola drink.' },
  { name: 'Sprite Lemon Lime (2L)', category: 'Beverages', price: 99, discountPrice: 89, stock: 100, unit: '2L', rating: 4.0, numReviews: 61, description: 'Refreshing lemon-lime soft drink.' },
  { name: 'Bisleri Mineral Water (1L)', category: 'Beverages', price: 20, discountPrice: 20, stock: 200, unit: '1L', rating: 4.5, numReviews: 88, description: 'Pure and safe mineral water from Bisleri.' },
  { name: 'Appy Fizz Apple Drink (300ml)', category: 'Beverages', price: 30, discountPrice: 28, stock: 120, unit: '300ml', rating: 4.2, numReviews: 36, description: 'Apple flavoured fizzy drink — refreshing and bubbly.' },

  // TEA & COFFEE (6)
  { name: 'Tata Tea Premium (500g)', category: 'Tea & Coffee', price: 249, discountPrice: 219, stock: 100, unit: '500g', rating: 4.6, numReviews: 84, description: 'Rich and aromatic Assam tea blend.', isFeatured: true },
  { name: 'Brooke Bond Red Label (500g)', category: 'Tea & Coffee', price: 239, discountPrice: 210, stock: 90, unit: '500g', rating: 4.5, numReviews: 77, description: 'Strong, bold Assam tea with great flavour.' },
  { name: 'Nescafe Classic Instant Coffee (200g)', category: 'Tea & Coffee', price: 399, discountPrice: 359, stock: 70, unit: '200g', rating: 4.7, numReviews: 69, description: 'Premium instant coffee with rich aroma.' },
  { name: 'Bru Instant Coffee (200g)', category: 'Tea & Coffee', price: 329, discountPrice: 299, stock: 75, unit: '200g', rating: 4.4, numReviews: 55, description: 'South Indian filter coffee taste in instant form.' },
  { name: 'Tetley Green Tea (25 bags)', category: 'Tea & Coffee', price: 149, discountPrice: 129, stock: 100, unit: '25 bags', rating: 4.5, numReviews: 61, description: 'Natural green tea with antioxidants for wellness.' },
  { name: 'Darjeeling First Flush Tea (250g)', category: 'Tea & Coffee', price: 349, discountPrice: 299, stock: 50, unit: '250g', rating: 4.8, numReviews: 43, description: 'Premium Darjeeling first flush tea — light and floral.' },

  // SNACKS (7)
  { name: "Lay's Classic Salted Chips (52g)", category: 'Snacks', price: 20, discountPrice: 20, stock: 200, unit: '52g', rating: 4.2, numReviews: 95, description: 'Classic salted potato chips — light and crispy.', isFeatured: true },
  { name: 'Haldiram Bhujia Sev (400g)', category: 'Snacks', price: 149, discountPrice: 135, stock: 100, unit: '400g', rating: 4.6, numReviews: 82, description: 'Traditional spiced bhujia namkeen from Haldirams.' },
  { name: 'Kurkure Masala Munch (90g)', category: 'Snacks', price: 30, discountPrice: 30, stock: 150, unit: '90g', rating: 4.1, numReviews: 71, description: 'Spicy puffed corn snack — crunchy and masaledar.' },
  { name: 'Cornitos Nacho Chips (150g)', category: 'Snacks', price: 79, discountPrice: 69, stock: 90, unit: '150g', rating: 4.3, numReviews: 44, description: 'Crunchy nacho chips with salsa dip.' },
  { name: 'Pringles Original (110g)', category: 'Snacks', price: 149, discountPrice: 129, stock: 70, unit: '110g', rating: 4.5, numReviews: 58, description: 'Stacked original flavour crisps in iconic can.' },
  { name: 'Haldiram Aloo Bhujia (200g)', category: 'Snacks', price: 65, discountPrice: 58, stock: 120, unit: '200g', rating: 4.4, numReviews: 53, description: 'Crispy aloo bhujia with authentic Indian spices.' },
  { name: 'Bingo Mad Angles (75g)', category: 'Snacks', price: 20, discountPrice: 20, stock: 180, unit: '75g', rating: 4.0, numReviews: 46, description: 'Triangular tangy snack — uniquely shaped and spiced.' },

  // BISCUITS (6)
  { name: 'Parle-G Glucose Biscuits (800g)', category: 'Biscuits', price: 65, discountPrice: 60, stock: 200, unit: '800g', rating: 4.5, numReviews: 112, description: "India's most loved glucose biscuit — a timeless classic." },
  { name: 'Oreo Original Sandwich (300g)', category: 'Biscuits', price: 89, discountPrice: 79, stock: 100, unit: '300g', rating: 4.6, numReviews: 94, description: 'Chocolate sandwich cookie with cream filling.' },
  { name: 'Britannia Bourbon (150g)', category: 'Biscuits', price: 35, discountPrice: 30, stock: 150, unit: '150g', rating: 4.3, numReviews: 61, description: 'Chocolaty cream biscuits — crunch and cream in every bite.' },
  { name: 'Britannia 50-50 Maska Chaska (200g)', category: 'Biscuits', price: 30, discountPrice: 27, stock: 180, unit: '200g', rating: 4.2, numReviews: 49, description: 'Sweet and salty biscuits — perfectly balanced.' },
  { name: 'Britannia Good Day Cashew (200g)', category: 'Biscuits', price: 45, discountPrice: 40, stock: 130, unit: '200g', rating: 4.4, numReviews: 73, description: 'Butter cookies with real cashew pieces.' },
  { name: 'Hide & Seek Chocolate Chip (75g)', category: 'Biscuits', price: 25, discountPrice: 22, stock: 140, unit: '75g', rating: 4.3, numReviews: 55, description: 'Crunchy biscuits with real chocolate chips.' },

  // INSTANT FOOD (6)
  { name: 'Maggi 2-Min Masala Noodles (4 pack)', category: 'Instant Food', price: 60, discountPrice: 56, stock: 200, unit: '4 pack', rating: 4.5, numReviews: 134, description: "India's favourite instant noodles — ready in 2 minutes.", isFeatured: true },
  { name: 'MTR Poha Breakfast Mix (200g)', category: 'Instant Food', price: 55, discountPrice: 49, stock: 100, unit: '200g', rating: 4.3, numReviews: 47, description: 'Ready-to-cook poha mix — quick and delicious breakfast.' },
  { name: 'Yippee Long Slurpy Noodles (4 pack)', category: 'Instant Food', price: 55, discountPrice: 50, stock: 150, unit: '4 pack', rating: 4.2, numReviews: 62, description: 'Long masala noodles that never break during cooking.' },
  { name: 'MTR Instant Idli Mix (500g)', category: 'Instant Food', price: 99, discountPrice: 89, stock: 80, unit: '500g', rating: 4.4, numReviews: 38, description: 'Instant idli mix — soft idlis ready in minutes.' },
  { name: 'Knorr Classic Tomato Soup (43g)', category: 'Instant Food', price: 35, discountPrice: 30, stock: 120, unit: '43g', rating: 4.0, numReviews: 34, description: 'Rich creamy tomato soup — just add hot water.' },
  { name: 'Haldiram Ready Dal Makhani (300g)', category: 'Instant Food', price: 89, discountPrice: 79, stock: 90, unit: '300g', rating: 4.3, numReviews: 41, description: 'Ready to eat restaurant-style dal makhani.' },

  // FROZEN FOOD (5)
  { name: 'McCain Smiles Potato Snack (420g)', category: 'Frozen Food', price: 149, discountPrice: 135, stock: 60, unit: '420g', rating: 4.4, numReviews: 52, description: 'Smile-shaped potato snacks — kids favourite.', isFeatured: true },
  { name: 'ITC Master Chef Veg Burger Patty (240g)', category: 'Frozen Food', price: 179, discountPrice: 159, stock: 50, unit: '240g', rating: 4.3, numReviews: 34, description: 'Ready-to-fry vegetable burger patties.' },
  { name: 'Vadilal Mango Ice Cream (1L)', category: 'Frozen Food', price: 199, discountPrice: 179, stock: 40, unit: '1L', rating: 4.6, numReviews: 67, description: 'Classic Alphonso mango ice cream — creamy and indulgent.' },
  { name: 'McCain French Fries (450g)', category: 'Frozen Food', price: 149, discountPrice: 129, stock: 60, unit: '450g', rating: 4.5, numReviews: 78, description: 'Golden crispy french fries — oven or air-fry ready.' },
  { name: 'Amul Vanilla Ice Cream (1L)', category: 'Frozen Food', price: 179, discountPrice: 159, stock: 50, unit: '1L', rating: 4.5, numReviews: 71, description: 'Classic creamy vanilla ice cream by Amul.' },

  // SPICES (7)
  { name: 'MDH Chana Masala (100g)', category: 'Spices', price: 60, discountPrice: 55, stock: 120, unit: '100g', rating: 4.6, numReviews: 84, description: 'Authentic spice blend for chole and chana masala.' },
  { name: 'Everest Garam Masala (100g)', category: 'Spices', price: 65, discountPrice: 59, stock: 110, unit: '100g', rating: 4.5, numReviews: 76, description: 'Aromatic whole spice blend for curries.' },
  { name: 'Pure Turmeric Powder Haldi (200g)', category: 'Spices', price: 55, discountPrice: 45, stock: 150, unit: '200g', rating: 4.4, numReviews: 62, description: 'Pure turmeric powder — antiseptic and flavourful.' },
  { name: 'Kashmiri Red Chilli Powder (200g)', category: 'Spices', price: 65, discountPrice: 55, stock: 140, unit: '200g', rating: 4.3, numReviews: 55, description: 'Bright red Kashmiri chilli for colour and mild heat.' },
  { name: 'Whole Cumin Seeds Jeera (200g)', category: 'Spices', price: 55, discountPrice: 45, stock: 130, unit: '200g', rating: 4.5, numReviews: 48, description: 'Whole cumin seeds for tempering and flavouring.' },
  { name: 'Black Mustard Seeds Rai (200g)', category: 'Spices', price: 40, discountPrice: 35, stock: 120, unit: '200g', rating: 4.2, numReviews: 37, description: 'Small black mustard seeds for South Indian tadka.' },
  { name: 'MDH Kitchen King Masala (100g)', category: 'Spices', price: 65, discountPrice: 59, stock: 100, unit: '100g', rating: 4.6, numReviews: 71, description: 'All-purpose masala blend for everyday Indian cooking.' },

  // DRY FRUITS (6)
  { name: 'California Almonds (500g)', category: 'Dry Fruits', price: 449, discountPrice: 399, stock: 80, unit: '500g', rating: 4.7, numReviews: 93, description: 'Premium California almonds — protein-rich daily snack.', isFeatured: true },
  { name: 'Premium Cashews W320 (500g)', category: 'Dry Fruits', price: 499, discountPrice: 449, stock: 70, unit: '500g', rating: 4.8, numReviews: 88, description: 'Premium grade whole cashew nuts — crunchy and creamy.' },
  { name: 'Roasted Pistachios (250g)', category: 'Dry Fruits', price: 399, discountPrice: 359, stock: 60, unit: '250g', rating: 4.6, numReviews: 67, description: 'Lightly salted roasted pistachios.' },
  { name: 'Golden Raisins Kishmish (500g)', category: 'Dry Fruits', price: 199, discountPrice: 175, stock: 100, unit: '500g', rating: 4.4, numReviews: 54, description: 'Plump and juicy golden raisins.' },
  { name: 'Walnut Kernels (250g)', category: 'Dry Fruits', price: 299, discountPrice: 269, stock: 70, unit: '250g', rating: 4.5, numReviews: 61, description: 'Walnut kernels — brain-boosting omega-3 rich snack.' },
  { name: 'Medjool Dates (500g)', category: 'Dry Fruits', price: 349, discountPrice: 319, stock: 55, unit: '500g', rating: 4.7, numReviews: 72, description: 'Premium soft Medjool dates — naturally sweet energy booster.' },

  // PERSONAL CARE (5)
  { name: 'Dove Moisturising Soap (3x100g)', category: 'Personal Care', price: 189, discountPrice: 169, stock: 100, unit: '3 pack', rating: 4.5, numReviews: 74, description: 'Moisturising beauty soap with 1/4 moisturising cream.' },
  { name: 'Head & Shoulders Anti-Dandruff Shampoo (340ml)', category: 'Personal Care', price: 329, discountPrice: 299, stock: 80, unit: '340ml', rating: 4.4, numReviews: 63, description: 'Clinically proven anti-dandruff shampoo.' },
  { name: 'Colgate MaxFresh Toothpaste (150g)', category: 'Personal Care', price: 99, discountPrice: 89, stock: 120, unit: '150g', rating: 4.5, numReviews: 81, description: 'Cool mint fluoride toothpaste for fresh breath.' },
  { name: 'Nivea Body Lotion Deep Moisture (400ml)', category: 'Personal Care', price: 299, discountPrice: 269, stock: 80, unit: '400ml', rating: 4.6, numReviews: 59, description: '48-hour deep moisture body lotion for soft skin.' },
  { name: 'Gillette Mach3 Razor', category: 'Personal Care', price: 249, discountPrice: 225, stock: 60, unit: 'piece', rating: 4.4, numReviews: 47, description: '3-blade precision shaving razor for a close shave.' },

  // BABY CARE (4)
  { name: 'Pampers Active Baby Diapers Large (36 pcs)', category: 'Baby Care', price: 799, discountPrice: 699, stock: 50, unit: '36 pcs', rating: 4.7, numReviews: 88, description: 'Extra absorbent diapers with up to 12 hours protection.' },
  { name: 'Johnson Baby Talcum Powder (200g)', category: 'Baby Care', price: 185, discountPrice: 169, stock: 80, unit: '200g', rating: 4.5, numReviews: 71, description: 'Gentle baby talc — mild and safe for sensitive skin.' },
  { name: 'Himalaya Gentle Baby Shampoo (400ml)', category: 'Baby Care', price: 249, discountPrice: 219, stock: 70, unit: '400ml', rating: 4.6, numReviews: 63, description: 'Gentle tear-free herbal baby shampoo.' },
  { name: 'Nestle Cerelac Wheat Stage 1 (300g)', category: 'Baby Care', price: 229, discountPrice: 209, stock: 60, unit: '300g', rating: 4.5, numReviews: 54, description: 'Nutritious infant cereal for babies 6 months and above.' },

  // HOUSEHOLD ITEMS (5)
  { name: 'Scotch-Brite Scrub Pads (3 pcs)', category: 'Household Items', price: 79, discountPrice: 69, stock: 100, unit: '3 pcs', rating: 4.4, numReviews: 66, description: 'Heavy duty scrubbing pads for kitchen and utensils.' },
  { name: 'Harpic Power Plus Toilet Cleaner (1L)', category: 'Household Items', price: 149, discountPrice: 129, stock: 90, unit: '1L', rating: 4.5, numReviews: 74, description: '10x cleaning power — kills 99.9% of germs.' },
  { name: 'All Out Mosquito Liquid Refill (45 nights)', category: 'Household Items', price: 125, discountPrice: 109, stock: 100, unit: '45 nights', rating: 4.3, numReviews: 52, description: 'Effective mosquito repellent — 45 nights protection.' },
  { name: 'Tata Iodised Salt (1 kg)', category: 'Household Items', price: 25, discountPrice: 22, stock: 200, unit: 'kg', rating: 4.4, numReviews: 48, description: 'Pure iodised crystal salt for healthy cooking.' },
  { name: 'Prestige Aluminium Pressure Cooker (3L)', category: 'Household Items', price: 899, discountPrice: 799, stock: 30, unit: 'piece', rating: 4.7, numReviews: 91, description: 'Durable aluminium pressure cooker — ISI marked safety valve.', isFeatured: true },

  // CLEANING PRODUCTS (5)
  { name: 'Surf Excel Easy Wash Detergent (1 kg)', category: 'Cleaning Products', price: 119, discountPrice: 99, stock: 100, unit: '1kg', rating: 4.5, numReviews: 83, description: 'Tough stain removing detergent powder.' },
  { name: 'Vim Dishwash Bar Lime (250g)', category: 'Cleaning Products', price: 35, discountPrice: 30, stock: 150, unit: '250g', rating: 4.3, numReviews: 64, description: 'Lime active dishwash bar — removes oil and grease.' },
  { name: 'Colin Glass and Surface Cleaner (500ml)', category: 'Cleaning Products', price: 149, discountPrice: 129, stock: 80, unit: '500ml', rating: 4.4, numReviews: 57, description: 'Streak-free glass cleaner for mirrors and surfaces.' },
  { name: 'Domex Ultra Fresh Floor Cleaner (1L)', category: 'Cleaning Products', price: 165, discountPrice: 145, stock: 80, unit: '1L', rating: 4.3, numReviews: 49, description: 'Kills germs and leaves floors clean and fresh.' },
  { name: 'Tide Plus Double Power Detergent (2 kg)', category: 'Cleaning Products', price: 189, discountPrice: 169, stock: 90, unit: '2kg', rating: 4.4, numReviews: 72, description: 'Double action detergent for bright, clean clothes.' },

  // PET FOOD (4)
  { name: 'Pedigree Adult Dog Food Chicken (3 kg)', category: 'Pet Food', price: 699, discountPrice: 649, stock: 40, unit: '3kg', rating: 4.6, numReviews: 58, description: 'Complete balanced nutrition for adult dogs.' },
  { name: 'Whiskas Adult Cat Food Ocean Fish (1.2 kg)', category: 'Pet Food', price: 549, discountPrice: 499, stock: 35, unit: '1.2kg', rating: 4.5, numReviews: 46, description: 'Ocean fish flavoured dry cat food — complete nutrition.' },
  { name: 'Drools Chicken Dog Treats (100g)', category: 'Pet Food', price: 149, discountPrice: 129, stock: 60, unit: '100g', rating: 4.4, numReviews: 39, description: 'Real chicken training treats for dogs.' },
  { name: 'Royal Canin Kitten Food (400g)', category: 'Pet Food', price: 499, discountPrice: 459, stock: 30, unit: '400g', rating: 4.7, numReviews: 43, description: 'Premium kitten dry food for cats under 12 months.' },
];

const seedDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({ email: { $in: ['admin@freshbasket.com', 'user@freshbasket.com'] } });
    console.log('🗑️  Cleared existing data');

    await Category.insertMany(categories);
    console.log(`✅ ${categories.length} Categories seeded`);

    const categoryIndex = {};
    const productsWithImages = products.map((p) => {
      if (categoryIndex[p.category] === undefined) categoryIndex[p.category] = 0;
      const image = getImg(p.category, categoryIndex[p.category]);
      categoryIndex[p.category]++;
      return { ...p, image };
    });

    await Product.insertMany(productsWithImages);
    console.log(`✅ ${productsWithImages.length} Products seeded`);

    await User.create({ name: 'Admin User', email: 'admin@freshbasket.com', password: 'admin123', role: 'admin' });
    console.log('✅ Admin  → admin@freshbasket.com / admin123');

    await User.create({ name: 'Test User', email: 'user@freshbasket.com', password: 'user123', role: 'user' });
    console.log('✅ User   → user@freshbasket.com / user123');

    console.log('\n🎉 Seeding complete! Total:', productsWithImages.length, 'products across', categories.length, 'categories');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
