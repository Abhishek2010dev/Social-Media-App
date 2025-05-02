<template>
  <div>{{ user.name }}</div>
</template>

<script setup>
const user = await useAuthUser();
</script>

<style lang="scss" scoped></style>
