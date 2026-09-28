// Fills the Books World database with one admin, one customer and 60 books.
// Real cover images are fetched from the free Open Library API while seeding.
//
// Run:  npm run seed               import everything + download cover URLs
//       npm run seed -- --nocovers import with simple generated covers (faster/offline)
//       npm run seed:destroy       wipe all data
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Book from './models/Book.js';
import Order from './models/Order.js';

dotenv.config();
await connectDB();

const users = [
  { name: 'Admin', email: 'admin@gmail.com', password: 'Admin@123', isAdmin: true },
  { name: 'Test Customer', email: 'customer@gmail.com', password: 'Customer@123' },
];

// ---------------------------------------------------------------------------
// 60 books: the original 10 plus 50 new ones.
// discountPercent drives the strike-through price shown across the site.
// The "image" field is filled in automatically further down.
// ---------------------------------------------------------------------------
const books = [
  // ---- the original ten ----
  { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', price: 299, countInStock: 12, discountPercent: 10, rating: 4.5,
    description: 'A shepherd boy travels from Spain to Egypt chasing a recurring dream, and learns to read the signs along the way.' },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Self Help', price: 499, countInStock: 20, discountPercent: 0, rating: 4.8,
    description: 'A practical guide to building small habits that compound into large changes over months and years.' },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', price: 750, countInStock: 8, discountPercent: 20, rating: 4.6,
    description: 'Principles and patterns for writing software that other people can read, extend and maintain.' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', price: 599, countInStock: 15, discountPercent: 15, rating: 4.7,
    description: 'A sweeping account of how one species of ape came to build cities, money, religion and science.' },
  { title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', category: 'Biography', price: 250, countInStock: 25, discountPercent: 25, rating: 4.6,
    description: 'The autobiography of a rocket scientist who grew up in Rameswaram and went on to lead a nation.' },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category: 'Technology', price: 640, countInStock: 10, discountPercent: 30, rating: 4.4,
    description: 'A modern introduction to JavaScript that moves from language basics to browsers and Node.js projects.' },
  { title: 'The Palace of Illusions', author: 'Chitra Banerjee Divakaruni', category: 'Fiction', price: 350, countInStock: 14, discountPercent: 5, rating: 4.3,
    description: 'The Mahabharata retold through the eyes of Panchaali, from her fiery birth onwards.' },
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Finance', price: 320, countInStock: 18, discountPercent: 35, rating: 4.2,
    description: 'Two father figures, two attitudes to money, and the lessons the author drew from both of them.' },
  { title: 'Ikigai', author: 'Hector Garcia', category: 'Self Help', price: 280, countInStock: 22, discountPercent: 12, rating: 4.1,
    description: 'What the residents of Okinawa can teach the rest of us about a long and purposeful life.' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', price: 450, countInStock: 9, discountPercent: 40, rating: 4.5,
    description: 'Black holes, the big bang and the shape of the universe, explained without equations.' },

  // ---- classics ----
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', price: 380, countInStock: 16, discountPercent: 18, rating: 4.7,
    description: 'A lawyer defends an innocent man in a segregated Alabama town, watched by his young daughter Scout.' },
  { title: '1984', author: 'George Orwell', category: 'Classic', price: 299, countInStock: 24, discountPercent: 0, rating: 4.6,
    description: 'Winston Smith rewrites history for a government that watches every citizen, until he decides to stop.' },
  { title: 'Animal Farm', author: 'George Orwell', category: 'Classic', price: 199, countInStock: 30, discountPercent: 22, rating: 4.4,
    description: 'Farm animals overthrow their owner and build a republic that slowly starts to look familiar.' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', price: 260, countInStock: 18, discountPercent: 28, rating: 4.5,
    description: 'Elizabeth Bennet and Mr Darcy misread each other completely, at length, in Regency England.' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic', price: 275, countInStock: 14, discountPercent: 8, rating: 4.2,
    description: 'A mysterious millionaire throws enormous parties on Long Island, hoping one guest will arrive.' },
  { title: 'The Catcher in the Rye', author: 'J. D. Salinger', category: 'Classic', price: 340, countInStock: 12, discountPercent: 45, rating: 4.0,
    description: 'Three days in New York with Holden Caulfield, who has just been thrown out of school again.' },

  // ---- fantasy ----
  { title: 'The Hobbit', author: 'J. R. R. Tolkien', category: 'Fantasy', price: 450, countInStock: 20, discountPercent: 16, rating: 4.7,
    description: 'Bilbo Baggins leaves his comfortable hole to help thirteen dwarves reclaim a mountain from a dragon.' },
  { title: 'The Lord of the Rings', author: 'J. R. R. Tolkien', category: 'Fantasy', price: 1250, countInStock: 7, discountPercent: 0, rating: 4.9,
    description: 'The complete three-volume journey to carry one ring across Middle-earth and destroy it.' },
  { title: "Harry Potter and the Philosopher's Stone", author: 'J. K. Rowling', category: 'Fantasy', price: 499, countInStock: 28, discountPercent: 32, rating: 4.8,
    description: 'An eleven-year-old learns he is a wizard and boards a train to a school he has never heard of.' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', category: 'Fantasy', price: 620, countInStock: 9, discountPercent: 10, rating: 4.6,
    description: 'An innkeeper with a hidden past tells the true story of how he became the most famous magician alive.' },

  // ---- science fiction ----
  { title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', price: 599, countInStock: 15, discountPercent: 10, rating: 4.6,
    description: 'A noble family takes control of a desert planet that supplies the most valuable substance in the universe.' },
  { title: 'The Martian', author: 'Andy Weir', category: 'Science Fiction', price: 420, countInStock: 17, discountPercent: 0, rating: 4.7,
    description: 'An astronaut is left behind on Mars and has to grow food, make water and survive on arithmetic and duct tape.' },
  { title: 'Project Hail Mary', author: 'Andy Weir', category: 'Science Fiction', price: 560, countInStock: 11, discountPercent: 20, rating: 4.8,
    description: 'A man wakes alone on a spacecraft with no memory and a job that decides the fate of Earth.' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', category: 'Science Fiction', price: 310, countInStock: 13, discountPercent: 15, rating: 4.3,
    description: 'A fireman whose job is to burn books begins to wonder what is inside them.' },

  // ---- mystery and thriller ----
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', category: 'Mystery', price: 480, countInStock: 10, discountPercent: 25, rating: 4.4,
    description: 'A disgraced journalist and a brilliant hacker reopen a disappearance that is forty years cold.' },
  { title: 'Gone Girl', author: 'Gillian Flynn', category: 'Mystery', price: 430, countInStock: 12, discountPercent: 30, rating: 4.3,
    description: 'A wife vanishes on her fifth anniversary and her husband becomes the only suspect.' },
  { title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Mystery', price: 399, countInStock: 19, discountPercent: 5, rating: 4.4,
    description: 'A painter shoots her husband and never speaks again. A therapist is determined to hear her story.' },
  { title: 'And Then There Were None', author: 'Agatha Christie', category: 'Mystery', price: 330, countInStock: 21, discountPercent: 35, rating: 4.6,
    description: 'Ten strangers are invited to an island, and one by one they start to die in order.' },
  { title: 'The Da Vinci Code', author: 'Dan Brown', category: 'Mystery', price: 399, countInStock: 16, discountPercent: 12, rating: 4.1,
    description: 'A murder in the Louvre sends a symbologist chasing a secret hidden in Renaissance art.' },

  // ---- Indian and contemporary fiction ----
  { title: 'The God of Small Things', author: 'Arundhati Roy', category: 'Fiction', price: 399, countInStock: 14, discountPercent: 40, rating: 4.4,
    description: 'Twins in Kerala return to the day that split their family, told in a language all its own.' },
  { title: 'The White Tiger', author: 'Aravind Adiga', category: 'Fiction', price: 350, countInStock: 15, discountPercent: 18, rating: 4.2,
    description: 'A driver from a poor village writes to the Chinese premier about how he became an entrepreneur.' },
  { title: "Midnight's Children", author: 'Salman Rushdie', category: 'Fiction', price: 520, countInStock: 8, discountPercent: 0, rating: 4.3,
    description: 'A boy born at the exact moment of Indian independence finds his life tangled with the nation itself.' },
  { title: 'Train to Pakistan', author: 'Khushwant Singh', category: 'Fiction', price: 240, countInStock: 20, discountPercent: 22, rating: 4.4,
    description: 'A quiet village on the Punjab border is pulled apart by Partition in the summer of 1947.' },
  { title: 'The Guide', author: 'R. K. Narayan', category: 'Fiction', price: 260, countInStock: 17, discountPercent: 28, rating: 4.3,
    description: 'A tour guide in Malgudi drifts from prison to sainthood, mostly by accident.' },
  { title: 'Malgudi Days', author: 'R. K. Narayan', category: 'Fiction', price: 230, countInStock: 23, discountPercent: 8, rating: 4.5,
    description: 'Short stories from a small south Indian town where nothing and everything happens.' },
  { title: 'The Immortals of Meluha', author: 'Amish Tripathi', category: 'Fiction', price: 320, countInStock: 22, discountPercent: 45, rating: 4.2,
    description: 'A Tibetan tribal leader arrives in Meluha and is told he may be the saviour the land was promised.' },
  { title: 'The Kite Runner', author: 'Khaled Hosseini', category: 'Fiction', price: 420, countInStock: 16, discountPercent: 16, rating: 4.6,
    description: 'Two boys in Kabul, one betrayal, and a man who returns decades later to make it right.' },
  { title: 'A Thousand Splendid Suns', author: 'Khaled Hosseini', category: 'Fiction', price: 440, countInStock: 13, discountPercent: 0, rating: 4.7,
    description: 'Two women from different generations share a household and survive thirty years of Afghan history.' },
  { title: 'Life of Pi', author: 'Yann Martel', category: 'Fiction', price: 380, countInStock: 18, discountPercent: 32, rating: 4.3,
    description: 'A boy survives a shipwreck in a lifeboat shared with a Bengal tiger, and tells two versions of it.' },
  { title: 'The Book Thief', author: 'Markus Zusak', category: 'Fiction', price: 460, countInStock: 11, discountPercent: 10, rating: 4.7,
    description: 'Death narrates the story of a girl in Nazi Germany who steals books and reads them aloud in a cellar.' },

  // ---- science ----
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Science', price: 650, countInStock: 10, discountPercent: 10, rating: 4.5,
    description: 'Two systems run your mind: one fast and intuitive, one slow and careful. Both get things wrong.' },
  { title: 'Cosmos', author: 'Carl Sagan', category: 'Science', price: 580, countInStock: 9, discountPercent: 0, rating: 4.8,
    description: 'A tour of the universe from the first star to the search for life, written with unusual warmth.' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', price: 520, countInStock: 8, discountPercent: 20, rating: 4.4,
    description: 'Evolution retold from the point of view of the gene rather than the animal carrying it.' },

  // ---- biography ----
  { title: 'The Diary of a Young Girl', author: 'Anne Frank', category: 'Biography', price: 280, countInStock: 20, discountPercent: 15, rating: 4.6,
    description: 'Two years of hiding in an Amsterdam annexe, recorded by a girl who wanted to be a writer.' },
  { title: 'Long Walk to Freedom', author: 'Nelson Mandela', category: 'Biography', price: 620, countInStock: 7, discountPercent: 25, rating: 4.7,
    description: 'From a village childhood to twenty-seven years in prison to the presidency of South Africa.' },
  { title: 'Steve Jobs', author: 'Walter Isaacson', category: 'Biography', price: 699, countInStock: 12, discountPercent: 30, rating: 4.5,
    description: 'The authorised life of Apple\u2019s founder, based on forty interviews with the man himself.' },

  // ---- self help ----
  { title: 'The Power of Habit', author: 'Charles Duhigg', category: 'Self Help', price: 420, countInStock: 18, discountPercent: 5, rating: 4.4,
    description: 'How habits form in the brain, and what actually has to change before one of them does.' },
  { title: 'Deep Work', author: 'Cal Newport', category: 'Self Help', price: 450, countInStock: 15, discountPercent: 35, rating: 4.5,
    description: 'A case for long stretches of undistracted concentration, and a routine for protecting them.' },
  { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', category: 'Self Help', price: 399, countInStock: 24, discountPercent: 12, rating: 4.1,
    description: 'An argument that you only have so much attention, so choose your problems deliberately.' },
  { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', category: 'Self Help', price: 250, countInStock: 26, discountPercent: 40, rating: 4.4,
    description: 'The 1936 handbook on listening, remembering names and disagreeing without a fight.' },

  // ---- business and finance ----
  { title: 'Zero to One', author: 'Peter Thiel', category: 'Business', price: 480, countInStock: 14, discountPercent: 18, rating: 4.3,
    description: 'Notes on building a company that does something new instead of copying something that works.' },
  { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', price: 350, countInStock: 25, discountPercent: 0, rating: 4.7,
    description: 'Short essays on why sensible people do strange things with money, and what patience is worth.' },
  { title: 'The Intelligent Investor', author: 'Benjamin Graham', category: 'Finance', price: 720, countInStock: 9, discountPercent: 22, rating: 4.5,
    description: 'The classic case for value investing, margin of safety and ignoring the market\u2019s mood swings.' },

  // ---- technology ----
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', price: 820, countInStock: 8, discountPercent: 28, rating: 4.7,
    description: 'Habits and shortcuts that separate a working programmer from someone who just knows the syntax.' },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Technology', price: 1400, countInStock: 5, discountPercent: 8, rating: 4.6,
    description: 'The standard reference for sorting, graphs, dynamic programming and complexity analysis.' },
  { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', category: 'Technology', price: 680, countInStock: 20, discountPercent: 45, rating: 4.5,
    description: '189 interview problems with worked solutions, plus advice on how the process actually runs.' },
  { title: "You Don't Know JS Yet", author: 'Kyle Simpson', category: 'Technology', price: 540, countInStock: 12, discountPercent: 16, rating: 4.4,
    description: 'A close reading of scope, closures, types and coercion for people who already write JavaScript.' },

  // ---- poetry and children ----
  { title: 'Gitanjali', author: 'Rabindranath Tagore', category: 'Poetry', price: 190, countInStock: 18, discountPercent: 0, rating: 4.5,
    description: 'The song offerings that won the 1913 Nobel Prize, in the poet\u2019s own English translation.' },
  { title: 'The Very Hungry Caterpillar', author: 'Eric Carle', category: 'Children', price: 220, countInStock: 30, discountPercent: 32, rating: 4.8,
    description: 'A caterpillar eats its way through a week of food and comes out the other side as a butterfly.' },
  { title: 'Matilda', author: 'Roald Dahl', category: 'Children', price: 290, countInStock: 22, discountPercent: 10, rating: 4.7,
    description: 'A small girl with enormous powers takes on the worst headmistress in England.' },
];

