<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
	<RouterLink to="/books">
		Books
	</RouterLink>
	<RouterLink to="/authors">
		Authors
	</RouterLink>
	<RouterLink to="/genres">
		Genres
	</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
	display: flex;
	width: 100%;
	height: 5vh;
	background-color: rgb(27, 48, 48);
	justify-content: space-around;
	align-items: center;
}

</style>
