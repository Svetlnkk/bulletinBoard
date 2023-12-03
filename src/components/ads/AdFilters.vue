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
              Найти объявление:
            </h3>
          </v-col>
        </v-row>

        <!-- ad filters search by word input -->
        <v-row>
          <v-col class="col-12 pt-0 pb-1 col-lg-9 mx-auto">
            <v-text-field
              v-model.trim="inputSearch"
              :error-messages="searchByWordErrors"
              clearable
              color="teal"
              counter="30"
              dense
              filled
              label="Поиск"
              name="searchByWord"
              outlined
              type="text"
              @change="updateProcessedAds(processingAds())"
              @input="inputEventHandler"
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
              Фильтровать по цене:
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
              label="От"
              name="minPrice"
              type="number"
              @change="updateProcessedAds(processingAds())"
              @input="inputEventHandler"
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
              label="До"
              name="maxPrice"
              type="number"
              @change="updateProcessedAds(processingAds())"
              @input="inputEventHandler"
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
              Сортировка объявлений:
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
          v-if="displayQuantityFilteredAds"
          class="text-uppercase mb-0"
        >
          {{ quantityFilteredAds }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { dateParse } from '../../js/helpers/dateParse';
import { validationMixin } from 'vuelidate';
import { validationAdFilters } from '../../js/utils/validationsVuelidate.util';

export default {
  name: 'AdFilters',
  mixins: [validationMixin],
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
        'По алфавиту А-Я',
        'По алфавиту в обратном порядке',
        'Сначала новые',
        'Сначала старые',
      ],
      selectedSelectSort: 'Сначала новые',
      minPrice: null,
      maxPrice: null,
      timeoutCounterProcessedAds: null,
    };
  },
  computed: {
    // VUETIFY. Validation errors
    ...validationAdFilters.errorMessages,

    // filter of ads by word
    filterAdsByWord() {
      if (!this.inputSearch) {
        return this.ads;
      }

      return this.ads.filter((ad) => {
        return (
          ad.title.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1
        );
      });
    },

    // return quantity of all filtered ads
    quantityFilteredAds() {
      if (this.processedAds.length > 1) {
        return `найдено ${this.processedAds.length} объявлений`;
      } else if (this.processedAds.length === 1) {
        return `найдено ${this.processedAds.length} объявление`;
      } else {
        return 'ничего не найдено';
      }
    },
  },

  // VUETIFY. Validations rules
  validations: validationAdFilters.validations,

  created() {
    this.updateProcessedAds(this.processingAds());
  },

  methods: {
    // filter of ads by price
    filterAdsByPrice(arrayAds) {
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
      let sortTypes = {
        'По алфавиту А-Я': function() {
          return [...ads].sort((a, b) => a.title.localeCompare(b.title));
        },
        'По алфавиту в обратном порядке': function() {
          return [...ads].sort((a, b) => b.title.localeCompare(a.title));
        },
        'Сначала старые': function() {
          return [...ads].sort(
            (a, b) => dateParse(a.dateAdded) - dateParse(b.dateAdded)
          );
        },
        'Сначала новые': function() {
          return [...ads].sort(
            (a, b) => dateParse(b.dateAdded) - dateParse(a.dateAdded)
          );
        },
      };

      return sortTypes[sortType]();
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

    // handler of input event of text-fields tag
    inputEventHandler() {
      this.$v.inputSearch.$touch();
      this.updateProcessedAdsDelay(700, this.processingAds());
    },
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
