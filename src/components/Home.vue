<template>
  <div v-if="!loading">
    <!-- home page carousel  -->
    <v-container fluid class="pt-0">
      <v-row>
        <v-col class="col-md-12 pt-3">
          <v-carousel
            :show-arrows="false"
            class="carousel__home"
            continuous
            cycle
            height="auto"
            hide-delimiters
            interval="5000"
          >
            <v-carousel-item
              v-for="ad in promoAds"
              :key="ad.id"
              :src="ad.imageSrc"
              :to="'/ad/' + ad.id"
              contain
            >
              <!-- background image of home page carousel -->
              <div
                :style="{
                  backgroundImage: `url('${ad.imageSrc}')`,
                }"
                class="carousel__background"
              ></div>
              <div class="carousel__link">
                <v-btn
                  :to="'/ad/' + ad.id"
                  class="carousel__button"
                  large
                  rounded
                  text
                >
                  Открыть</v-btn
                >
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>

    <!-- Filters module -->
    <app-ad-filters
      v-bind:processedAds.sync="processedAds"
      v-bind:shownAds.sync="currentQuantityShownAds"
      :ads="ads"
    ></app-ad-filters>

    <!-- content of home page -->
    <v-container>
      <v-row>
        <!-- ad list of home page -->

        <!-- show part of all ads (params.quantityShownAdsOnMain) -->
        <v-col
          v-for="ad in processedAds.slice(0, this.currentQuantityShownAds)"
          :key="ad.id"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
        >
          <v-card
            class="d-flex flex-column mx-auto"
            height="100%"
            max-width="400"
          >
            <!-- image of home page -->
            <v-img
              :src="ad.imageSrc"
              class="white--text align-end"
              height="270px"
            >
            </v-img>

            <!-- title of home page -->
            <v-card-title class="pb-1">
              <h2 class="text-h6">{{ ad.title }}</h2>
            </v-card-title>

            <!-- price of home page -->
            <v-card-text class="pb-1">
              <h3 class="text-subtitle-2 teal--text text--capitalize">
                <span class="black--text">Цена:</span>
                {{ ad.price }}
              </h3>
            </v-card-text>

            <!-- actions of home page -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :to="'/ad/' + ad.id" text color="teal">
                Открыть
              </v-btn>
              <app-ad-modal-buy :ad="ad"></app-ad-modal-buy>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- button to show next ads -->
      <v-row
        v-if="
          currentQuantityShownAds !== processedAds.length &&
            !(processedAds.length <= params.quantityShownAdsOnMain)
        "
      >
        <v-col
          class="col-12 d-flex flex-column flex-sm-row my-4 mx-auto py-0 px-xl-6 px-lg-3 px-md-6"
        >
          <v-btn block class="green white--text " @click="increaseShownAds">
            Показать больше объявлений
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <!-- loading animation -->
  <div v-else>
    <v-container>
      <v-row>
        <v-col class="col-xs-12 text-center pt-5">
          <v-progress-circular :size="50" :width="4" color="teal" indeterminate>
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AdFilters from './ads/AdFilters';
import params from '../params';

export default {
  name: 'Home',
  components: {
    AppAdFilters: AdFilters,
  },
  data() {
    return {
      params,
      currentQuantityShownAds: params.quantityShownAdsOnMain,
      processedAds: [],
    };
  },
  computed: {
    ...mapState('shared', ['loading']),
    ...mapState('ads', ['ads']),
    ...mapGetters('ads', ['promoAds']),
  },
  methods: {
    // increase number of shown ads
    increaseShownAds() {
      if (
        this.currentQuantityShownAds + params.quantityShownAdsOnMain >
        this.processedAds.length
      ) {
        this.currentQuantityShownAds = this.processedAds.length;
      } else {
        this.currentQuantityShownAds += params.quantityShownAdsOnMain;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.carousel__link {
  position: absolute;
  bottom: 10px;
  left: 50%;
  z-index: 1;

  transform: translate(-50%, 0);
}

.carousel__button {
  background: rgba(0, 150, 136, 0.7);
}

.carousel__home .carousel__background {
  z-index: 0;

  display: block;
  height: 100%;
  width: 100%;

  background-position: center center;
  background-size: cover;

  filter: blur(14px);
  opacity: 0.7;
  transform: scale(1.15);
}
</style>
