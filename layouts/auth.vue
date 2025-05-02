<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<template>
	<main>
		<ClientOnly>
			<Toaster />
		</ClientOnly>
		<slot />
	</main>
</template>
