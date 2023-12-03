<template>
  <v-container fluid fill-height>
    <v-row class="align-center justify-center">
      <v-col class="col-xs-12 col-sm-8 col-md-4">
        <v-card class="elevation-12">
          <!-- registration title -->
          <v-app-bar dark color="teal">
            <v-toolbar-title>Регистрация</v-toolbar-title>
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
                label="Имя"
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
                label="Пароль"
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
                label="Повторите пароль"
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
              :disabled="$v.$invalid || loadingButtonBoolean"
              :loading="loadingButtonBoolean"
              color="teal"
              text
              @click.prevent="onSubmit"
            >
              Создать аккаунт</v-btn
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
import { validationRegistration } from '../../js/utils/validationsVuelidate.util';

export default {
  name: 'Registration',
  mixins: [validationMixin],
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
    ...mapGetters('shared', ['loadingButtonBoolean']),

    // VUETIFY. Validation errors
    ...validationRegistration.errorMessages,
  },

  // VUETIFY. Validations rules
  validations: validationRegistration.validations,

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
          .catch((error) => {
            throw error;
          });
      }
    },
  },
};
</script>
