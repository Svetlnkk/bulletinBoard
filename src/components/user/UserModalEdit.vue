<template>
  <v-dialog v-model="modal" width="400">
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
              <v-form ref="formEdit" v-model="valid">
                <!-- user edit dialog name input -->
                <v-text-field
                  v-model="editedName"
                  :rules="nameEditRules"
                  color="teal"
                  counter="30"
                  label="User name"
                  name="name"
                  required
                  type="text"
                  validate-on-blur
                >
                </v-text-field>

                <!-- user edit dialog email input -->
                <v-text-field
                  v-model="editedEmail"
                  :rules="emailEditRules"
                  color="teal"
                  counter
                  label="Email"
                  name="email"
                  required
                  type="email"
                  validate-on-blur
                >
                </v-text-field>

                <!-- user edit dialog password input -->
                <v-text-field
                  v-model="editedPassword"
                  :rules="passwordEditRules"
                  color="teal"
                  counter
                  label="New password"
                  name="password"
                  type="password"
                  validate-on-blur
                >
                </v-text-field>

                <!-- user edit dialog confirm password input -->
                <v-text-field
                  v-model="editedConfirmPassword"
                  :rules="confirmEditPasswordRules"
                  color="teal"
                  counter
                  label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  validate-on-blur
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
              <v-btn text @click="onCancel">Cancel</v-btn>

              <!-- user edit dialog save button -->
              <v-btn
                :disabled="!valid"
                class="teal darken-2 white--text"
                depressed
                @click="onSave"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- dialog old (current) password -->
    <v-dialog v-model="modalPassword" width="400">
      <v-card>
        <v-container>
          <!-- dialog old (current) title -->
          <v-row>
            <v-col class="col-12 teal darken-3">
              <v-card-title class="subtitle-1 white--text">
                <h4>Enter <u>current</u> password</h4>
              </v-card-title>
            </v-col>
          </v-row>

          <!-- dialog old (current) password -->
          <v-row>
            <v-col class="col-12">
              <v-text-field
                v-model="currentPassword"
                color="teal darken-3"
                label="********"
                name="currentPassword"
                single-line
                type="password"
              >
              </v-text-field>
            </v-col>
          </v-row>

          <!-- dialog old (current) actions -->
          <v-row>
            <v-col class="col-12">
              <v-card-actions class="px-0">
                <v-spacer></v-spacer>

                <!-- dialog old (current) cancel button -->
                <v-btn text @click="modalPassword = false">Cancel</v-btn>

                <!-- dialog old (current) save button -->
                <v-btn
                  :loading="localLoading"
                  class="teal darken-3 white--text"
                  depressed
                  @click="checkPassword"
                  >Ok</v-btn
                >
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    currentUser: Object,
  },
  data() {
    return {
      currentPassword: '',
      editedConfirmPassword: '',
      editedEmail: this.currentUser.email,
      editedName: this.currentUser.name,
      editedPassword: '',
      isCheckedCurrentPassword: false,
      localLoading: false,
      modal: false,
      modalPassword: false,
      valid: false,
      emailEditRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordEditRules: [
        (v) =>
          (v && v.length >= 6) ||
          v.length === 0 ||
          'Password must be equal or more than 6 characters',
        (v) => !/\s/.test(v) || v.length === 0 || 'No spaces are allowed',
        (v) =>
          /[a-z]/.test(v) ||
          v.length === 0 ||
          'Need at least one latin letter with lowercase',
        (v) =>
          /[A-Z]/.test(v) ||
          v.length === 0 ||
          'Need at least one latin letter with uppercase',
        (v) => /\d/.test(v) || v.length === 0 || 'Need at least one digit',
        (v) =>
          !/\W/.test(v) ||
          v.length === 0 ||
          'You can not enter anything other than Latin letters and digits',
      ],
      confirmEditPasswordRules: [
        (v) => v === this.editedPassword || 'Password must match',
      ],
      nameEditRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length >= 2) ||
          'Name must be equal or more than 2 characters',
        (v) =>
          (v && v.length <= 30) ||
          'Name must be equal or less than 30 characters',
      ],
    };
  },
  methods: {
    ...mapActions('user', ['checkAuthenticate', 'updateUser']),

    // cancel of all changes
    onCancel() {
      this.editedName = this.currentUser.name;
      this.editedEmail = this.currentUser.email;
      this.editedPassword = '';
      this.editedConfirmPassword = '';
      this.currentPassword = '';
      this.modal = false;
    },

    // check old password
    async checkPassword() {
      this.localLoading = true;

      try {
        await this.checkAuthenticate(this.currentPassword);
        this.localLoading = false;
        this.modalPassword = false;
        this.currentPassword = '';
        this.isCheckedCurrentPassword = true;

        this.onSave();
      } catch (error) {
        this.currentPassword = '';
        this.isCheckedCurrentPassword = false;
        this.localLoading = false;
        throw error;
      }
    },

    // submit of all changes
    async onSave() {
      const user = {
        name:
          this.editedName === this.currentUser.name ? null : this.editedName,
        email:
          this.editedEmail === this.currentUser.email ? null : this.editedEmail,
        password: !this.editedPassword ? null : this.editedPassword,
      };

      if (
        this.$refs.formEdit.validate() &&
        (user.name || user.email || user.password)
      ) {
        if (user.name && !user.email && !user.password) {
          this.updateUser(user);
          this.isCheckedCurrentPassword = false;
          this.modal = false;
          return;
        } else if (!this.isCheckedCurrentPassword) {
          this.modalPassword = true;
          return;
        } else {
          this.updateUser(user);

          this.isCheckedCurrentPassword = false;
          this.modal = false;
        }
      } else {
        this.modal = false;
      }
    },
  },
};
</script>
