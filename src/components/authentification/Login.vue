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
            <v-form ref="form" v-model="valid">
              <!-- login email input -->
              <v-text-field
                v-model="email"
                :rules="emailRules"
                color="teal"
                counter
                label="Email"
                name="email"
                prepend-icon="mdi-account"
                type="email"
                validate-on-blur
              >
              </v-text-field>

              <!-- login password input -->
              <v-text-field
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="show ? 'text' : 'password'"
                color="teal"
                counter
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                validate-on-blur
                @click:append="show = !show"
              >
              </v-text-field>
            </v-form>
          </v-card-text>

          <!-- login actions -->
          <v-card-actions>
            <v-spacer></v-spacer>

            <!-- log in button -->
            <v-btn
              :disabled="!valid || loadingButton"
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

export default {
  data() {
    return {
      email: '',
      password: '',
      show: false,
      valid: false,

      // rules on email validation
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],

      // rules on password validation
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
    };
  },
  computed: {
    ...mapState('shared', ['loading']),

    // returned boolean from 'this.loading'
    loadingButton() {
      return !!this.loading;
    },
  },
  methods: {
    ...mapActions('shared', ['setError']),
    ...mapActions('user', ['loginUser']),

    // submit user login form
    onSubmit() {
      if (this.$refs.form.validate()) {
        const user = {
          email: this.email,
          password: this.password,
          valid: this.valid,
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
