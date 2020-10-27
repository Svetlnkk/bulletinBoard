<template>
  <v-dialog width="400" v-model="modal">
    <!-- buy dialog activator -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="!isOwner"
        v-bind="attrs"
        class="primary white--text"
        depressed
        v-on="on"
      >
        Buy</v-btn
      >
      <v-btn v-else disabled>Your Ad</v-btn>
    </template>

    <!-- buy dialog body -->
    <v-card>
      <v-container>
        <!-- buy dialog title -->
        <v-row>
          <v-col class="col-xs-12 py-0 primary">
            <v-card-title>
              <h2 class="white--text modal__title">
                Do you want to buy it?
              </h2>
            </v-card-title>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <!-- buy dialog form -->
        <v-row>
          <v-col class="col-xs-12">
            <v-card-text>
              <v-form ref="formEdit" v-model="valid">
                <!-- buy dialog name input -->
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  color="teal"
                  counter="60"
                  label="Your name"
                  name="name"
                  required
                  type="text"
                  validate-on-blur
                >
                </v-text-field>

                <!-- buy dialog phone input -->
                <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  color="teal"
                  counter
                  label="Your phone"
                  name="phone"
                  type="text"
                  validate-on-blur
                >
                </v-text-field>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <!-- buy dialog actions -->
        <v-row>
          <v-col class="col-xs-12">
            <v-card-actions>
              <v-spacer></v-spacer>

              <!-- buy dialog cancel button -->
              <v-btn :disabled="localLoading" class="" text @click="onCancel"
                >Close</v-btn
              >

              <!-- buy dialog save button -->
              <v-btn
                :disabled="localLoading"
                :loading="localLoading"
                class="primary"
                depressed
                @click="onSave"
                >Buy it</v-btn
              >
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  props: {
    ad: Object,
  },
  data() {
    return {
      localLoading: false,
      modal: false,
      name: '',
      phone: '',
      valid: false,
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length >= 2) ||
          'Name must be equal or more than 2 characters',
        (v) =>
          (v && v.length <= 60) ||
          'Name must be equal or less than 60 characters',
      ],
      phoneRules: [
        (v) => !!v || 'Phone is required',
        (v) =>
          (v && v.length >= 5) ||
          'Phone must be equal or more than 5 characters',
        (v) =>
          (v && v.length <= 30) ||
          'Phone must be equal or less than 30 characters',
        (v) => !/\s/.test(v) || 'No spaces are allowed',
        (v) =>
          /^[0-9 +]+$/.test(v) || 'Phone can only contain digits and  + sign',
      ],
    };
  },
  computed: {
    ...mapState('user', ['currentUser']),

    // Check. Whether the owner is the current user
    isOwner() {
      if (!this.currentUser) return;
      return this.ad.ownerId === this.currentUser.id;
    },
  },
  methods: {
    ...mapActions('orders', ['createOrder']),

    // cancel buy
    onCancel() {
      this.name = '';
      this.phone = '';
      this.modal = false;
      this.localLoading = false;
    },

    // submit the name and phone to ad owner
    onSave() {
      if (this.$refs.formEdit.validate()) {
        this.localLoading = true;
        this.createOrder({
          name: this.name,
          phone: this.phone,
          adId: this.ad.id,
          ownerId: this.ad.ownerId,
        }).finally(() => {
          this.name = '';
          this.phone = '';
          this.localLoading = false;
          this.modal = false;
        });
      }
    },
  },
};
</script>

<style>
/* removes word break in the card title */
.v-card__title .modal__title {
  word-break: normal;
}
</style>
