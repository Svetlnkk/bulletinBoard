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
              v-for="ad in sortPromoAds"
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
                  Open</v-btn
                >
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>

    <!-- content of home page -->
    <v-container>
      <v-row>
        <!-- ad list of home page -->

        <!-- show part of all all ads (12) -->
        <v-col
          v-for="ad in sortAds.slice(0, this.shownAds)"
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
            <v-card-title class="mb-auto">
              <h2 class="text-h6">{{ ad.title }}</h2>
            </v-card-title>

            <!-- actions of home page -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :to="'/ad/' + ad.id" text color="teal">
                Open
              </v-btn>
              <app-ad-modal-buy :ad="ad"></app-ad-modal-buy>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- button to show next ads -->
      <v-row v-if="shownAds !== sortAds.length && !(sortAds.length <= 12)">
        <v-col
          class="col-12 d-flex flex-column flex-sm-row my-4 mx-auto py-0 px-xl-6 px-lg-3 px-md-6"
        >
          <v-btn block class="green white--text " @click="increaseShownAds">
            Load more ads
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

export default {
  data() {
    return {
      shownAds: 12,
    };
  },
  computed: {
    ...mapState('shared', ['loading']),
    ...mapState('ads', ['ads']),
    ...mapGetters('ads', ['promoAds']),

    // sort array of all ads by date (newest to oldest)
    sortAds() {
      return [...this.ads].reverse();
    },

    // sort array of promo ads by date (newest to oldest)
    sortPromoAds() {
      return [...this.promoAds].reverse();
    },
  },
  methods: {
    // increase number of shown ads (+5)
    increaseShownAds() {
      if (this.shownAds + 12 > this.sortAds.length) {
        this.shownAds = this.sortAds.length;
      } else {
        this.shownAds += 12;
      }
    },
  },
};
</script>

<style lang="scss">
.v-carousel__item .v-image__image {
  z-index: 1;
}

.v-carousel__item {
  height: 500px !important;

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);

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
