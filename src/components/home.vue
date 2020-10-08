<template>
    <div>
        <v-container fluid>
            <v-row>
                <v-col class="col-md-12">
                    <v-carousel>
                        <v-carousel-item
                            v-for="ad in promoAds"
                            :key="ad.id"
                            :src="ad.imageSrc"
                            >
                            <div class="carousel__link">
                                <v-btn
                                text 
                                :to="'/ad/' + ad.id"
                                >
                                {{ ad.title }}</v-btn>
                            </div>
                        </v-carousel-item>
                    </v-carousel>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-row>
                <v-col 
                    class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                    v-for="ad in ads"
                    :key="ad.id"
                >
                    <v-card
                        class="mx-auto"
                        max-width="400"
                    >
                        <v-img
                        class="white--text align-end"
                        height="200px"
                        :src="ad.imageSrc"
                        >
                        </v-img>
                        <v-card-title>
                            {{ ad.title }}
                        </v-card-title>

                        <v-card-text class="text--primary">
                            <p>{{ ad.description }}</p>
                        </v-card-text>
                        
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="teal"
                                :to="'/ad/' + ad.id"
                            >
                                Open
                            </v-btn>

                            <v-btn
                                color="teal"
                                class="white--text"
                                raised
                            >
                                Buy
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    computed: {
        promoAds () {
            return this.$store.getters.promoAds
        },
        ads () {
            return this.$store.getters.ads
        },
    }
}
</script>

<style scoped>
    .carousel__link {
        position: absolute;
        bottom: 50px;
        left: 50%;

        padding: 7px 25px 0;
        border-radius: 35px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        background: rgba(0, 150, 136, .4);

        transform: translate(-50%, 0);
    }
</style>