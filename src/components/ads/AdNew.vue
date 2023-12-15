<template>
  <v-container>
    <v-row>
      <v-col class="col-sm-8 col-lg-6 mx-auto">
        <h1 class="text--secondary mb-3">Создать объявление</h1>

        <v-form>

          <v-text-field
            v-model="title"
            :error-messages="titleErrors"
            color="teal"
            counter="60"
            label="Заголовок"
            name="title"
            type="text"
            @blur="$v.title.$touch()"
          >
          </v-text-field>

          <v-textarea
            v-model="description"
            :error-messages="descriptionErrors"
            color="teal"
            counter="1000"
            label="Описание"
            name="description"
            type="text"
            @blur="$v.description.$touch()"
          >
          </v-textarea>
          <v-text-field
            v-model="price"
            :error-messages="priceErrors"
            color="teal"
            counter="20"
            label="Цена"
            name="price"
            type="number"
            @blur="$v.price.$touch()"
          >
          </v-text-field>
        </v-form>
        <v-row>
          <v-col>
            <v-btn
              class="my-2 white--text mt-3"
              color="blue-grey"
              @click="triggerUpload"
            >
              Добавить изображение
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
          <v-col>
            <v-switch v-model="promo" color="teal" inset label="Добавить в продвижение?">
            </v-switch>
          </v-col>
        </v-row>
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
        <v-row>
          <v-col class="sm-12">
            <v-btn
              :disabled="$v.$invalid || !image || loadingButtonBoolean"
              :loading="loadingButtonBoolean"
              block
              class="success"
              @click="submitAd"
            >
              Создать</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { validationAdNew } from '../../js/utils/validationsVuelidate.util';

export default {
  name: 'AdNew',
  mixins: [validationMixin],
  data() {
    return {
      description: '',
      image: null,
      imageSrc: '',
      price: null,
      promo: false,
      title: '',
    };
  },
  computed: {
    ...mapGetters('shared', ['loadingButtonBoolean']),

    // VUETIFY. Validation errors
    ...validationAdNew.errorMessages,
  },

  // VUETIFY. Validations rules
  validations: validationAdNew.validations,

  methods: {
    ...mapActions('ads', ['createAd']),
    ...mapActions('shared', ['setError', 'clearError']),

    // create new ad in Firebase and vuex
    submitAd() {
      if (!this.$v.$invalid && this.image) {
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
          `Максимальный размер загружаемого изображения составляет 1 Мб. Размер вашего изображения составляет ${file.size / 1000} Kb`
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
