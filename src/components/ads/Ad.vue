<template>
    <v-container>
        <v-row>
            <v-col class='col-12 col-sm-10 col-md-10 col-lg-8 col-xl-6 mx-auto'>
                <v-row
                    v-if="!loading && ad"
                    class="ad-main__item col-12 col-sm-11 flex-column mx-auto"
                    >
                    <v-col class="pa-0 mb-1">
                        <h1 class="ad-main__title text--primary font-weight-medium">{{ ad.title }}</h1>
                    </v-col>
                    <v-col class="pt-0">
                        <h3 
                            class="my text-subtitle-2 teal--text text-uppercase"
                            v-if="isOwner"
                        >
                            <v-icon size="small" class="ad-main__circle teal--text">mdi-circle</v-icon>My ad
                        </h3>
                        <h3
                            v-else
                            class="text-subtitle-2"
                        >
                        <span class="text-uppercase">Owner:</span> {{ ownerAd.name ? ownerAd.name : 'No name' }}</h3>
                    </v-col>
                    <v-col class="ad-main__wrapper col-auto pa-0">
                        <img 
                            class="ad-main__image"
                            :src="ad.imageSrc" 
                            :alt="ad.title"
                        >
                        <div 
                            class="ad-main__background"
                            :style="{ backgroundImage: `url('${ad.imageSrc}')`}"
                            >
                        </div>
                    </v-col>
                    <v-col class="pa-2">
                        <div class="ad-main__date text-body-2 text-sm-subtitle-1"><v-icon class="ad-main__icon pr-1 mb-1" color="teal">mdi-currency-usd</v-icon>Price: <span class="text--secondary text-subtitle-2">{{ ad.price ? ad.price : 'not specified' }}</span></div>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col>
                        <p v-for="text in ad.description.split('\n')" :key="text.index">{{ text }}</p>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col class="pa-2">
                        <div class="ad-main__date text-body-2 text-sm-subtitle-1"><v-icon class="ad-main__icon pr-1 mb-1" color="teal">mdi-calendar-clock</v-icon>Ad created: <span class="text--secondary text-subtitle-2">{{ ad.dateAdded }}</span></div>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col class="d-flex justify-end">
                        <app-ad-modal-delete :ad="ad" v-if="isOwner"></app-ad-modal-delete>
                        <app-ad-modal-delete :ad="ad" v-if="isOwner"></app-ad-modal-delete>
                        <app-ad-modal-buy :ad="ad" v-if="!isOwner"></app-ad-modal-buy>
                    </v-col>
                </v-row>

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
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import AdModalEdit from './AdModalEdit'
import AdModalDelete from './AdModalDelete'

export default {

    props: ['id'],
    computed: {
        ad () {
            const id = this.id;
            
            return this.$store.getters.adById(id)
        },
        loading () {
            return this.$store.getters.loading
        },
        isOwner () {
            if(!this.$store.getters.user.id) return
            return this.ad.ownerId === this.$store.getters.user.id
        },
        ownerAd () {
            const ownerId = this.ad.ownerId;
            return this.$store.getters.userById(ownerId)
        },
    },
    components: {
        AppAdModalEdit: AdModalEdit,
        AppAdModalDelete: AdModalDelete,
    },
    beforeUpdate () {
        if (!this.ad) {
            this.$router.replace('/404')
            return
        }
    },
}
</script>

<style scoped lang="scss">
    .ad-main__item {
        border-radius: 4px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    }
    .ad-main__wrapper {
        position: relative;
        z-index: 1;

        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 400px;
        max-width: 100%;
        
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 4px;

        @media (max-width: 599px) {
            max-height: 300px;
            max-width: 100%;
        }
    }

    .ad-main__background {
        position: absolute;

        z-index: -1;
        
        display: block;
        height: 400px;
        width: 100%;

        background: no-repeat center;
        background-size: cover;

        filter: blur(14px);
        opacity: 0.4;
        transform: scale(1.15);

        @media (max-width: 599px) {
            height: 300px;
            width: 100%;
        }
    }

    .ad-main__image {
        display: block;
        max-height: 400px;
        max-width: 100%;

        @media (max-width: 599px) {
            max-height: 100%;
            max-width: 100%;
        }
    }

    .ad-main__circle {
        margin: 0 5px 1px 0;
    }

    .ad-main__title {
        line-height: 1.4;
    }

    .ad-main__icon {
        font-size: 18px;
    }
</style>