<template>
  <v-container fluid fill-height>
    <v-row class="align-center justify-center">
      <v-col class="col-xs-12 col-sm-8 col-md-4">
        <v-card class="elevation-12">
          <!-- login title -->
          <v-app-bar dark color="teal">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-app-bar>

          <!-- login form -->
          <v-card-text>
            <v-form ref="form">
              <!-- login email input -->
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                color="teal"
                counter
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="email"
                @blur="$v.email.$touch()"
                @input="$v.email.$touch()"
              >
              </v-text-field>

              <!-- login password input -->
              <v-text-field
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordErrors"
                :type="show ? 'text' : 'password'"
                color="teal"
                counter
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                @blur="$v.password.$touch()"
                @click:append="show = !show"
                @input="$v.password.$touch()"
              >
              </v-text-field>
            </v-form>
          </v-card-text>

          <!-- login actions -->
          <v-card-actions>
            <v-spacer></v-spacer>

            <!-- log in button -->
            <v-btn
              :disabled="$v.$invalid || loadingButton"
              :loading="loadingButton"
              color="teal"
              text
              @click.prevent="onSubmit"
            >
              Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { validationMixin } from 'vuelidate';
import {
  email,
  maxLength,
  minLength,
  required,
} from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  validations: {
    email: {
      email,
      maxLength: maxLength(1000),
      minLength: minLength(3),
      required,
    },
    password: { required, maxLength: maxLength(1000) },
  },
  data() {
    return {
      email: '',
      password: '',
      show: false,
    };
  },
  computed: {
    ...mapState('shared', ['loading']),

    // rules on email validation
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Must be valid email');
      !this.$v.email.maxLength &&
        errors.push('Email must be equal or less than 1000 characters');
      !this.$v.email.minLength &&
        errors.push('Email must be equal or more than 3 characters');
      !this.$v.email.required && errors.push('Email is required');
      return errors;
    },

    // returned boolean from 'this.loading'
    loadingButton() {
      return !!this.loading;
    },

    // rules on password validation
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.maxLength &&
        errors.push('Password must be equal or less than 1000 characters');
      !this.$v.password.required && errors.push('Password is required');
      return errors;
    },
  },
  methods: {
    ...mapActions('shared', ['setError']),
    ...mapActions('user', ['loginUser']),

    // submit user login form
    onSubmit() {
      if (!this.$v.$invalid) {
        const user = {
          email: this.email,
          password: this.password,
        };

        this.loginUser(user)
          .then(() => {
            this.$router.push('/');
          })
          .catch(() => {});
      }
    },

    // denying access without authorization
    denyAccess() {
      if (this.$route.query['loginError']) {
        this.setError('Please log in to access this page');
      }
    },
  },
  created() {
    this.denyAccess();
  },
};
</script>
