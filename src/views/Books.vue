<script setup>
import { ref, onMounted } from 'vue';

// Reactive variable to store the books data
const books = ref([]);

// Reactive variable to store the selected book for editing
const selectedBook = ref(null);

// Reactive variable to control the visibility of the edit popup
const showEditPopup = ref(false);

// Reactive variable to control the visibility of the create popup
const showCreatePopup = ref(false);

// Reactive variable to store the new book data
const newBook = ref({
  title: '',
  authorid: 0,
  publishyear: 0,
  genreid: 0,
  amount: 0,
  ISBN: 0,
});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5252/api/books');
    const data = await response.json();
    books.value = data; // Store the fetched data in the reactive variable
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Function to open the edit popup and set the selected book
const openEditPopup = (book) => {
  selectedBook.value = { ...book }; // Create a copy of the book object
  showEditPopup.value = true;
};

// Function to save the edited book
const saveEditedBook = async () => {
  const { isbn, ...new_book } = selectedBook.value;
  try {
    const response = await fetch(`http://localhost:5252/api/books`, {
      method: 'PATCH', // Use PUT or PATCH depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(new_book),
    });

    if (response.ok) {
      // Update the table with the edited book
      const updatedBook = await response.json();
      const index = books.value.findIndex((book) => book.bookid === updatedBook.bookid);
      if (index !== -1) {
        books.value[index] = updatedBook; // Replace the old book with the updated one
      }
      showEditPopup.value = false; // Close the popup
    } else {
      console.error('Failed to update the book');
    }
  } catch (error) {
    console.error('Error updating the book:', error);
  }
};

// Function to open the create popup
const openCreatePopup = () => {
  newBook.value = {
    title: '',
    authorid: 0,
    publishyear: 0,
    genreid: 0,
    amount: 0,
    ISBN: 0,
  };
  showCreatePopup.value = true;
};

// Function to create a new book
const createNewBook = async () => {
  try {
    const response = await fetch('http://localhost:5252/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook.value),
    });

    if (response.ok) {
      const createdBook = await response.json();
      books.value.push(createdBook); // Add the new book to the table
      showCreatePopup.value = false; // Close the popup
    } else {
      console.error('Failed to create the book');
    }
  } catch (error) {
    console.error('Error creating the book:', error);
  }
};
</script>

<template>
  <div class="books-table">
    <!-- Button to open the create popup -->
    <button @click="openCreatePopup">Create New Book</button>

    <table>
      <thead>
        <tr>
          <th>Book ID</th>
          <th>Title</th>
          <th>Author ID</th>
          <th>Publish Year</th>
          <th>ISBN</th>
          <th>Genre ID</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.bookid">
          <td>{{ book.bookid }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.authorid }}</td>
          <td>{{ book.publishyear }}</td>
          <td>{{ book.ISBN }}</td>
          <td>{{ book.genreid }}</td>
          <td>{{ book.amount }}</td>
          <td>
            <button @click="openEditPopup(book)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Popup -->
    <div v-if="showEditPopup" class="popup-overlay">
      <div class="popup-content">
        <form @submit.prevent="saveEditedBook">
          <label for="title">Title:</label>
          <input v-model="selectedBook.title" id="title" required />

          <label for="authorid">Author ID:</label>
          <input v-model="selectedBook.authorid" id="authorid" type="number" required />

          <label for="publishyear">Publish Year:</label>
          <input v-model="selectedBook.publishyear" id="publishyear" type="number" required />

          <label for="ISBN">ISBN:</label>
          <input v-model="selectedBook.ISBN" id="ISBN" type="number" required />

          <label for="genreid">Genre ID:</label>
          <input v-model="selectedBook.genreid" id="genreid" type="number" required />

          <label for="amount">Amount:</label>
          <input v-model="selectedBook.amount" id="amount" type="number" required />

          <div class="popup-buttons">
            <button type="submit">Save</button>
            <button type="button" @click="showEditPopup = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Popup -->
    <div v-if="showCreatePopup" class="popup-overlay">
      <div class="popup-content">
        <form @submit.prevent="createNewBook">
          <label for="title">Title:</label>
          <input v-model="newBook.title" id="title" required />

          <label for="authorid">Author ID:</label>
          <input v-model="newBook.authorid" id="authorid" type="number" required />

          <label for="publishyear">Publish Year:</label>
          <input v-model="newBook.publishyear" id="publishyear" type="number" required />

          <label for="ISBN">ISBN:</label>
          <input v-model="newBook.ISBN" id="ISBN" type="number" required />

          <label for="genreid">Genre ID:</label>
          <input v-model="newBook.genreid" id="genreid" type="number" required />

          <label for="amount">Amount:</label>
          <input v-model="newBook.amount" id="amount" type="number" required />

          <div class="popup-buttons">
            <button type="submit">Create</button>
            <button type="button" @click="showCreatePopup = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.books-table {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

th, td {
  color: rgb(27, 48, 48);
  border: 1px solid rgb(27, 48, 48);
  padding: 12px;
  text-align: left;
}

th {
  background-color: rgb(27, 48, 48);
  font-weight: bold;
  color: rgb(40, 70, 70);
}

button {
  padding: 6px 12px;
  background-color: rgb(27, 48, 48);
  color: rgb(40, 70, 70);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

button:hover {
  background-color: rgb(40, 70, 70);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: rgb(40, 70, 70);
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup-content label {
  color: rgb(27, 48, 48);
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.popup-content input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid rgb(27, 48, 48);
  background-color: rgb(27, 48, 48);
  border-radius: 4px;
  color: rgb(40, 70, 70);
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}
</style>