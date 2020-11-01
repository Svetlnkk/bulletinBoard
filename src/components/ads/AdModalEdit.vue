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
              <v-form ref="formEdit" v-model="valid">
                <!-- ad edit dialog title input -->
                <v-text-field
                  v-model="editedTitle"
                  :rules="editedTitleRules"
                  color="teal"
                  counter="60"
                  label="Ad title"
                  name="title"
                  required
                  type="text"
                  validate-on-blur
                >
                </v-text-field>

                <!-- ad edit dialog description input -->
                <v-textarea
                  v-model="editedDescription"
                  :rules="editedDescriptionRules"
                  color="teal"
                  counter="1000"
                  label="Ad description"
                  name="description"
                  type="text"
                  validate-on-blur
                >
                </v-textarea>

                <!-- ad edit dialog price input -->
                <v-text-field
                  v-model="editedPrice"
                  :rules="editedPriceRules"
                  color="teal"
                  counter="20"
                  label="Price"
                  name="price"
                  type="number"
                  validate-on-blur
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

export default {
  props: {
    ad: Object,
  },
  data() {
    return {
      editedDescription: this.ad.description,
      editedPrice: String(this.ad.price),
      editedTitle: this.ad.title,
      modal: false,
      valid: false,

      // rules on title validation
      editedTitleRules: [
        (v) => !!v || 'Title is required',
        (v) =>
          (v && v.length >= 4) ||
          'Title must be equal or more than 4 characters',
        (v) =>
          (v && v.length <= 60) ||
          'Title must be equal or less than 60 characters',
      ],

      // rules on description validation
      editedDescriptionRules: [
        (v) => !!v || 'Description is required',
        (v) =>
          (v && v.length >= 30) ||
          'Description must be equal or more than 30 characters',
        (v) =>
          (v && v.length <= 1000) ||
          'Description must be equal or less than 1000 characters',
      ],

      // rules on price validation
      editedPriceRules: [
        (v) =>
          (v && v.length <= 20) ||
          'The price must be equal or less than 20 only digits',
      ],
    };
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
      if (this.$refs.formEdit.validate()) {
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
