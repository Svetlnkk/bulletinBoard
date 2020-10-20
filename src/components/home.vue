<template>
    <div v-if="!loading">
        <v-container fluid class="pt-0">
            <v-row>
                <v-col class="col-md-12 pt-3">
                    <v-carousel
                        continuous
                        height="auto"
                        cycle interval="5000"
                        :show-arrows="false"
                        hide-delimiters
                        class="carousel__home">
                        <v-carousel-item
                            contain
                            :to="'/ad/' + ad.id"
                            v-for="ad in promoAds"
                            :key="ad.id"
                            :src="ad.imageSrc"
                            >
                            <div
                                class="carousel__background"
                                :style="{ backgroundImage: `url('${ad.imageSrc}')`}"
                            >
                            </div>
                            <div class="carousel__link">
                                <v-btn
                                    class="carousel__button"
                                    rounded
                                    large
                                    text 
                                    :to="'/ad/' + ad.id"
                                >
                                Open</v-btn>
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
                        class="d-flex flex-column mx-auto"
                        height="100%"
                        max-width="400"
                    >
                        <v-img
                        class="white--text align-end"
                        height="270px"
                        :src="ad.imageSrc"
                        >
                        </v-img>

                        <v-card-title class="mb-auto">
                            <h2 class="text-h6">{{ ad.title }}</h2>
                        </v-card-title>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="teal"
                                :to="'/ad/' + ad.id"
                            >
                                Open
                            </v-btn>
                            <app-buy-modal :ad="ad"></app-buy-modal>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <div v-else>
        <v-container>
            <v-row>
                <v-col class="col-xs-12 text-center pt-5">
                    <v-progress-circular
                    :size="50"
                    :width="4"
                    color="teal"
                    indeterminate
                    >
                    </v-progress-circular>
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
        loading () {
            return this.$store.getters.loading
        },
    }
}
</script>

<style lang="scss">
    .v-carousel__item .v-image__image {
        z-index: 1;
    }

    .v-carousel__item {
        height: 500px !important;

        border: 1px solid rgba(0, 0, 0, .12);
        border-radius: 4px;

        @media (max-width: 599px) {
            height: 270px !important;
        }
    }
</style>

<style scoped lang="scss">
    .carousel__link {
        position: absolute;
        bottom: 10px;
        left: 50%;
        z-index: 1;

        transform: translate(-50%, 0);
    }

    .carousel__button {
        background: rgba(0, 150, 136, .7);
    }

    .carousel__home .carousel__background {
        z-index: 0;

        display: block;
        width: 100%;
        height: 100%;
        
        background-position: center center;
        background-size: cover;
        
        filter: blur(14px);
        opacity: 0.7;
        transform: scale(1.15);
    }
</style>