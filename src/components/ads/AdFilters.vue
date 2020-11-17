<template>
  <v-container class="py-0">
    <v-row class="ad-filters__row mx-3 mx-lg-0 mx-xl-3">
      <!-- ad filters search by word column-->
      <v-col class="col-12 col-sm-6 col-md-4">
        <!-- ad filters search by word title -->
        <v-row>
          <v-col class="pt-0 pb-1 col-lg-9 mx-auto">
            <h3
              class="text-center text-md-left text-subtitle-2 teal--text text-uppercase"
            >
              Search ads by word:
            </h3>
          </v-col>
        </v-row>

        <v-row>
          <!-- ad filters search by word input -->
          <v-col class="col-12 pt-0 pb-1 col-lg-9 mx-auto">
            <v-text-field
              v-model.trim="inputSearch"
              :error-messages="searchByWordErrors"
              clearable
              color="teal"
              counter="30"
              dense
              filled
              label="Search"
              name="searchByWord"
              outlined
              type="text"
              @change="updateProcessedAds(processingAds())"
              @input="
                $v.inputSearch.$touch(),
                  updateProcessedAdsDelay(700, processingAds())
              "
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <!-- ad filters search by price column -->
      <v-col
        class="col-12 col-sm-9 mx-sm-auto col-md-4 pt-md-4 pt-0 order-1 order-md-0"
      >
        <!-- ad filters search by price title -->
        <v-row>
          <v-col class="pt-0 pb-0 pb-md-1">
            <h3
              class="text-center text-md-left text-subtitle-2 teal--text text-uppercase"
            >
              Sort ads by price:
            </h3>
          </v-col>
        </v-row>

        <v-row>
          <!-- ad filters search by price (min price) input -->
          <v-col class="col-6 py-0">
            <v-text-field
              v-model="minPrice"
              :error-messages="searchByminPriceErrors"
              clearable
              color="teal"
              counter="20"
              dense
              height="34"
              label="From"
              name="minPrice"
              type="number"
              @change="updateProcessedAds(processingAds())"
              @input="
                $v.minPrice.$touch(),
                  updateProcessedAdsDelay(700, processingAds())
              "
            ></v-text-field>
          </v-col>

          <!-- ad filters search by price (max price) input -->
          <v-col class="col-6 py-0">
            <v-text-field
              v-model="maxPrice"
              :error-messages="searchBymaxPriceErrors"
              clearable
              color="teal"
              counter="20"
              dense
              height="34"
              label="To"
              name="maxPrice"
              type="number"
              @change="updateProcessedAds(processingAds())"
              @input="
                $v.maxPrice.$touch(),
                  updateProcessedAdsDelay(700, processingAds())
              "
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <!-- ad filters sorts -->
      <v-col class="col-12 py-0 col-sm-6 col-md-4 py-sm-3 ">
        <!-- ad filters sorts (title) -->
        <v-row>
          <v-col class="pt-0 pb-1 col-lg-9 mx-auto">
            <h3
              class="text-center text-md-left text-subtitle-2 teal--text text-uppercase"
            >
              Sort ads by condition:
            </h3>
          </v-col>
        </v-row>

        <!-- ad filters sorts select -->
        <v-row>
          <v-col class="py-0 col-lg-9 mx-auto">
            <v-select
              v-model="selectedSelectSort"
              :items="itemsSelectFilter"
              class="text-body-2 ad-filters__select"
              color="teal"
              dense
              filled
              item-color="teal"
              name="sort"
              outlined
              @change="updateProcessedAds(processingAds())"
            >
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- show quantity filtered (only) ads -->
    <v-row>
      <v-col class="d-flex justify-center pb-0 teal--text">
        <!-- prettier-ignore -->
        <p
          class="text-uppercase mb-0"
          v-if="displayQuantityFilteredAds"
        >
          {{ quantityFilteredAds }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { dateParse } from '../../helpers/dateParse';
import { validationMixin } from 'vuelidate';
import { maxLength } from 'vuelidate/lib/validators';
import {
  hasMaxMoreMinPrice,
  hasMinLessMaxPrice,
} from '../../validators/filters';

export default {
  name: 'AdFilters',
  mixins: [validationMixin],
  validations: {
    inputSearch: {
      maxLength: maxLength(30),
    },
    maxPrice: {
      maxLength: maxLength(20),
      hasMaxMoreMinPrice,
    },
    minPrice: {
      maxLength: maxLength(20),
      hasMinLessMaxPrice,
    },
  },
  props: {
    ads: Array,
    processedAds: Array,
    shownAds: Number,
  },

  data() {
    return {
      inputSearch: '',
      displayQuantityFilteredAds: false,
      itemsSelectFilter: [
        'BY ALPHABET: A >>> Z',
        'BY ALPHABET: REVERSE Z >>> A',
        'BY DATA: NEW >>> OLD',
        'BY DATA: OLD >>> NEW',
      ],
      selectedSelectSort: 'BY DATA: NEW >>> OLD',
      maxPrice: null,
      minPrice: null,
      timeoutCounterProcessedAds: null,
    };
  },
  computed: {
    // VUELIDATE. rules on search by max price input
    searchBymaxPriceErrors() {
      const errors = [];
      if (!this.$v.maxPrice.$dirty) return errors;
      !this.$v.maxPrice.maxLength && errors.push('Input max 20 digits');
      !this.$v.maxPrice.hasMaxMoreMinPrice && errors.push('Error! max < min');
      return errors;
    },

    // VUELIDATE. rules on search by min price input
    searchByminPriceErrors() {
      const errors = [];
      if (!this.$v.minPrice.$dirty) return errors;
      !this.$v.minPrice.maxLength && errors.push('Input max 20 digits');
      !this.$v.minPrice.hasMinLessMaxPrice && errors.push('Error! min > max');
      return errors;
    },

    // VUELIDATE. rules on search by word input
    searchByWordErrors() {
      const errors = [];
      if (!this.$v.inputSearch.$dirty) return errors;
      !this.$v.inputSearch.maxLength &&
        errors.push(
          'input search by word must be equal or less than 30 characters'
        );
      return errors;
    },

    // filter of ads by word
    filterAdsByWord() {
      if (this.$v.$invalid) return;
      if (!this.inputSearch) {
        return this.ads;
      }
      if (!this.inputSearch) return;

      return this.ads.filter((ad) => {
        return (
          ad.title.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1
        );
      });
    },

    // return quantity of all filtered ads
    quantityFilteredAds() {
      if (this.processedAds.length > 1) {
        return `found ${this.processedAds.length} ads`;
      } else if (this.processedAds.length === 1) {
        return `found ${this.processedAds.length} ad`;
      } else {
        return 'ads not found';
      }
    },
  },

  methods: {
    // filter of ads by price
    filterAdsByPrice(arrayAds) {
      if (this.$v.$invalid) return;
      if (!this.maxPrice && !this.minPrice) {
        return arrayAds;
      }

      return arrayAds.filter((ad) => {
        if (this.minPrice && this.maxPrice)
          return ad.price >= this.minPrice && ad.price <= this.maxPrice;
        if (this.minPrice) return ad.price >= this.minPrice;
        if (this.maxPrice) return ad.price <= this.maxPrice;
      });
    },

    // processing all ads by filters and sorts
    processingAds() {
      if (this.$v.$invalid) return;

      const filteredByWord = this.filterAdsByWord;

      const filteredByPrice = this.filterAdsByPrice(filteredByWord);

      const sorted = this.sortAds(this.selectedSelectSort, filteredByPrice);

      return sorted;
    },

    // show quantity current filtered and sorted ads
    showQuantityFilteredAds() {
      if (this.inputSearch || this.minPrice || this.maxPrice) {
        this.displayQuantityFilteredAds = true;
      } else {
        this.displayQuantityFilteredAds = false;
      }
    },

    // sort of ads by parameter
    sortAds(sortType, ads) {
      if (sortType === 'BY ALPHABET: A >>> Z') {
        return [...ads].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortType === 'BY ALPHABET: REVERSE Z >>> A') {
        return [...ads].sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortType === 'BY DATA: OLD >>> NEW') {
        return [...ads].sort(
          (a, b) => dateParse(a.dateAdded) - dateParse(b.dateAdded)
        );
      } else if (sortType === 'BY DATA: NEW >>> OLD') {
        return [...ads].sort(
          (a, b) => dateParse(b.dateAdded) - dateParse(a.dateAdded)
        );
      }
    },

    // update to Home.vue 'processedAds' current with processed ads
    updateProcessedAds(arrayAds) {
      if (!arrayAds) return;

      // show quantity of filtered ads on page
      this.showQuantityFilteredAds();

      return (
        this.$emit('update:processedAds', arrayAds),
        this.$emit('update:shownAds', 12)
      );
    },

    // update to Home.vue 'processedAds' with current processed ads. With delay
    updateProcessedAdsDelay(delay, arrayAds) {
      if (this.timeoutCounterProcessedAds)
        clearTimeout(this.timeoutCounterProcessedAds);

      this.timeoutCounterProcessedAds = setTimeout(() => {
        if (!arrayAds) return;

        this.showQuantityFilteredAds();

        return (
          this.$emit('update:processedAds', arrayAds),
          this.$emit('update:shownAds', 12)
        );
      }, delay);
    },
  },

  created() {
    this.updateProcessedAds(this.processingAds());
  },
};
</script>
<style scoped>
.ad-filters__row {
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
</style>
