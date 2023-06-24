import uniqueRandomArray from 'unique-random-array';
import { MongoClient } from 'mongodb';

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

async function selectVerse() {
    try {
    await client.connect();
    const database = client.db('sefaria');
    const texts = database.collection('texts');

    const bookQuery = { versionTitle: "Tanakh: The Holy Scriptures, published by JPS", purchaseInformationImage: "https://storage.googleapis.com/sefaria-physical-editions/JPS_1985.png" };

    const bookOptions = {
      sort: { title: 1 },
      projection: { _id: 0, title: 1, chapter: 1 },
    };

    const uniqueBooks = texts.find(bookQuery, bookOptions);
    var books = [];
    for await (const book of uniqueBooks) {
      books.push(book.title)
    }
    var solution = [];
    const selectedBook = uniqueRandomArray(books);
    solution.push(selectedBook());

    const chapterQuery = { title: solution[0], versionTitle: "Tanakh: The Holy Scriptures, published by JPS", purchaseInformationImage: "https://storage.googleapis.com/sefaria-physical-editions/JPS_1985.png" };
    const uniqueChapters = await texts.distinct("chapter", chapterQuery);
    var chapters = [];
    for await (const chapter of uniqueChapters) {
      chapters.push(chapter);
    }

    const selectedChapter = uniqueRandomArray(chapters);
    const selectedVerse = uniqueRandomArray(selectedChapter());
    solution.push(selectedVerse());
    return solution;
  } finally { 
    await client.close();
  }  
}
(async () => {
  console.log(await selectVerse())
})()
