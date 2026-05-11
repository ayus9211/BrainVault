const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL).then(async () => {
const db = mongoose.connection;
await db.collection('categories').insertMany([
{ name: 'Web Development', description : 'Learn web development' },
{ name: 'Programming', description: 'Learn programming' },
{ name: 'Data Science', description: 'Learn data science' },
{ name: 'Machine Learning', description: 'Learn machine learning' },
{ name: 'Artificial Intelligence', description: 'Learn artificial intelligence' }
]);
console.log('Categories Added Successfully!');
process.exit();
});