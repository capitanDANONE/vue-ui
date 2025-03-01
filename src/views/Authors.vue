<script setup>
import { ref, onMounted } from 'vue';

const authors = ref([]);
const selectedAuthor = ref(null);
const showEditPopup = ref(false);
const showCreatePopup = ref(false);
const newAuthor = ref({
  authorname: '',
  author2ndname: '',
  dob: '',
});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5252/api/authors');
    const data = await response.json();
    authors.value = data; // Store the fetched data in the reactive variable
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Function to open the edit popup and set the selected author
const openEditPopup = (author) => {
  selectedAuthor.value = { ...author }; // Create a copy of the author object
  showEditPopup.value = true;
};

// Function to save the edited author
const saveEditedAuthor = async () => {
  try {
    const response = await fetch(`http://localhost:5252/api/authors`, {
      method: 'PATCH', // Use PUT or PATCH depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedAuthor.value),
    });

    if (response.ok) {
      // Update the table with the edited author
      const updatedAuthor = await response.json();
      const index = authors.value.findIndex((author) => author.authorid === updatedAuthor.authorid);
      if (index !== -1) {
        authors.value[index] = updatedAuthor; // Replace the old author with the updated one
      }
      showEditPopup.value = false; // Close the popup
    } else {
      console.error('Failed to update the author');
    }
  } catch (error) {
    console.error('Error updating the author:', error);
  }
};

// Function to open the create popup
const openCreatePopup = () => {
  newAuthor.value = {
    authorname: '',
    author2ndname: '',
    dob: '',
  };
  showCreatePopup.value = true;
};

// Function to create a new author
const createNewAuthor = async () => {
  try {
    const response = await fetch('http://localhost:5252/api/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAuthor.value),
    });

    if (response.ok) {
      const createdAuthor = await response.json();
      authors.value.push(createdAuthor); // Add the new author to the table
      showCreatePopup.value = false; // Close the popup
    } else {
      console.error('Failed to create the author');
    }
  } catch (error) {
    console.error('Error creating the author:', error);
  }
};

// Function to delete an author
const deleteAuthor = async (authorId) => {
  try {
    const response = await fetch(`http://localhost:5252/api/authors/${authorId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted author from the table
      authors.value = authors.value.filter((author) => author.authorid !== authorId);
    } else {
      console.error('Failed to delete the author');
    }
  } catch (error) {
    console.error('Error deleting the author:', error);
  }
};
</script>

<template>
  <div class="authors-table">
    <!-- Button to open the create popup -->
    <button @click="openCreatePopup">Create New Author</button>

    <table>
      <thead>
        <tr>
          <th>Author ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date of Birth</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author.authorid">
          <td>{{ author.authorid }}</td>
          <td>{{ author.authorname }}</td>
          <td>{{ author.author2ndname }}</td>
          <td>{{ author.dob }}</td>
          <td>
            <button @click="openEditPopup(author)">Edit</button>
            <button @click="deleteAuthor(author.authorid)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Popup -->
    <div v-if="showEditPopup" class="popup-overlay">
      <div class="popup-content">
        <form @submit.prevent="saveEditedAuthor">
          <label for="authorname">First Name:</label>
          <input v-model="selectedAuthor.authorname" id="authorname" required />

          <label for="author2ndname">Last Name:</label>
          <input v-model="selectedAuthor.author2ndname" id="author2ndname" required />

          <label for="dob">Date of Birth:</label>
          <input v-model="selectedAuthor.dob" id="dob" type="date" required />

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
        <form @submit.prevent="createNewAuthor">
          <label for="authorname">First Name:</label>
          <input v-model="newAuthor.authorname" id="authorname" required />

          <label for="author2ndname">Last Name:</label>
          <input v-model="newAuthor.author2ndname" id="author2ndname" required />

          <label for="dob">Date of Birth:</label>
          <input v-model="newAuthor.dob" id="dob" type="date" required />

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
.authors-table {
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

.popup-content h2 {
  margin-top: 0;
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