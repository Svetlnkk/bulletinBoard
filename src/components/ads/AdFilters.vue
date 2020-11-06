<template>
  <v-container class="py-0">
    <v-row class="ad-filters__row mx-3 mx-lg-0 mx-xl-3">
      <v-col class="col-4">
        <v-row>
          <v-col class="pt-0 pb-1">
            <h3 class="text-subtitle-2 teal--text text-uppercase">
              Search ads by word:
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-9 pt-0 pb-1">
            <v-text-field
              v-model.trim="inputSearch"
              clearable
              color="teal"
              counter="30"
              dense
              label="Search"
              name="search"
              outlined
              type="text"
              @click:clear="clearProcessedAds()"
              @keydown.enter="updateProcessedAds(filteredAdsByWords)"
              @keydown.esc="clearProcessedAds()"
            ></v-text-field>
          </v-col>
          <v-col class="col-2 pt-0 pl-0">
            <v-btn
              class="teal"
              min-height="39"
              @click="updateProcessedAds(filteredAdsByWords)"
            >
              <v-icon text class="white--text">mdi-magnify</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="col-4">
        <v-row>
          <v-col class="pt-0 pb-1">
            <h3 class="text-subtitle-2 teal--text text-uppercase">
              Sort ads by price:
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col-6 py-0">
            <v-text-field
              v-model="minPrice"
              color="teal"
              counter="20"
              clearable
              dense
              label="From"
              type="number"
              @input="filteredAdsByPrice()"
            ></v-text-field>
          </v-col>
          <v-col class="col-6 py-0">
            <v-text-field
              v-model="maxPrice"
              color="teal"
              counter="20"
              clearable
              dense
              label="To"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="pt-0 pb-1">
            <h3 class="text-subtitle-2 teal--text text-uppercase">
              Sort ads by condition:
            </h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-select
              v-model="selectedSelectFilter"
              dense
              outlined
              color="teal"
              :items="itemsSelectFilter"
              @change="updateProcessedAds(sortAds(selectedSelectFilter))"
            >
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center pb-0 teal--text">
        <p class="text-uppercase mb-0" v-if="this.processedAds !== ads">
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
      itemsSelectFilter: [
        'Alphabet a -> z',
        'Reverse alphabet z -> a',
        'Data new -> old',
        'Data old -> new',
      ],
      selectedSelectFilter: 'Alphabet a -> z',
      maxPrice: null,
      minPrice: null,
    };
  },
  computed: {
    filteredAdsByWords() {
      if (!this.inputSearch) return this.ads;
      return this.ads.filter((ad) => {
        return (
          ad.title.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1
        );
      });
    },
    filteredAdsByPrice() {
      if ((!this.maxPrice && !this.minPrice) || this.maxPrice > this.minPrice) {
        return this.processedAds;
      }

      return this.processedAds.filter((ad) => {
        if (this.minPrice && this.maxPrice)
          return ad.price >= this.minPrice && ad.price <= this.minPrice;
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
      if (sortType === 'Alphabet a -> z') {
        return [...this.ads].sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortType === 'Reverse alphabet z -> a') {
        return [...this.ads].sort((a, b) => b.title.localeCompare(a.title));
      } else if (sortType === 'Data old -> new') {
        return [...this.ads].sort(
          (a, b) => dateParse(a.dateAdded) - dateParse(b.dateAdded)
        );
      } else if (sortType === 'Data new -> old') {
        return [...this.ads].sort(
          (a, b) => dateParse(b.dateAdded) - dateParse(a.dateAdded)
        );
      }
    },

    updateProcessedAds(arrayAds) {
      return (
        this.$emit('update:processedAds', arrayAds),
        this.$emit('update:shownAds', 12)
      );
    },
    clearProcessedAds() {
      this.inputSearch = '';
      this.updateProcessedAds(this.filteredAdsByWords);
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