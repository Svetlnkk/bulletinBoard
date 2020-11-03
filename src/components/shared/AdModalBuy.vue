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
import {
  alpha,
  maxLength,
  minLength,
  numeric,
  required,
} from 'vuelidate/lib/validators';
export default {
  name: 'AdModalBuy',
  mixins: [validationMixin],
  validations: {
    name: {
      alpha,
      maxLength: maxLength(60),
      minLength: minLength(2),
      required,
    },
    phone: {
      maxLength: maxLength(30),
      minLength: minLength(5),
      numeric,
      required,
    },
  },
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

    // check - whether the owner is the current user
    isOwner() {
      if (!this.currentUser) return;
      return this.ad.ownerId === this.currentUser.id;
    },

    // rules on name validation
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.alpha && errors.push('Name must be only letters');
      !this.$v.name.maxLength &&
        errors.push('Name must be equal or less than 60 characters');
      !this.$v.name.minLength &&
        errors.push('Name must be equal or more than 2 characters');
      !this.$v.name.required && errors.push('Name is required');
      return errors;
    },

    // rules on phone number validation
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.numeric && errors.push('Phone number must be only digits');
      !this.$v.phone.maxLength &&
        errors.push('Phone number must be equal or less than 30 digits');
      !this.$v.phone.minLength &&
        errors.push('Phone number must be equal or more than 5 digits');
      !this.$v.phone.required && errors.push('Phone number is required');
      return errors;
    },
  },
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
