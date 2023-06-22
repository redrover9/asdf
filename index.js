import uniqueRandomArray from 'unique-random-array';
import { MongoClient } from 'mongodb';

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

async function selectVerse() {
  try {
    const database = client.db('sefaria');
    const texts = database.collection('texts');

    const bookQuery = { versionTitle: "Tanakh: The Holy Scriptures, published by JPS", purchaseInformationImage: "https://storage.googleapis.com/sefaria-physical-editions/JPS_1985.png" };

    const bookOptions = {
      sort: { title: 1 },
      projection: { _id: 0, title: 1, chapter: 1 },
    };

    var cursor = texts.find(bookQuery, bookOptions);

    var books = [];
    for await (const book of cursor) {
      books.push(book.title)
    }

    var solution = [];
    const selectedBook = uniqueRandomArray(books);
    solution.push(selectedBook());

    const chapterQuery = { title: solution[0], versionTitle: "Tanakh: The Holy Scriptures, published by JPS", purchaseInformationImage: "https://storage.googleapis.com/sefaria-physical-editions/JPS_1985.png" };
    const chapterOptions = {
      sort: { chapter: 1 },
      projection: { _id: 0, chapter: 1},
    };

    var cursor = texts.find(chapterQuery, chapterOptions);

    var chapters = [];
    for await (const chapter of cursor) {
      chapters.push(chapter.chapter);
    }

    const selectedChapter = uniqueRandomArray(chapters[0]);
    const selectedVerse = uniqueRandomArray(selectedChapter());
    solution.push(selectedVerse());
    solution[1] = solution[1].replace(/<[^>]*>/g, "");
    return solution;

  } finally {
    await client.close();
  }

}

(async () => {
  console.log(await selectVerse())
})()
