<template>
  <v-container>
    <v-row>
      <v-col class="col-sm-8 col-lg-6 mx-auto">
        <h1 class="text--secondary mb-3">Create new ad</h1>

        <!-- form new ad -->
        <v-form ref="form" v-model="valid">
          <!-- input title of new ad -->
          <v-text-field
            v-model="title"
            :rules="titleRules"
            color="teal"
            counter="60"
            label="Ad title"
            name="title"
            required
            type="text"
            validate-on-blur
          >
          </v-text-field>

          <!-- input description of new ad -->
          <v-textarea
            v-model="description"
            :rules="descriptionRules"
            color="teal"
            counter="1000"
            label="Ad description"
            name="description"
            type="text"
            validate-on-blur
          >
          </v-textarea>

          <!-- input the price of new ad -->
          <v-text-field
            v-model="price"
            :rules="priceRules"
            color="teal"
            counter="20"
            label="Price"
            name="price"
            type="number"
            validate-on-blur
          >
          </v-text-field>
        </v-form>

        <!-- actions -->
        <v-row>
          <!-- upload image -->
          <v-col>
            <v-btn
              class="my-2 white--text mt-3"
              color="blue-grey"
              @click="triggerUpload"
            >
              Upload
              <v-icon dark right>
                mdi-cloud-upload
              </v-icon>
            </v-btn>
            <input
              ref="fileInput"
              accept="image/*"
              style="display: none;"
              type="file"
              @change="onFileChange"
            />
          </v-col>

          <!-- switch promo of new ad -->
          <v-col>
            <v-switch v-model="promo" color="teal" inset label="Add to promo?">
            </v-switch>
          </v-col>
        </v-row>

        <!-- show image of new ad -->
        <v-row>
          <v-col>
            <v-img
              v-if="imageSrc"
              :src="imageSrc"
              alt=""
              class="ad-new__image d-block"
              contain
              max-height="350"
            ></v-img>
          </v-col>
        </v-row>

        <!-- button create new ad -->
        <v-row>
          <v-col class="sm-12">
            <v-btn
              :disabled="!valid || !image || loadingButton"
              :loading="loadingButton"
              block
              class="success"
              @click="submitAd"
            >
              Create ad</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      description: '',
      image: null,
      imageSrc: '',
      price: null,
      promo: false,
      title: '',
      valid: false,

      // rules on title validation
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) =>
          (v && v.length >= 4) ||
          'Title must be equal or more than 4 characters',
        (v) =>
          (v && v.length <= 60) ||
          'Title must be equal or less than 60 characters',
      ],

      // rules on description validation
      descriptionRules: [
        (v) => !!v || 'Description is required',
        (v) =>
          (v && v.length >= 30) ||
          'Description must be equal or more than 30 characters',
        (v) =>
          (v && v.length <= 1000) ||
          'Description must be equal or less than 1000 characters',
      ],

      // rules on price validation
      priceRules: [
        (v) =>
          (v && v.length <= 20) ||
          'The price must be equal or less than 20 characters',
      ],
    };
  },
  computed: {
    ...mapState('shared', ['loading']),

    // state 'loading' now return a boolean
    loadingButton() {
      return !!this.loading;
    },
  },
  methods: {
    ...mapActions('ads', ['createAd']),
    ...mapActions('shared', ['setError', 'clearError']),

    // create new ad in Firebase and vuex
    submitAd() {
      if (this.$refs.form.validate() && this.image) {
        const ad = {
          title: this.title,
          description: this.description,
          promo: this.promo,
          image: this.image,
          price: Number(this.price),
        };
        this.createAd(ad)
          .then(() => {
            this.$router.push('/list');
          })
          .catch(() => {});
      }
    },

    // trigger of upload image
    triggerUpload() {
      this.$refs.fileInput.click();
    },

    // event of file changed (upload image)
    async onFileChange(event) {
      const file = event.target.files[0];

      await this.clearError();

      if (file.size > 1024 * 1024) {
        await this.setError(
          `Max upload image is 1 Mb. Your image is ${file.size / 1000} Kb`
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.image = file;
    },
  },
};
</script>

<style scoped>
.ad-new__image {
  border-radius: 4px;
}
</style>