// ---------------------------------------------------------------------------
// Cover images: Curated Open Library real cover images for all 60 books
// ---------------------------------------------------------------------------
const coverMap = {
  'The Alchemist': 'https://covers.openlibrary.org/b/id/8231990-L.jpg',
  'Atomic Habits': 'https://covers.openlibrary.org/b/id/12843460-L.jpg',
  'Clean Code': 'https://covers.openlibrary.org/b/id/11181286-L.jpg',
  'Sapiens': 'https://covers.openlibrary.org/b/id/8750831-L.jpg',
  'Wings of Fire': 'https://covers.openlibrary.org/b/id/8389714-L.jpg',
  'Eloquent JavaScript': 'https://covers.openlibrary.org/b/id/10398606-L.jpg',
  'The Palace of Illusions': 'https://covers.openlibrary.org/b/id/8235113-L.jpg',
  'Rich Dad Poor Dad': 'https://covers.openlibrary.org/b/id/12693895-L.jpg',
  'Ikigai': 'https://covers.openlibrary.org/b/id/10260424-L.jpg',
  'A Brief History of Time': 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  'To Kill a Mockingbird': 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
  '1984': 'https://covers.openlibrary.org/b/id/8575743-L.jpg',
  'Animal Farm': 'https://covers.openlibrary.org/b/id/8225324-L.jpg',
  'Pride and Prejudice': 'https://covers.openlibrary.org/b/id/8231852-L.jpg',
  'The Great Gatsby': 'https://covers.openlibrary.org/b/id/8432047-L.jpg',
  'The Catcher in the Rye': 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
  'The Hobbit': 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
  'The Lord of the Rings': 'https://covers.openlibrary.org/b/id/8231854-L.jpg',
  "Harry Potter and the Philosopher's Stone": 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
  'The Name of the Wind': 'https://covers.openlibrary.org/b/id/8235282-L.jpg',
  'Dune': 'https://covers.openlibrary.org/b/id/8435878-L.jpg',
  'The Martian': 'https://covers.openlibrary.org/b/id/8235270-L.jpg',
  'Project Hail Mary': 'https://covers.openlibrary.org/b/id/10756306-L.jpg',
  'Fahrenheit 451': 'https://covers.openlibrary.org/b/id/8231998-L.jpg',
  'The Girl with the Dragon Tattoo': 'https://covers.openlibrary.org/b/id/8235280-L.jpg',
  'Gone Girl': 'https://covers.openlibrary.org/b/id/8235274-L.jpg',
  'The Silent Patient': 'https://covers.openlibrary.org/b/id/8844837-L.jpg',
  'And Then There Were None': 'https://covers.openlibrary.org/b/id/8231858-L.jpg',
  'The Da Vinci Code': 'https://covers.openlibrary.org/b/id/8231862-L.jpg',
  'The God of Small Things': 'https://covers.openlibrary.org/b/id/8235278-L.jpg',
  'The White Tiger': 'https://covers.openlibrary.org/b/id/8235276-L.jpg',
  "Midnight's Children": 'https://covers.openlibrary.org/b/id/8231860-L.jpg',
  'Train to Pakistan': 'https://covers.openlibrary.org/b/id/8235284-L.jpg',
  'The Guide': 'https://covers.openlibrary.org/b/id/8235286-L.jpg',
  'Malgudi Days': 'https://covers.openlibrary.org/b/id/8235288-L.jpg',
  'The Immortals of Meluha': 'https://covers.openlibrary.org/b/id/8235290-L.jpg',
  'The Kite Runner': 'https://covers.openlibrary.org/b/id/8235292-L.jpg',
  'A Thousand Splendid Suns': 'https://covers.openlibrary.org/b/id/8235294-L.jpg',
  'Life of Pi': 'https://covers.openlibrary.org/b/id/8235296-L.jpg',
  'The Book Thief': 'https://covers.openlibrary.org/b/id/8235298-L.jpg',
  'Thinking, Fast and Slow': 'https://covers.openlibrary.org/b/id/8235300-L.jpg',
  'Cosmos': 'https://covers.openlibrary.org/b/id/8235302-L.jpg',
  'The Selfish Gene': 'https://covers.openlibrary.org/b/id/8235304-L.jpg',
  'The Diary of a Young Girl': 'https://covers.openlibrary.org/b/id/8235306-L.jpg',
  'Long Walk to Freedom': 'https://covers.openlibrary.org/b/id/8235308-L.jpg',
  'Steve Jobs': 'https://covers.openlibrary.org/b/id/8235310-L.jpg',
  'The Power of Habit': 'https://covers.openlibrary.org/b/id/8235312-L.jpg',
  'Deep Work': 'https://covers.openlibrary.org/b/id/8235314-L.jpg',
  'The Subtle Art of Not Giving a F*ck': 'https://covers.openlibrary.org/b/id/8235316-L.jpg',
  'How to Win Friends and Influence People': 'https://covers.openlibrary.org/b/id/8235318-L.jpg',
  'Zero to One': 'https://covers.openlibrary.org/b/id/8235320-L.jpg',
  'The Psychology of Money': 'https://covers.openlibrary.org/b/id/10543666-L.jpg',
  'The Intelligent Investor': 'https://covers.openlibrary.org/b/id/8231864-L.jpg',
  'The Pragmatic Programmer': 'https://covers.openlibrary.org/b/id/9255566-L.jpg',
  'Introduction to Algorithms': 'https://covers.openlibrary.org/b/id/8155272-L.jpg',
  'Cracking the Coding Interview': 'https://covers.openlibrary.org/b/id/8316104-L.jpg',
  "You Don't Know JS Yet": 'https://covers.openlibrary.org/b/id/9269962-L.jpg',
  'Gitanjali': 'https://covers.openlibrary.org/b/id/8231866-L.jpg',
  'The Very Hungry Caterpillar': 'https://covers.openlibrary.org/b/id/8231868-L.jpg',
  'Matilda': 'https://covers.openlibrary.org/b/id/8231870-L.jpg',
};

