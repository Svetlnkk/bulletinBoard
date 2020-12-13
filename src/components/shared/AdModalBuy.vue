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
              <v-form>
                <!-- buy dialog name input -->
                <v-text-field
                  v-model="name"
                  :error-messages="nameErrors"
                  color="teal"
                  counter="60"
                  label="Your name"
                  name="name"
                  type="text"
                  @blur="$v.name.$touch()"
                >
                </v-text-field>

                <!-- buy dialog phone input -->
                <v-text-field
                  v-model="phone"
                  :error-messages="phoneErrors"
                  color="teal"
                  counter
                  label="Your phone"
                  name="phone"
                  type="text"
                  @blur="$v.phone.$touch()"
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
              <v-btn :disabled="localLoading" class="" text @click="cancelBuy"
                >Close</v-btn
              >

              <!-- buy dialog save button -->
              <v-btn
                :disabled="localLoading"
                :loading="localLoading"
                class="primary"
                depressed
                @click="submitMessageBuy"
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
import { validationMixin } from 'vuelidate';
import { validationAdModalBuy } from '../../js/utils/validationsVuelidate.util';

export default {
  name: 'AdModalBuy',
  mixins: [validationMixin],
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
    };
  },
  computed: {
    ...mapState('user', ['currentUser']),

    // VUETIFY. Validation errors
    ...validationAdModalBuy.errorMessages,

    // check - whether the owner is the current user
    isOwner() {
      if (!this.currentUser) return;
      return this.ad.ownerId === this.currentUser.id;
    },
  },

  // VUETIFY. Validations rules
  validations: validationAdModalBuy.validations,

  methods: {
    ...mapActions('orders', ['createOrder']),

    // cancel buy
    cancelBuy() {
      this.name = '';
      this.phone = '';
      this.modal = false;
      this.localLoading = false;
    },

    // submit the name and phone to ad owner
    async submitMessageBuy() {
      if (!this.$v.$invalid) {
        this.localLoading = true;

        try {
          await this.createOrder({
            name: this.name,
            phone: this.phone,
            adId: this.ad.id,
            ownerId: this.ad.ownerId,
          });
        } finally {
          this.name = '';
          this.phone = '';
          this.localLoading = false;
          this.modal = false;
        }
      }
    },
  },
};
</script>
