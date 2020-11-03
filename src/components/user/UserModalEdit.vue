<template>
  <v-dialog
    v-model="modal"
    eager
    width="400"
    @click:outside="cancelEditing"
    @keydown.esc="cancelEditing"
  >
    <!-- user edit dialog activator -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        class="teal darken-2 white--text mr-3"
        depressed
        v-on="on"
      >
        Edit</v-btn
      >
    </template>

    <!-- user edit dialog body -->
    <v-card>
      <v-container>
        <!-- user edit dialog title -->
        <v-row>
          <v-col class="col-12 py-0 teal darken-2">
            <v-card-title class="text-subtitle-1 text-sm-h5">
              <h3 class="white--text">Change user settings</h3>
            </v-card-title>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- user edit dialog form -->
        <v-row>
          <v-col class="col-12">
            <v-card-text>
              <v-form>
                <!-- user edit dialog name input -->
                <v-text-field
                  v-model="editedName"
                  :error-messages="editedNameErrors"
                  color="teal"
                  counter="30"
                  label="User name"
                  name="name"
                  type="text"
                  @blur="$v.editedName.$touch()"
                >
                </v-text-field>

                <!-- user edit dialog email input -->
                <v-text-field
                  v-model="editedEmail"
                  :error-messages="editedEmailErrors"
                  color="teal"
                  counter
                  label="Email"
                  name="email"
                  type="email"
                  @blur="$v.editedEmail.$touch()"
                >
                </v-text-field>

                <!-- user edit dialog password input -->
                <v-text-field
                  v-model="editedPassword"
                  :error-messages="editedPasswordErrors"
                  color="teal"
                  counter
                  label="New password"
                  name="password"
                  type="password"
                  @blur="$v.editedPassword.$touch()"
                >
                </v-text-field>

                <!-- user edit dialog confirm password input -->
                <v-text-field
                  v-model="editedConfirmPassword"
                  :error-messages="editedConfirmPasswordErrors"
                  color="teal"
                  counter
                  label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  @blur="$v.editedConfirmPassword.$touch()"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- user edit dialog actions -->
        <v-row>
          <v-col class="col-12">
            <v-card-actions>
              <v-spacer></v-spacer>

              <!-- user edit dialog cancel button -->
              <v-btn text @click="cancelEditing">Cancel</v-btn>

              <!-- user edit dialog save button -->
              <v-btn
                :disabled="!validateInput()"
                class="teal darken-2 white--text"
                depressed
                @click="saveChangesUser"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- сonfirm the change with your current password -->
    <app-user-modal-current-password
      :isCheckedCurrentPassword="isCheckedCurrentPassword"
      :modalCurrentPassword="modalCurrentPassword"
      @close="modalCurrentPassword = false"
      @passwordAccepted="passwordAccepted"
    ></app-user-modal-current-password>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import UserModalCurrentPassword from './UserModalCurrentPassword';
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
  name: 'UserModalEdit',
  mixins: [validationMixin],
  validations: {
    editedConfirmPassword: {
      sameAsPassword: sameAs('editedPassword'),
      required,
    },
    editedEmail: {
      email,
      maxLength: maxLength(100),
      minLength: minLength(3),
      required,
    },
    editedName: {
      alpha,
      maxLength: maxLength(30),
      minLength: minLength(2),
      required,
    },
    editedPassword: {
      hasLowercaseLetter,
      hasNumber,
      hasUppercaseLetter,
      maxLength: maxLength(50),
      minLength: minLength(6),
      required,
    },
  },
  components: {
    appUserModalCurrentPassword: UserModalCurrentPassword,
  },
  props: {
    currentUser: Object,
  },
  data() {
    return {
      editedConfirmPassword: '',
      editedEmail: this.currentUser.email,
      editedName: this.currentUser.name,
      editedPassword: '',
      isCheckedCurrentPassword: false,
      modal: false,
      modalCurrentPassword: false,
    };
  },
  computed: {
    // rules on confirmPassword validation. Not cheсked if this.editedPassword is none.
    editedConfirmPasswordErrors() {
      const errors = [];
      if (!this.$v.editedConfirmPassword.$dirty) return errors;
      !this.$v.editedConfirmPassword.sameAsPassword &&
        this.editedPassword &&
        errors.push('Passwords must match');
      !this.$v.editedConfirmPassword.required &&
        this.editedPassword &&
        errors.push('Confirm password is required');
      return errors;
    },

    // rules on email validation
    editedEmailErrors() {
      const errors = [];
      if (!this.$v.editedEmail.$dirty) return errors;
      !this.$v.editedEmail.email && errors.push('Email must be valid');
      !this.$v.editedEmail.maxLength &&
        errors.push('Email must be equal or less than 30 characters');
      !this.$v.editedEmail.minLength &&
        errors.push('Email must be equal or more than 3 characters');
      !this.$v.editedEmail.required && errors.push('Email is required');
      return errors;
    },

    // rules on name validation
    editedNameErrors() {
      const errors = [];
      if (!this.$v.editedName.$dirty) return errors;
      !this.$v.editedName.alpha && errors.push('Name must be only letters');
      !this.$v.editedName.maxLength &&
        errors.push('Name must be equal or less than 30 characters');
      !this.$v.editedName.minLength &&
        errors.push('Name must be equal or more than 3 characters');
      !this.$v.editedName.required && errors.push('Name is required');
      return errors;
    },

    // rules on password validation.Not cheсked if this.editedPassword is none.
    editedPasswordErrors() {
      const errors = [];
      if (!this.$v.editedPassword.$dirty) return errors;
      !this.$v.editedPassword.hasLowercaseLetter &&
        this.editedPassword &&
        errors.push('Need at least one latin letter with lowercase');
      !this.$v.editedPassword.hasNumber &&
        this.editedPassword &&
        errors.push('Need at least one digit');
      !this.$v.editedPassword.hasUppercaseLetter &&
        this.editedPassword &&
        errors.push('Need at least one latin letter with uppercase');
      !this.$v.editedPassword.maxLength &&
        this.editedPassword &&
        errors.push('Password must be equal or less than 50 characters');
      !this.$v.editedPassword.minLength &&
        this.editedPassword &&
        errors.push('Password must be equal or more than 6 characters');
      !this.$v.editedPassword.required &&
        this.editedPassword &&
        errors.push('Password is required');
      return errors;
    },
  },
  methods: {
    ...mapActions('user', ['updateUser']),

    /* custom validator of checking 'vuelidate'.
    Return 'true' if password did not change but change (valid) other input.
    And return 'true' if all is valid */
    validateInput() {
      if (
        !this.editedPassword &&
        !this.editedEmail.$invalid &&
        !this.editedName.$invalid
      ) {
        return true;
      } else if (!this.$v.$invalid) {
        return true;
      } else {
        return false;
      }
    },

    // save of all changes of current user
    async saveChangesUser() {
      const user = {
        name:
          this.editedName === this.currentUser.name ? null : this.editedName,
        email:
          this.editedEmail === this.currentUser.email ? null : this.editedEmail,
        password: !this.editedPassword ? null : this.editedPassword,
      };

      if (this.validateInput() && (user.name || user.email || user.password)) {
        if (user.name && !user.email && !user.password) {
          await this.updateUser(user);

          this.isCheckedCurrentPassword = false;
          this.modal = false;

          return;
        } else if (!this.isCheckedCurrentPassword) {
          this.modalCurrentPassword = true;

          return;
        } else {
          await this.updateUser(user);

          this.isCheckedCurrentPassword = false;
        }
      } else {
        this.modal = false;
      }
    },

    // executed when the current password is confirmed
    async passwordAccepted() {
      this.isCheckedCurrentPassword = true;
      await this.saveChangesUser();
      this.modal = false;
    },

    // cancel of all changes
    cancelEditing() {
      this.editedConfirmPassword = '';
      this.editedEmail = this.currentUser.email;
      this.editedName = this.currentUser.name;
      this.editedPassword = '';
      this.modal = false;
      this.modalCurrentPassword = false;
    },
  },
};
</script>
