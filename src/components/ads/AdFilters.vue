<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model.trim="inputSearch"
          color="teal"
          counter="30"
          label="Search"
          name="search"
          type="text"
          @input="changeAdSearch()"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'AdFilters',
  props: {
    ads: Array,
    processedAds: Array,
    shownAds: Number,
  },
  data() {
    return {
      title: 'Search and Filters',
      inputSearch: '',
    };
  },
  computed: {
    filteredAds() {
      if (!this.inputSearch) return this.ads;
      return this.ads.filter((ad) => {
        return (
          ad.title.toLowerCase().indexOf(this.inputSearch.toLowerCase()) !== -1
        );
      });
    },
  },
  methods: {
    changeAdSearch() {
      return (
        this.$emit('update:processedAds', this.filteredAds),
        this.$emit('update:shownAds', 12)
      );
    },
  },
  beforeUpdate() {
    this.changeAdSearch();
  },
  created() {
    this.changeAdSearch();
  },
};
</script>
<style scoped></style>
