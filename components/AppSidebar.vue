<script setup lang="ts">
import Sidebar from "./ui/sidebar/Sidebar.vue";
import Separator from "./ui/separator/Separator.vue";
import SidebarContent from "./ui/sidebar/SidebarContent.vue";
import SidebarGroup from "./ui/sidebar/SidebarGroup.vue";
import SidebarGroupContent from "./ui/sidebar/SidebarGroupContent.vue";
import SidebarHeader from "./ui/sidebar/SidebarHeader.vue";
import { Sparkles, LogOut, type LucideProps } from "lucide-vue-next";
import SidebarMenu from "./ui/sidebar/SidebarMenu.vue";
import SidebarMenuItem from "./ui/sidebar/SidebarMenuItem.vue";
import SidebarMenuButton from "./ui/sidebar/SidebarMenuButton.vue";
import SidebarFooter from "./ui/sidebar/SidebarFooter.vue";
import SidebarRail from "./ui/sidebar/SidebarRail.vue";
import Button from "./ui/button/Button.vue"; // assuming you have a Button component

import type { FunctionalComponent } from "vue";

type Item = {
	title: string;
	url: string;
	icon: FunctionalComponent<LucideProps>;
};

const { fullPath, name, email, items } = defineProps<{
	fullPath: string;
	name?: string;
	email?: string;
	items: Item[];
}>();
</script>

<template>
	<Sidebar>
		<SidebarHeader class="p-3">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
					<Sparkles class="h-5 w-5" />
				</div>
				<div class="flex flex-col">
					<span class="text-lg font-bold">Snapverse</span>
					<span class="text-xs text-muted-foreground">Connect & Share</span>
				</div>
			</div>
			<Separator class="my-3" />
			<div class="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
				<div
					class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
					{{ name?.charAt(0).toUpperCase() || "U" }}
				</div>
				<div class="flex flex-1 flex-col">
					<span class="font-medium">{{ name?.split(" ")[0] || "User" }}</span>
					<span class="text-xs text-muted-foreground">@{{ email?.split("@")[0] ||
						"anonymous" }}</span>
				</div>
			</div>
		</SidebarHeader>

		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton as-child :is-active="fullPath === item.url">
								<NuxtLink
:href="item.url"
									class="flex items-center gap-3">
									<component :is="item.icon" class="h-5 w-5" />
									<span>{{ item.title }}</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>

		<SidebarFooter class="p-3">
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton as-child>
						<Button
variant="ghost"
							class="w-full justify-start gap-3 text-destructive hover:text-destructive">
							<LogOut class="h-5 w-5" />
							<span>Logout</span>
						</Button>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>

		<SidebarRail />
	</Sidebar>
</template>
