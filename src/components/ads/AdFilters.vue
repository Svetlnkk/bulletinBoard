<template>
  <v-container class="py-0">
    <v-row class="ad-filters__row mx-3 mx-lg-0 mx-xl-3">
      <!-- ad filters search by word column-->
      <v-col class="col-4">
        <!-- ad filters search by words title -->
        <v-row>
          <v-col class="pt-0 pb-1">
            <h3 class="text-subtitle-2 teal--text text-uppercase">
              Search ads by word:
            </h3>
          </v-col>
        </v-row>

        <v-row>
          <!-- ad filters search by words input -->
          <v-col class="col-9 pt-0 pr-0 pb-1">
            <v-text-field
              v-model.trim="inputSearch"
              class="rounded-r-0"
              clearable
              color="teal"
              counter="30"
              dense
              filled
              label="Search"
              name="search"
              outlined
              type="text"
              @click:clear="clearFilterWords()"
              @keydown.enter="updateProcessedAds(filteredAdsByWords)"
              @keydown.esc="clearFilterWords()"
            ></v-text-field>
          </v-col>

          <!-- ad filters search by words button -->
          <v-col class="col-2 pt-0 pl-0">
            <v-btn
              class="teal rounded-l-0"
              min-height="40"
              text
              @click="updateProcessedAds(filteredAdsByWords)"
            >
              <v-icon text class="white--text">mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- ad filters search by price column -->
      <v-col class="col-4">
        <!-- ad filters search by price title -->
        <v-row>
          <v-col class="pt-0 pb-1">
            <h3 class="text-subtitle-2 teal--text text-uppercase">
              Sort ads by price:
            </h3>
          </v-col>
        </v-row>

        <v-row>
          <!-- ad filters search by price (min price) input -->
          <v-col class="col-6 py-0">
            <v-text-field
              v-model="minPrice"
              clearable
              color="teal"
              counter="20"
              dense
              height="34"
              label="From"
              type="number"
              @change="updateProcessedAds(filteredAdsByPrice)"
              @input="updateProcessedAdsDelay(700, filteredAdsByPrice)"
            ></v-text-field>
          </v-col>

          <!-- ad filters search by price (max price) input -->
          <v-col class="col-6 py-0">
            <v-text-field
              v-model="maxPrice"
              clearable
              color="teal"
              counter="20"
              dense
              height="34"
              label="To"
              type="number"
              @change="updateProcessedAds(filteredAdsByPrice)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <!-- ad filters sorts -->
      <v-col>
        <!-- ad filters sorts (title) -->
        <v-row>
          <v-col class="pt-0 pb-1">
            <h3 class="text-subtitle-2 teal--text text-uppercase">
              Sort ads by condition:
            </h3>
          </v-col>
        </v-row>

        <!-- ad filters sorts select -->
        <v-row>
          <v-col class="py-0">
            <v-select
              v-model="selectedSelectFilter"
              :items="itemsSelectFilter"
              class="text-body-2 ad-filters__select"
              color="teal"
              dense
              filled
              item-color="teal"
              outlined
              @change="updateProcessedAds(sortAds(selectedSelectFilter))"
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
          v-if="showQuantityFilteredAds"
        >
          {{ quantityFilteredAds }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { dateParse } from '../../helpers/dateParse';

export default {
  name: 'AdFilters',
  props: {
    ads: Array,
    processedAds: Array,
    shownAds: Number,
  },
  data() {
    return {
      inputSearch: '',
      showQuantityFilteredAds: false,
      itemsSelectFilter: [
        'BY ALPHABET: A >>> Z',
        'BY ALPHABET: REVERSE Z >>> A',
        'BY DATA: NEW >>> OLD',
        'BY DATA: OLD >>> NEW',
      ],
      selectedSelectFilter: 'BY DATA: NEW >>> OLD',
      maxPrice: null,
      minPrice: null,
      setTimeoutCounter: null,
    };
  },
  computed: {
    filteredAdsByWords() {
      if (!this.inputSearch) return;
      return this.ads.filter((ad) => {
        return (
          ad.title.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1
        );
      });
    },
    filteredAdsByPrice() {
      if (
        (!this.maxPrice && !this.minPrice) ||
        (this.maxPrice && this.minPrice > this.maxPrice)
      ) {
        return this.processedAds;
      }

      return this.ads.filter((ad) => {
        if (this.minPrice && this.maxPrice)
          return ad.price >= this.minPrice && ad.price <= this.maxPrice;
        if (this.minPrice) return ad.price >= this.minPrice;
        if (this.maxPrice) return ad.price <= this.maxPrice;
      });
    },

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
    sortAds(sortType) {
      if (sortType === 'BY ALPHABET: A >>> Z') {
        return [...this.ads].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortType === 'BY ALPHABET: REVERSE Z >>> A') {
        return [...this.ads].sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortType === 'BY DATA: OLD >>> NEW') {
        return [...this.ads].sort(
          (a, b) => dateParse(a.dateAdded) - dateParse(b.dateAdded)
        );
      } else if (sortType === 'BY DATA: NEW >>> OLD') {
        return [...this.ads].sort(
          (a, b) => dateParse(b.dateAdded) - dateParse(a.dateAdded)
        );
      }
    },

    updateProcessedAdsDelay(delay, arrayAds) {
      if (this.setTimeoutCounter) clearTimeout(this.setTimeoutCounter);

      this.setTimeoutCounter = setTimeout(() => {
        if (!arrayAds) return;
        if (this.inputSearch || this.minPrice || this.maxPrice) {
          this.showQuantityFilteredAds = true;
        } else {
          this.showQuantityFilteredAds = false;
        }
        return (
          this.$emit('update:processedAds', arrayAds),
          this.$emit('update:shownAds', 12)
        );
      }, delay);
    },

    updateProcessedAds(arrayAds) {
      if (!arrayAds) return;
      if (this.inputSearch || this.minPrice || this.maxPrice) {
        this.showQuantityFilteredAds = true;
      } else {
        this.showQuantityFilteredAds = false;
      }
      return (
        this.$emit('update:processedAds', arrayAds),
        this.$emit('update:shownAds', 12)
      );
    },
    clearFilterWords() {
      this.inputSearch = '';
      this.updateProcessedAds(this.sortAds(this.selectedSelectFilter));
    },
  },
  created() {
    this.updateProcessedAds(this.sortAds(this.selectedSelectFilter));
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
