<template>
  <v-container>
    <v-row>
      <v-col class="col-sm-8 col-lg-6 mx-auto">
        <h1 class="text--secondary mb-3">Create new ad</h1>

        <!-- form -->
        <v-form ref="form" v-model="valid">
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
          <!-- load image -->
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

          <!-- promo -->
          <v-col>
            <v-switch v-model="promo" color="teal" inset label="Add to promo?">
            </v-switch>
          </v-col>
        </v-row>

        <!-- show image -->
        <v-row>
          <v-col>
            <v-img
              v-if="imageSrc"
              :src="imageSrc"
              alt=""
              class="d-block"
              contain
              max-height="350"
            ></v-img>
          </v-col>
        </v-row>

        <!-- button create -->
        <v-row>
          <v-col class="sm-12">
            <v-btn
              :disabled="!valid || !image || loading"
              :loading="loading"
              block
              class="success"
              @click="createAd"
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
import { mapState } from 'vuex';

export default {
  data() {
    return {
      valid: false,
      title: '',
      description: '',
      image: null,
      imageSrc: '',
      promo: false,
      price: null,
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) =>
          (v && v.length >= 4) ||
          'Title must be equal or more than 4 characters',
        (v) =>
          (v && v.length <= 60) ||
          'Title must be equal or less than 60 characters',
      ],
      descriptionRules: [
        (v) => !!v || 'Description is required',
        (v) =>
          (v && v.length >= 30) ||
          'Description must be equal or more than 30 characters',
        (v) =>
          (v && v.length <= 1000) ||
          'Description must be equal or less than 1000 characters',
      ],
      priceRules: [
        (v) =>
          (v && v.length <= 20) ||
          'The price must be equal or less than 20 characters',
      ],
    };
  },
  computed: {
    ...mapState('shared', {
      loading: 'loading',
    }),
  },
  methods: {
    createAd() {
      if (this.$refs.form.validate() && this.image) {
        const ad = {
          title: this.title,
          description: this.description,
          promo: this.promo,
          image: this.image,
          price: Number(this.price),
        };
        this.$store
          .dispatch('createAd', ad)
          .then(() => {
            this.$router.push('/list');
          })
          .catch(() => {});
      }
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
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
