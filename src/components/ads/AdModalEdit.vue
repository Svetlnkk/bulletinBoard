<template>
  <v-dialog
    v-model="modal"
    eager
    width="400"
    @click:outside="cancelEditing"
    @keydown.esc="cancelEditing"
  >
    <!-- ad edit dialog activator -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" class="orange white--text mr-3" depressed v-on="on">
        Edit</v-btn
      >
    </template>

    <!-- ad edit dialog dialog body -->
    <v-card>
      <v-container>
        <!-- ad edit dialog title -->
        <v-row>
          <v-col class="col-xs-12 py-0 orange">
            <v-card-title>
              <h1 class="text-h5 text-sm-h4 font-weight-bold">
                Edit ad
              </h1>
            </v-card-title>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- ad edit dialog form -->
        <v-row>
          <v-col class="col-xs-12">
            <v-card-text>
              <v-form>
                <!-- ad edit dialog title input -->
                <v-text-field
                  v-model="editedTitle"
                  :error-messages="titleErrors"
                  color="teal"
                  counter="60"
                  label="Ad title"
                  name="title"
                  type="text"
                  @blur="$v.editedTitle.$touch()"
                >
                </v-text-field>

                <!-- ad edit dialog description input -->
                <v-textarea
                  v-model="editedDescription"
                  :error-messages="descriptionErrors"
                  color="teal"
                  counter="1000"
                  label="Ad description"
                  name="description"
                  type="text"
                  @blur="$v.editedDescription.$touch()"
                >
                </v-textarea>

                <!-- ad edit dialog price input -->
                <v-text-field
                  v-model="editedPrice"
                  :error-messages="priceErrors"
                  color="teal"
                  counter="20"
                  label="Price"
                  name="price"
                  type="number"
                  @blur="$v.editedPrice.$touch()"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- actions -->
        <v-row>
          <v-col class="col-xs-12">
            <v-card-actions>
              <v-spacer></v-spacer>

              <!-- cancel edit ad button -->
              <v-btn text @click="cancelEditing">Cancel</v-btn>

              <!-- save changes in this ad after editing -->
              <v-btn class="orange white--text" depressed @click="saveChangesAd"
                >Save</v-btn
              >
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import {
  maxLength,
  minLength,
  numeric,
  required,
} from 'vuelidate/lib/validators';

export default {
  name: 'AdModalEdit',
  mixins: [validationMixin],
  validations: {
    editedDescription: {
      maxLength: maxLength(1000),
      minLength: minLength(30),
      required,
    },
    editedPrice: { maxLength: maxLength(20), numeric, required },
    editedTitle: {
      maxLength: maxLength(60),
      minLength: minLength(4),
      required,
    },
  },
  props: {
    ad: Object,
  },
  data() {
    return {
      editedDescription: this.ad.description,
      editedPrice: String(this.ad.price),
      editedTitle: this.ad.title,
      modal: false,
    };
  },
  computed: {
    // rules on title validation
    titleErrors() {
      const errors = [];
      if (!this.$v.editedTitle.$dirty) return errors;
      !this.$v.editedTitle.maxLength &&
        errors.push('Title must be equal or less than 60 characters');
      !this.$v.editedTitle.minLength &&
        errors.push('Title must be equal or more than 4 characters');
      !this.$v.editedTitle.required && errors.push('Title is required');
      return errors;
    },

    // rules on description validation
    descriptionErrors() {
      const errors = [];
      if (!this.$v.editedDescription.$dirty) return errors;
      !this.$v.editedDescription.maxLength &&
        errors.push('Description must be equal or less than 1000 characters');
      !this.$v.editedDescription.minLength &&
        errors.push('Description must be equal or more than 30 characters');
      !this.$v.editedDescription.required &&
        errors.push('Description is required');
      return errors;
    },

    // rules on price validation
    priceErrors() {
      const errors = [];
      if (!this.$v.editedPrice.$dirty) return errors;
      !this.$v.editedPrice.maxLength &&
        errors.push('Price must be equal or less than 20 digits');
      !this.$v.editedPrice.numeric && errors.push('Price must be a number');
      !this.$v.editedPrice.required && errors.push('Price is required');
      return errors;
    },
  },
  methods: {
    ...mapActions('ads', ['updateAd']),

    // cancel editing ad
    cancelEditing() {
      this.editedTitle = this.ad.title;
      this.editedDescription = this.ad.description;
      this.editedPrice = String(this.ad.price);
      this.modal = false;
    },

    // save changes in this ad after editing
    saveChangesAd() {
      if (!this.$v.$invalid) {
        this.updateAd({
          title: this.editedTitle,
          description: this.editedDescription,
          id: this.ad.id,
          price: Number(this.editedPrice),
        });
      }
    },
  },
};
</script>
