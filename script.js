const books = JSON.parse(localStorage.getItem('books')) || [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    document.addEventListener(RENDER_EVENT, function () {
        renderBooks();
    });

    renderBooks();
});

function addBook() {
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const statusInput = document.getElementById('status');
    const yearInput = document.getElementById('year');

    const title = titleInput.value;
    const author = authorInput.value;
    const status = statusInput.value;
    const year = parseInt(yearInput.value, 10);

    // Validasi tahun harus berupa angka positif
    if (!(/^\d+$/.test(year))) {
        alert('Tahun harus berupa angka positif');
        return;
    }

    const bookObject = {
        id: generateId(),
        title,
        author,
        status,
        year,
    };

    books.push(bookObject);
    saveToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));

    // Reset formulir setelah buku ditambahkan
    titleInput.value = '';
    authorInput.value = '';
    statusInput.value = 'unfinished';
    yearInput.value = '';
}

function generateId() {
    return +new Date();
}

function makeBook(bookObject) {
    const titleElement = document.createElement('h2');
    titleElement.innerText = bookObject.title;

    const authorElement = document.createElement('p');
    authorElement.innerText = `Penulis: ${bookObject.author}`;

    const yearElement = document.createElement('p');
    yearElement.innerText = `Tahun: ${bookObject.year}`;

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('inner');
    innerContainer.append(titleElement, authorElement, yearElement);

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book', 'shadow');
    bookContainer.append(innerContainer);

    if (bookObject.status === 'unfinished') {
        const moveToFinishedButton = createButton('Selesai Dibaca', 'finished', bookObject.id);
        const deleteButton = createButton('Hapus', 'delete', bookObject.id);
        bookContainer.append(moveToFinishedButton, deleteButton);
    } else {
        const moveToUnfinishedButton = createButton('Belum Selesai Dibaca', 'unfinished', bookObject.id);
        const deleteButton = createButton('Hapus', 'delete', bookObject.id);
        bookContainer.append(moveToUnfinishedButton, deleteButton);
    }

    return bookContainer;
}

function createButton(label, status, bookId) {
    const button = document.createElement('button');
    button.innerText = label;
    button.addEventListener('click', function () {
        handleButtonClicked(status, bookId);
    });
    return button;
}

function renderBooks() {
    const unfinishedShelf = document.getElementById('unfinished-shelf');
    const finishedShelf = document.getElementById('finished-shelf');

    unfinishedShelf.innerHTML = '';
    finishedShelf.innerHTML = '';

    for (const bookObject of books) {
        const bookElement = makeBook(bookObject);

        if (bookObject.status === 'unfinished') {
            unfinishedShelf.append(bookElement);
        } else {
            finishedShelf.append(bookElement);
        }
    }
}

function handleButtonClicked(status, bookId) {
    const bookIndex = findBookIndex(bookId);

    if (bookIndex === -1) return;

    const bookToMove = books[bookIndex];

    if (status === 'unfinished' && bookToMove.status === 'finished') {
        // Pindahkan dari Selesai Dibaca ke Belum Selesai Dibaca
        bookToMove.status = 'unfinished';
    } else if (status === 'finished' && bookToMove.status === 'unfinished') {
        // Pindahkan dari Belum Selesai Dibaca ke Selesai Dibaca
        bookToMove.status = 'finished';
    } else if (status === 'delete') {
        // Hapus buku
        books.splice(bookIndex, 1);
    }

    saveToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function saveToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}
