<template>
  <div>
    <h1>Create a New Post</h1>
    <form action="/api/posts" method="POST" enctype="multipart/form-data">
      <div>
        <label for="caption">Caption:</label>
        <input id="caption" type="text" name="caption" required>
      </div>
      <div>
        <label for="location">Location:</label>
        <input id="location" type="text" name="location" required>
      </div>
      <div>
        <label for="tags">Tags (comma-separated):</label>
        <input id="tags" type="text" name="tags" required>
      </div>
      <div>
        <label for="image">Upload Image:</label>
        <input id="image" type="file" name="image" accept="image/jpeg, image/png, image/gif" required>
      </div>
      <div>
        <button type="submit">Submit Post</button>
      </div>
    </form>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
