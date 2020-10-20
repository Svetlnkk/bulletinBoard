<template>
<!-- App.vue -->

<v-app>
	<v-navigation-drawer
	app 	
	temporary
	v-model="drawer"
	>
		<v-list>
			<v-list-item
				v-for="(link, i) in links"
				:key="i"
				:to="link.url"
			>
				<v-list-item-icon>
				<v-icon>{{ link.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title v-text="link.title"></v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item
				@click="onLogout"
				v-if="isUserLoggedIn"
			>
				<v-list-item-icon>
					<v-icon>mdi-exit-to-app</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>Logout</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

		</v-list>
	</v-navigation-drawer>

	<v-app-bar app dark class="teal">
	<v-app-bar-nav-icon
		class="hidden-md-and-up"
		@click="drawer = !drawer"
	></v-app-bar-nav-icon>

    <v-toolbar-title>
		<router-link to="/" tag="span" class="pointer">Bulletin Board</router-link>
	</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
		<v-btn 
			text
			v-for="(link, i) in links"
			:key="i"
			:to="link.url"
		>
		<v-icon left>{{ link.icon }}</v-icon>
			{{ link.title }}
		</v-btn>
		<v-btn
			@click="onLogout"
			text
			v-if="isUserLoggedIn"
		>
		<v-icon left>mdi-exit-to-app</v-icon>
			Logout
		</v-btn>
	</v-toolbar-items>
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
	<v-main>
		<router-view></router-view>
	</v-main>
		
	<template v-if="error">
			<v-snackbar
				color="error"
				:timeout="10000"
				@click.native="closeError"
				:value="true"
				class="snackbar__mobile"
				>
				{{ error }}
				<template v-slot:action>
				<v-btn
					class="white--text"
					text
					@click.native="closeError"
					>
					Close
				</v-btn>
				</template>
			</v-snackbar>
	</template>

</v-app>
</template>

<script>
export default {
	data () {
		return {
			drawer: false,
		}
	},
	computed: {
		error () {
			return this.$store.getters.error
		},
		isUserLoggedIn () {
			return this.$store.getters.isUserLoggedIn
		},
		links () {
			if(this.isUserLoggedIn) {
				return [
					{title: "Orders", icon: "mdi-bookmark-multiple-outline", url: "/orders"},
					{title: "New ad", icon: "mdi-file-plus", url: "/new"},
					{title: "My ads", icon: "mdi-format-list-bulleted-square", url: "/list"},
					{title: "Account", icon: "mdi-face", url: "/account"},
				]
			} else {
				return [
				{title: "Login", icon: "mdi-lock", url: "/login"},
				{title: "Registration", icon: "mdi-face", url: "/registration"},
				]
				
			}
		}
	},
	methods: {
		closeError () {
			this.$store.dispatch('clearError')
		},
		onLogout () {
			this.$store.dispatch('logoutUser')
			if (this.$route.path !== '/') this.$router.push('/')
		}
	}
};
</script>

<style>
.snackbar__mobile .v-snack__wrapper {
	min-width: 270px;
}
</style>

<style scoped>
.pointer {
	cursor: pointer;
}
</style>