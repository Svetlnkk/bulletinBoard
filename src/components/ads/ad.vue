<template>
    <v-container>
        <v-row>
            <v-col class='col-sm-12'>
                <v-card>
                    <v-img
                        :src="ad.imageSrc"
                        height="500px"
                        contain
                        ></v-img>
                    <v-card-title>
                        <h1>{{ ad.title }}</h1>
                    </v-card-title>
                    <v-card-text>
                        <p>{{ ad.description }}</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="orange white--text">Edit</v-btn>
                        <v-btn class="teal white--text">Buy</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['id'],
    computed: {
        ad () {
            const id = this.id;
            return this.$store.getters.adById(id)
        }
    }
}
</script>