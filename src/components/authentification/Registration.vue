<template>
  <v-container fluid fill-height>
    <v-row class="align-center justify-center">
      <v-col class="col-xs-12 col-sm-8 col-md-4">
        <v-card class="elevation-12">
          <!-- registration title -->
          <v-app-bar dark color="teal">
            <v-toolbar-title>Registration form</v-toolbar-title>
          </v-app-bar>

          <!-- registration form -->
          <v-card-text>
            <v-form>
              <!-- registration name input -->
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                color="teal"
                counter="30"
                label="Your name"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                @blur="$v.name.$touch()"
              >
              </v-text-field>

              <!-- registration email input -->
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                color="teal"
                counter
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                @blur="$v.email.$touch()"
              >
              </v-text-field>

              <!-- registration password input -->
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="passwordErrors"
                :type="showPassword ? 'text' : 'password'"
                color="teal"
                counter
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                @blur="$v.password.$touch()"
                @click:append="showPassword = !showPassword"
              >
              </v-text-field>

              <!-- registration confirm password input-->
              <v-text-field
                v-model="confirmPassword"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="confirmPasswordErrors"
                :type="showConfirmPassword ? 'text' : 'password'"
                color="teal"
                counter
                label="Confirm password"
                name="confirm-password"
                prepend-icon="mdi-lock"
                @blur="$v.confirmPassword.$touch()"
                @click:append="showConfirmPassword = !showConfirmPassword"
              >
              </v-text-field>
            </v-form>
          </v-card-text>

          <!-- registration actions -->
          <v-card-actions>
            <v-spacer></v-spacer>

            <!-- registration form submit button -->
            <v-btn
              :disabled="$v.$invalid || loadingButton"
              :loading="loadingButton"
              color="teal"
              text
              @click.prevent="onSubmit"
            >
              Create account</v-btn
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
  alpha,
  email,
  maxLength,
  minLength,
  required,
  sameAs,
} from 'vuelidate/lib/validators';
import {
  hasLowercaseLetter,
  hasNumber,
  hasUppercaseLetter,
} from '../../validators/password';

export default {
  mixins: [validationMixin],
  validations: {
    confirmPassword: {
      sameAsPassword: sameAs('password'),
      required,
    },
    email: {
      email,
      maxLength: maxLength(100),
      minLength: minLength(3),
      required,
    },
    name: {
      alpha,
      maxLength: maxLength(30),
      minLength: minLength(2),
      required,
    },
    password: {
      hasLowercaseLetter,
      hasNumber,
      hasUppercaseLetter,
      maxLength: maxLength(50),
      minLength: minLength(6),
      required,
    },
  },
  data() {
    return {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
      showConfirmPassword: false,
      showPassword: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('shared', ['loading']),

    // rules on confirmPassword validation
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAsPassword &&
        errors.push('Passwords must match');
      !this.$v.confirmPassword.required &&
        errors.push('Confirm password is required');
      return errors;
    },

    // rules on email validation
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Email must be valid');
      !this.$v.email.maxLength &&
        errors.push('Email must be equal or less than 30 characters');
      !this.$v.email.minLength &&
        errors.push('Email must be equal or more than 3 characters');
      !this.$v.email.required && errors.push('Email is required');
      return errors;
    },

    // returned boolean from 'loading'
    loadingButton() {
      return !!this.loading;
    },

    // rules on name validation
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.alpha && errors.push('Name must be only letters');
      !this.$v.name.maxLength &&
        errors.push('Name must be equal or less than 30 characters');
      !this.$v.name.minLength &&
        errors.push('Name must be equal or more than 3 characters');
      !this.$v.name.required && errors.push('Name is required');
      return errors;
    },

    // rules on password validation
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.hasLowercaseLetter &&
        errors.push('Need at least one latin letter with lowercase');
      !this.$v.password.hasNumber && errors.push('Need at least one digit');
      !this.$v.password.hasUppercaseLetter &&
        errors.push('Need at least one latin letter with uppercase');
      !this.$v.password.maxLength &&
        errors.push('Password must be equal or less than 50 characters');
      !this.$v.password.minLength &&
        errors.push('Password must be equal or more than 6 characters');
      !this.$v.password.required && errors.push('Title is required');
      return errors;
    },
  },
  methods: {
    ...mapActions('user', ['registerUser']),

    // submit new user on Firebase and Vuex
    onSubmit() {
      if (!this.$v.$invalid) {
        const user = {
          email: this.email,
          password: this.password,
          name: this.name,
        };

        this.registerUser(user)
          .then(() => {
            this.$router.push('/');
          })
          .catch(() => {});
      }
    },
  },
};
</script>
