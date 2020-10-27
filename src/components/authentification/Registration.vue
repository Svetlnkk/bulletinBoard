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
            <v-form ref="form" v-model="valid">
              <!-- registration name input -->
              <v-text-field
                v-model="name"
                :rules="nameRules"
                color="teal"
                counter="30"
                label="Your name"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                validate-on-blur
              >
              </v-text-field>

              <!-- registration email input -->
              <v-text-field
                v-model="email"
                :rules="emailRules"
                color="teal"
                counter
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                validate-on-blur
              >
              </v-text-field>

              <!-- registration password input -->
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                color="teal"
                counter
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                validate-on-blur
                @click:append="showPassword = !showPassword"
              >
              </v-text-field>

              <!-- registration confirm password input-->
              <v-text-field
                v-model="confirmPassword"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="confirmPasswordRules"
                :type="showConfirmPassword ? 'text' : 'password'"
                color="teal"
                counter
                label="Confirm password"
                name="confirm-password"
                prepend-icon="mdi-lock"
                validate-on-blur
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
              :disabled="!valid || loadingButton"
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

export default {
  data() {
    return {
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
      showConfirmPassword: false,
      showPassword: false,
      valid: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) =>
          (v && v.length >= 6) ||
          'Password must be equal or more than 6 characters',
        (v) => !/\s/.test(v) || 'No spaces are allowed',
        (v) =>
          /[a-z]/.test(v) || 'Need at least one latin letter with lowercase',
        (v) =>
          /[A-Z]/.test(v) || 'Need at least one latin letter with uppercase',
        (v) => /\d/.test(v) || 'Need at least one digit',
        (v) =>
          !/\W/.test(v) ||
          'You can not enter anything other than Latin letters and digits',
      ],
      confirmPasswordRules: [
        (v) => !!v || 'Password is required',
        (v) => v === this.password || 'Password must match',
      ],
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length <= 30) ||
          'Name must be equal or less than 30 characters',
      ],
    };
  },
  computed: {
    ...mapState('shared', ['loading']),

    loadingButton() {
      if (this.loading) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions('user', ['registerUser']),

    // submit new user on Firebase and Vuex
    onSubmit() {
      if (this.$refs.form.validate()) {
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
