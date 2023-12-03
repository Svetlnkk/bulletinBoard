<template>
  <v-container fluid fill-height>
    <v-row class="align-center justify-center">
      <v-col class="col-xs-12 col-sm-8 col-md-4">
        <v-card class="elevation-12">
          <!-- login title -->
          <v-app-bar dark color="teal">
            <v-toolbar-title>Вход</v-toolbar-title>
          </v-app-bar>

          <!-- login form -->
          <v-card-text>
            <v-form>
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
                label="Пароль"
                name="password"
                prepend-icon="mdi-lock"
                @blur="$v.password.$touch()"
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
              :disabled="$v.$invalid || loadingButtonBoolean"
              :loading="loadingButtonBoolean"
              color="teal"
              text
              @click.prevent="onSubmit"
            >
              Войти</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { validationLogin } from '../../js/utils/validationsVuelidate.util';

export default {
  name: 'Login',
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
      show: false,
    };
  },
  computed: {
    ...mapGetters('shared', ['loadingButtonBoolean']),

    // VUETIFY. Validation errors
    ...validationLogin.errorMessages,
  },

  // VUETIFY. Validations rules
  validations: validationLogin.validations,

  created() {
    this.denyAccess();
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
        this.setError('Пожалуйста, войдите в систему, чтобы получить доступ к этой странице');
      }
    },
  },
};
</script>
