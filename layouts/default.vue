<script setup lang="ts">
import AppSidebar from "~/components/AppSidebar.vue";
import SidebarInset from "~/components/ui/sidebar/SidebarInset.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
import { Home, Image, Users, Save, ImagePlus } from "lucide-vue-next";

const route = useRoute();

const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Explore",
		url: "/explore",
		icon: Image,
	},
	{
		title: "People",
		url: "/people",
		icon: Users,
	},
	{
		title: "Saved",
		url: "/saved",
		icon: Save,
	},
	{
		title: "Create Post",
		url: "/create",
		icon: ImagePlus,
	},
];

const authUserData = useAuthUserData();

const title = computed(() => {
	return items.filter((v) => v.url === route.fullPath)[0].title;
});
</script>

<template>
	<SidebarProvider>
		<AppSidebar :full-path="route.fullPath" :name="authUserData.data?.name"
			:email="authUserData.data?.email" :items="items" />
		<SidebarInset>
			<header class="flex h-16 items-center border-b px-4">
				<SidebarTrigger class="mr-2" />
				<h1 className="text-xl font-semibold">{{ title }}</h1>
			</header>
			<main className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 p-4">
				<slot />
			</main>
		</SidebarInset>
	</SidebarProvider>
</template>
