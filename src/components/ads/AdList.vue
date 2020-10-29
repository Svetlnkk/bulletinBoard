<template>
  <v-container>
    <v-row v-if="!loading && partAds.length !== 0">
      <v-col class="col-12 col-sm-10 col-md-8 col-lg-8 col-xl-6 mx-auto">
        <h1 class="text--secondary mb-3 ml-3">
          {{ `Ad List (${myAds.length + partAds.length})` }}
        </h1>
        <v-row>
          <!-- ad list -->
          <v-col
            v-for="ad of partAds"
            :key="ad.id"
            class="ad-list__item col-11 d-flex flex-column flex-sm-row mb-5 mx-auto py-0"
          >
            <v-row>
              <!-- ad item image -->
              <v-col class="ad-list__wrapper col-auto mr-2 pa-0">
                <img
                  :alt="ad.title"
                  :src="ad.imageSrc"
                  class="ad-list__image"
                />

                <!-- ad item background image -->
                <div
                  :style="{
                    backgroundImage: `url('${ad.imageSrc}')`,
                  }"
                  class="ad-list__background"
                ></div>
              </v-col>

              <!-- ad item content -->
              <v-col
                class="ad-list__content d-flex flex-column justify-space-between pa-3"
              >
                <div class="ad-list__text mb-2">
                  <!-- ad item title -->
                  <h2
                    class="ad-list__title mb-2 text--primary text-subtitle-1 text-lg-h6 font-weight-bold"
                  >
                    {{ ad.title }}
                  </h2>

                  <!-- ad item date -->
                  <div
                    class="ad-list__date mb-1 text-body-2 text-sm-subtitle-1"
                  >
                    <v-icon class="ad-list__icon pr-1 mb-1" color="teal">
                      mdi-calendar-clock
                    </v-icon>
                    Ad created:
                    <span class="text--secondary text-subtitle-2">
                      {{ ad.dateAdded }}
                    </span>
                  </div>

                  <!-- ad item price -->
                  <div
                    class="ad-list__date mb-1 text-body-2 text-sm-subtitle-1"
                  >
                    <v-icon class="ad-list__icon pr-1 mb-1" color="teal">
                      mdi-currency-usd
                    </v-icon>
                    Price:
                    <span class="text--secondary text-subtitle-2">
                      {{ ad.price ? ad.price : 'not specified' }}
                    </span>
                  </div>
                </div>

                <!-- ad item actions -->
                <v-col class="ad-list__buttons d-flex justify-end">
                  <!-- ad item button. link to ad -->
                  <v-btn
                    :to="'/ad/' + ad.id"
                    class="ad-list__button teal white--text mr-sm-2"
                  >
                    Open
                  </v-btn>
                </v-col>
              </v-col>
            </v-row>
          </v-col>

          <v-btn
            v-if="myAds.length"
            block
            @click="getAds(4)"
            class="teal white--text"
          >
            Load more {{ myAds.length }} Ads...
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <!-- if no ads -->
    <v-row v-else-if="!loading && myAds.length === 0">
      <v-col class="col-12 col-sm-8 mx-auto">
        <h1 class="text--secondary">You have no ads</h1>
      </v-col>
    </v-row>

    <!-- loading animation -->
    <v-row v-else>
      <v-col class="col-xs-12 text-center pt-5">
        <v-progress-circular :size="50" :width="4" color="teal" indeterminate>
        </v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      partAds: [],
    };
  },
  computed: {
    ...mapState('shared', ['loading']),
    ...mapGetters('ads', ['myAds']),
  },
  methods: {
    getAds(num) {
      for (let i = 0; i <= num; i++) {
        if (this.myAds.length) this.partAds.push(this.myAds.pop());
      }
    },
  },
  created() {
    this.getAds(4);
  },
};
</script>

<style>
.v-card__title {
  word-break: normal;
}
</style>

<style scoped lang="scss">
.ad-list__item {
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.ad-list__wrapper {
  position: relative;
  z-index: 1;

  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 200px;

  overflow: hidden;

  @media (max-width: 599px) {
    height: 300px;
    width: 100%;
  }
}

.ad-list__background {
  position: absolute;

  z-index: -1;

  display: block;
  height: 200px;
  width: 200px;

  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  filter: blur(14px);
  opacity: 0.4;
  transform: scale(1.15);

  @media (max-width: 599px) {
    height: 300px;
    width: 100%;
  }
}

.ad-list__image {
  display: block;
  max-height: 200px;
  max-width: 200px;

  @media (max-width: 599px) {
    max-height: 100%;
    max-width: 100%;
  }
}
.card__text {
  max-height: 123px;

  overflow: hidden;
}

.ad-list__content {
  flex-grow: 1;
}

.ad-list__icon {
  font-size: 18px;
}

.ad-list__button {
  @media (max-width: 599px) {
    width: 100%;
  }
}
</style>
