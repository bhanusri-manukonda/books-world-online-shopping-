// Refreshes cover images for books that are already in the database.
// Useful after adding books through the admin panel without a cover URL.
//
// Run:  npm run covers          only books with a missing or generated cover
//       npm run covers -- --all every book in the catalogue
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Book from './models/Book.js';

dotenv.config();
await connectDB();

const generatedCover = (book) =>
  `https://placehold.co/300x420/0e3b34/fffdf8?text=${encodeURIComponent(book.title)}`;

const findRealCover = async (book) => {
  try {
    const url =
      'https://openlibrary.org/search.json' +
      `?title=${encodeURIComponent(book.title)}` +
      `&author=${encodeURIComponent(book.author)}` +
      '&fields=cover_i&limit=1';

    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return null;

    const data = await response.json();
    const coverId = data.docs?.[0]?.cover_i;
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
  } catch (error) {
    return null;
  }
};

const run = async () => {
  const all = process.argv.includes('--all');
  const books = await Book.find({});

  let updated = 0;
  for (const book of books) {
    const needsCover = all || !book.image || book.image.includes('placehold.co');
    if (!needsCover) continue;

    const cover = await findRealCover(book);
    book.image = cover || generatedCover(book);
    await book.save();

    updated += 1;
    console.log(`${cover ? 'cover found ' : 'generated  '} ${book.title}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log(`\nDone. ${updated} book(s) updated.`);
  process.exit();
};

run();