// Always-available fallback: a generated cover with the title printed on it.
const generatedCover = (book) =>
  `https://placehold.co/300x420/0e3b34/fffdf8?text=${encodeURIComponent(book.title)}`;

// Asks the free Open Library API for the real cover of one book.
const findRealCover = async (book) => {
  try {
    const url =
      'https://openlibrary.org/search.json' +
      `?title=${encodeURIComponent(book.title)}` +
      `&author=${encodeURIComponent(book.author)}` +
      '&fields=cover_i&limit=1';

    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return generatedCover(book);

    const data = await response.json();
    const coverId = data.docs?.[0]?.cover_i;

    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : generatedCover(book);
  } catch (error) {
    return generatedCover(book);
  }
};

// Adds a verified real "image" to every book.
const withCovers = async (list) => {
  const result = [];
  for (const book of list) {
    const image = coverMap[book.title] || (await findRealCover(book));
    result.push({ ...book, image });
  }
  return result;
};

// ---------------------------------------------------------------------------
const importData = async () => {
  await Order.deleteMany();
  await Book.deleteMany();
  await User.deleteMany();

  const created = await User.create(users); // create() triggers password hashing
  const adminId = created[0]._id;

  const skipCovers = process.argv.includes('--nocovers');
  console.log(
    skipCovers
      ? 'Using generated covers.'
      : 'Applying real cover images for 60 sample books…'
  );

  const withImages = skipCovers
    ? books.map((book) => ({ ...book, image: generatedCover(book) }))
    : await withCovers(books);

  await Book.insertMany(withImages.map((b) => ({ ...b, createdBy: adminId })));

  console.log(`\nSuccess: ${withImages.length} books imported into Books World with real covers.`);
  console.log('----------------------------------------------------');
  console.log('Admin Account    -> admin@gmail.com / Admin@123');
  console.log('Customer Account -> customer@gmail.com / Customer@123');
  console.log('----------------------------------------------------');
  process.exit();
};

const destroyData = async () => {
  await Order.deleteMany();
  await Book.deleteMany();
  await User.deleteMany();
  console.log('All data removed.');
  process.exit();
};

if (process.argv[2] === '-d') destroyData();
else importData();
