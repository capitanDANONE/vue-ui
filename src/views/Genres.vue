<script setup>
import { ref, onMounted } from 'vue';

// Reactive variable to store the genres data
const genres = ref([]);

// Reactive variable to store the selected genre for editing
const selectedGenre = ref(null);

// Reactive variable to control the visibility of the edit popup
const showEditPopup = ref(false);

// Reactive variable to control the visibility of the create popup
const showCreatePopup = ref(false);

// Reactive variable to store the new genre data
const newGenre = ref({
  genrename: '',
  genredescr: '',
});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5252/api/genres');
    const data = await response.json();
    genres.value = data; // Store the fetched data in the reactive variable
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Function to open the edit popup and set the selected genre
const openEditPopup = (genre) => {
  selectedGenre.value = { ...genre }; // Create a copy of the genre object
  showEditPopup.value = true;
};

// Function to save the edited genre
const saveEditedGenre = async () => {
  try {
    const response = await fetch(`http://localhost:5252/api/genres`, {
      method: 'PATCH', // Use PUT or PATCH depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedGenre.value),
    });

    if (response.ok) {
      // Update the table with the edited genre
      const updatedGenre = await response.json();
      const index = genres.value.findIndex((genre) => genre.genreid === updatedGenre.genreid);
      if (index !== -1) {
        genres.value[index] = updatedGenre; // Replace the old genre with the updated one
      }
      showEditPopup.value = false; // Close the popup
    } else {
      console.error('Failed to update the genre');
    }
  } catch (error) {
    console.error('Error updating the genre:', error);
  }
};

// Function to open the create popup
const openCreatePopup = () => {
  newGenre.value = {
    genrename: '',
    genredescr: '',
  };
  showCreatePopup.value = true;
};

// Function to create a new genre
const createNewGenre = async () => {
  try {
    const response = await fetch('http://localhost:5252/api/genres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGenre.value),
    });

    if (response.ok) {
      const createdGenre = await response.json();
      genres.value.push(createdGenre); // Add the new genre to the table
      showCreatePopup.value = false; // Close the popup
    } else {
      console.error('Failed to create the genre');
    }
  } catch (error) {
    console.error('Error creating the genre:', error);
  }
};
</script>

<template>
  <div class="genres-table">
    <!-- Button to open the create popup -->
    <button @click="openCreatePopup">Create New Genre</button>

    <table>
      <thead>
        <tr>
          <th>Genre ID</th>
          <th>Genre Name</th>
          <th>Genre Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="genre in genres" :key="genre.genreid">
          <td>{{ genre.genreid }}</td>
          <td>{{ genre.genrename }}</td>
          <td>{{ genre.genredescr }}</td>
          <td>
            <button @click="openEditPopup(genre)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Popup -->
    <div v-if="showEditPopup" class="popup-overlay">
      <div class="popup-content">
        <form @submit.prevent="saveEditedGenre">
          <label for="genrename">Genre Name:</label>
          <input v-model="selectedGenre.genrename" id="genrename" required />

          <label for="genredescr">Genre Description:</label>
          <input v-model="selectedGenre.genredescr" id="genredescr" required />

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
        <form @submit.prevent="createNewGenre">
          <label for="genrename">Genre Name:</label>
          <input v-model="newGenre.genrename" id="genrename" required />

          <label for="genredescr">Genre Description:</label>
          <input v-model="newGenre.genredescr" id="genredescr" required />

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
.genres-table {
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