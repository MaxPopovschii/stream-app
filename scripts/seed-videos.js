const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGODB_URL || 'mongodb://streamapp:streamapp123@localhost:27017/streamapp?authSource=admin';

const sampleVideos = [
  {
    title: "The Future of AI",
    description: "Explore the cutting-edge developments in artificial intelligence and machine learning that are shaping our future.",
    thumbnailUrl: "https://picsum.photos/seed/ai1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 596,
    genre: "technology",
    year: 2024,
    rating: "PG",
    cast: ["Dr. Sarah Chen", "Prof. Michael Roberts"],
    director: "Emma Thompson",
    views: 125000,
    likes: 8500,
    uploadedAt: new Date("2024-01-15"),
    tags: ["AI", "Technology", "Future", "Innovation"]
  },
  {
    title: "Ocean Mysteries",
    description: "Dive deep into the unexplored regions of our oceans and discover the incredible creatures that inhabit them.",
    thumbnailUrl: "https://picsum.photos/seed/ocean1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 654,
    genre: "documentary",
    year: 2024,
    rating: "G",
    cast: ["David Attenborough"],
    director: "James Cameron",
    views: 250000,
    likes: 15000,
    uploadedAt: new Date("2024-02-20"),
    tags: ["Nature", "Ocean", "Documentary", "Wildlife"]
  },
  {
    title: "Space Odyssey 2099",
    description: "A thrilling journey through the cosmos as humanity takes its first steps toward interstellar colonization.",
    thumbnailUrl: "https://picsum.photos/seed/space1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 7200,
    genre: "scifi",
    year: 2024,
    rating: "PG-13",
    cast: ["Chris Pratt", "Zendaya", "Oscar Isaac"],
    director: "Denis Villeneuve",
    views: 500000,
    likes: 42000,
    uploadedAt: new Date("2024-03-10"),
    tags: ["Sci-Fi", "Space", "Adventure", "Future"]
  },
  {
    title: "Comedy Night Special",
    description: "The best stand-up comedy from rising stars and established comedians in one unforgettable night.",
    thumbnailUrl: "https://picsum.photos/seed/comedy1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 3600,
    genre: "comedy",
    year: 2024,
    rating: "R",
    cast: ["Trevor Noah", "Ali Wong", "John Mulaney"],
    director: "Leslie Jones",
    views: 180000,
    likes: 12000,
    uploadedAt: new Date("2024-04-05"),
    tags: ["Comedy", "Stand-up", "Entertainment"]
  },
  {
    title: "Urban Legends",
    description: "Uncover the truth behind the most chilling urban legends from around the world.",
    thumbnailUrl: "https://picsum.photos/seed/horror1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 5400,
    genre: "horror",
    year: 2024,
    rating: "R",
    cast: ["Florence Pugh", "Anya Taylor-Joy"],
    director: "Jordan Peele",
    views: 320000,
    likes: 28000,
    uploadedAt: new Date("2024-05-12"),
    tags: ["Horror", "Mystery", "Thriller", "Suspense"]
  },
  {
    title: "Culinary Masters",
    description: "Follow world-renowned chefs as they compete in the ultimate cooking challenge.",
    thumbnailUrl: "https://picsum.photos/seed/cooking1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: 2700,
    genre: "reality",
    year: 2024,
    rating: "PG",
    cast: ["Gordon Ramsay", "Massimo Bottura", "Dominique Crenn"],
    director: "Anthony Bourdain",
    views: 90000,
    likes: 7500,
    uploadedAt: new Date("2024-06-18"),
    tags: ["Cooking", "Competition", "Food", "Reality"]
  },
  {
    title: "Ancient Civilizations",
    description: "Explore the rise and fall of the greatest civilizations in human history.",
    thumbnailUrl: "https://picsum.photos/seed/history1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    duration: 3300,
    genre: "documentary",
    year: 2024,
    rating: "PG",
    cast: ["Neil deGrasse Tyson"],
    director: "Ken Burns",
    views: 410000,
    likes: 35000,
    uploadedAt: new Date("2024-07-22"),
    tags: ["History", "Documentary", "Education", "Culture"]
  },
  {
    title: "Action Heroes United",
    description: "The world's greatest action heroes team up to save humanity from an alien invasion.",
    thumbnailUrl: "https://picsum.photos/seed/action1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: 8100,
    genre: "action",
    year: 2024,
    rating: "PG-13",
    cast: ["Dwayne Johnson", "Gal Gadot", "Jason Statham", "Michelle Yeoh"],
    director: "James Wan",
    views: 750000,
    likes: 62000,
    uploadedAt: new Date("2024-08-15"),
    tags: ["Action", "Adventure", "Sci-Fi", "Blockbuster"]
  },
  {
    title: "Love in Paris",
    description: "A heartwarming romantic comedy about two strangers who meet by chance in the City of Love.",
    thumbnailUrl: "https://picsum.photos/seed/romance1/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: 6300,
    genre: "romance",
    year: 2024,
    rating: "PG-13",
    cast: ["Timothée Chalamet", "Emma Stone"],
    director: "Richard Curtis",
    views: 380000,
    likes: 31000,
    uploadedAt: new Date("2024-09-08"),
    tags: ["Romance", "Comedy", "Drama", "Paris"]
  },
  {
    title: "The Tech Revolution",
    description: "How technology is transforming every aspect of our lives, from healthcare to education.",
    thumbnailUrl: "https://picsum.photos/seed/tech2/1280/720",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    duration: 1800,
    genre: "technology",
    year: 2024,
    rating: "PG",
    cast: ["Marques Brownlee", "Linus Sebastian"],
    director: "Casey Neistat",
    views: 220000,
    likes: 18000,
    uploadedAt: new Date("2024-10-12"),
    tags: ["Technology", "Innovation", "Future", "Education"]
  }
];

async function seedVideos() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('streamapp');
    const videosCollection = db.collection('videos');
    
    // Clear existing videos
    await videosCollection.deleteMany({});
    console.log('Cleared existing videos');
    
    // Insert sample videos
    const result = await videosCollection.insertMany(sampleVideos);
    console.log(`Inserted ${result.insertedCount} videos`);
    
    // Create indexes
    await videosCollection.createIndex({ title: 'text', description: 'text' });
    await videosCollection.createIndex({ genre: 1 });
    await videosCollection.createIndex({ uploadedAt: -1 });
    await videosCollection.createIndex({ views: -1 });
    console.log('Created indexes');
    
    console.log('\n✅ Database seeded successfully!');
    console.log('Sample videos:');
    sampleVideos.forEach((video, i) => {
      console.log(`${i + 1}. ${video.title} (${video.genre})`);
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedVideos();
