<template>
    <v-container>
        <v-row>
            <v-col class='col-12 col-sm-6 mx-auto'>
                <h1 class="text--secondary mb-3">Ad List</h1>

                <v-card 
                    elevation="12"
                    class="mb-5"
                    v-for="ad in myAds"
                    :key="ad.id"
                    >
                    <v-row>
                        <v-col class="col-sm-4 py-0">
                            <v-img
                                :src="ad.imageSrc"
                                height="100%"
                            >
                            </v-img>
                        </v-col>
                        <v-col class="col-sm-7">
                            <v-card-text class="card__text">
                                <h2 class="text--primary">{{ ad.title }}</h2>
                                <p>{{ ad.description }}</p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn 
                                    class="teal white--text mr-2"
                                    :to="'/ad/' + ad.id"
                                >
                                Open</v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    computed: {
        myAds () {
        return this.$store.getters.myAds
        }
    }
}
</script>

<style scoped>
    .card__text {
        max-height: 123px;

        overflow: hidden;
    }
</style>