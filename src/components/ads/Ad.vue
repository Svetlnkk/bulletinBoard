<template>
  <v-container>
    <v-row>
      <v-col class="col-12 col-sm-10 col-md-10 col-lg-8 col-xl-6 mx-auto">
        <v-row
          v-if="loadingAd()"
          class="ad-main__item col-12 col-sm-11 flex-column mx-auto"
        >
          <!-- ad title -->
          <v-col class="pa-0 mb-1">
            <h1
              class="ad-main__title text--primary text-h5 text-sm-h4 font-weight-medium"
            >
              {{ ad.title }}
            </h1>
          </v-col>

          <!-- ad owner -->
          <v-col class="pt-0">
            <h3
              v-if="isOwner"
              class="text-subtitle-2 teal--text text-uppercase"
            >
              <v-icon class="ad-main__circle teal--text" size="small">
                mdi-circle
              </v-icon>
              My ad
            </h3>
            <h3 v-else class="text-subtitle-2">
              <span class="text-uppercase">Owner:</span>
              {{ ownerAdName }}
            </h3>
          </v-col>

          <!-- ad image -->
          <v-col class="ad-main__wrapper col-auto pa-0">
            <img :alt="ad.title" :src="ad.imageSrc" class="ad-main__image" />

            <!-- ad background image of main image -->
            <div
              :style="{
                backgroundImage: `url('${ad.imageSrc}')`,
              }"
              class="ad-main__background"
            ></div>
          </v-col>

          <!-- ad price -->
          <v-col class="pa-2">
            <div class="ad-main__date text-body-2 text-sm-subtitle-1">
              <v-icon class="ad-main__icon pr-1 mb-1" color="teal">
                mdi-currency-usd
              </v-icon>
              Price:
              <span class="text--secondary text-subtitle-2">
                {{ ad.price ? ad.price : 'not specified' }}
              </span>
            </div>
          </v-col>

          <v-divider></v-divider>

          <!-- ad description -->
          <v-col>
            <p
              v-for="text in ad.description.split('\n')"
              :key="text.index"
              class="ad-main__description text-body-2 text-sm-body-1"
            >
              {{ text }}
            </p>
          </v-col>

          <v-divider></v-divider>

          <!-- ad date -->
          <v-col class="pa-2">
            <div class="ad-main__date text-body-2 text-sm-subtitle-1">
              <v-icon class="ad-main__icon pr-1 mb-1" color="teal"
                >mdi-calendar-clock</v-icon
              >Ad created:
              <span class="text--secondary text-subtitle-2">
                {{ ad.dateAdded }}
              </span>
            </div>
          </v-col>

          <v-divider></v-divider>

          <!-- ad actions -->
          <v-col class="d-flex justify-end">
            <!-- modal to delete current ad -->
            <app-ad-modal-delete :ad="ad" v-if="isOwner"></app-ad-modal-delete>

            <!-- modal to edit current ad -->
            <app-ad-modal-edit :ad="ad" v-if="isOwner"></app-ad-modal-edit>

            <!-- modal to buy current ad -->
            <app-ad-modal-buy :ad="ad" v-if="!isOwner"></app-ad-modal-buy>
          </v-col>
        </v-row>

        <!-- loading animation -->
        <v-container v-else>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AdModalEdit from './AdModalEdit';
import AdModalDelete from './AdModalDelete';
import { redirect404 } from '../../js/helpers/redirect404';

export default {
  name: 'Ad',
  components: {
    AppAdModalEdit: AdModalEdit,
    AppAdModalDelete: AdModalDelete,
  },
  props: {
    id: String,
  },
  computed: {
    ...mapGetters('ads', ['adById']),
    ...mapGetters('user', ['userById']),
    ...mapState('shared', ['loading']),
    ...mapState('user', ['currentUser']),

    /**
     * get ad by id
     * @returns {Object}
     */
    ad() {
      return this.adById(this.id);
    },

    /**
     * check. Whether the owner is the current user
     * @returns {Object}
     */
    isOwner() {
      if (!this.currentUser) return;
      return this.ad.ownerId === this.currentUser.id;
    },

    /**
     * get the owner name of this ad
     * @returns {String}
     */
    ownerAdName() {
      const ownerUser = this.userById(this.ad.ownerId);
      const ownerName = ownerUser.name ? ownerUser.name : 'No name';
      return ownerName;
    },
  },

  beforeUpdate() {
    /**
     * 404 page, if ad of this id was not found
     * @params {Boolean}
     */
    this.redirect404(!this.loading && !this.ad);
  },
  created() {
    /**
     * 404 page, if ad of this id was not found
     * @params {Boolean}
     */
    this.redirect404(!this.loading && !this.ad);
  },
  methods: {
    /**
     * 404 page, if ad of this id was not found
     * @params {Boolean}
     */
    redirect404,

    /**
     * checking to 'this.loading' and 'this.ad' for loading
     * @returns {Boolean}
     */
    loadingAd() {
      return !this.loading && this.ad;
    },
  },
};
</script>

<style scoped lang="scss">
.ad-main__item {
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
.ad-main__wrapper {
  position: relative;
  z-index: 1;

  align-items: center;
  display: flex;
  justify-content: center;
  max-height: 400px;
  max-width: 100%;

  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;

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

.ad-main__description,
.ad-main__title {
  word-break: break-word;
}

.ad-main__icon {
  font-size: 18px;
}
</style>
