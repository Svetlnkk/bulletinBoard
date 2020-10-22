<template>
  <div v-if="!loading">
    <!-- carousel -->
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

    <!-- content -->
    <v-container>
      <v-row>
        <!-- ad list -->
        <v-col
          v-for="ad in ads"
          :key="ad.id"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
        >
          <v-card
            class="d-flex flex-column mx-auto"
            height="100%"
            max-width="400"
          >
            <!-- image -->
            <v-img
              :src="ad.imageSrc"
              class="white--text align-end"
              height="270px"
            >
            </v-img>

            <!-- title -->
            <v-card-title class="mb-auto">
              <h2 class="text-h6">{{ ad.title }}</h2>
            </v-card-title>

            <!-- actions -->
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
    </v-container>
  </div>

  <!-- in loading progress -->
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
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('shared', {
      loading: 'loading',
    }),
    ads() {
      return this.$store.getters.ads;
    },
    promoAds() {
      return this.$store.getters.promoAds;
    },
  },
  created() {
    console.log(this.loading);
  },
  mounted() {
    console.log(this.loading);
  },
  beforeUpdate() {
    console.log(this.loading);
  },
  updated() {
    console.log(this.loading);
    console.log(this.$store.state);
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
