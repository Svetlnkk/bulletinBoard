<template>
  <v-dialog
    v-model="modal"
    eager
    max-width="400"
    @click:outside="onCancel"
    @keydown.esc="onCancel"
  >
    <!-- dialog delete activator -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" class="red--text mr-3" text v-on="on">
        Delete Account
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col class="col-xs-12 py-0 red">
            <!-- dialog title -->
            <v-card-title class="white--text">
              Delete your account?
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- dialog actions -->
            <v-card-actions>
              <v-spacer></v-spacer>

              <!-- dialog "cancel" button -->
              <v-btn text @click="onCancel">
                Cancel
              </v-btn>

              <!-- dialog "ok" button -->
              <v-btn
                class="red white--text"
                depressed
                @click="onDeleteCurrentUser"
              >
                Ok
              </v-btn>
            </v-card-actions>

            <!-- сonfirm the change with your current password -->
            <app-user-modal-current-password
              :isCheckedCurrentPassword="isCheckedCurrentPassword"
              :modalCurrentPassword="modalCurrentPassword"
              @close="modalCurrentPassword = false"
              @passwordAccepted="passwordAccepted"
            ></app-user-modal-current-password>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <app-user-modal-current-password></app-user-modal-current-password>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
import UserModalCurrentPassword from './UserModalCurrentPassword';

export default {
  components: {
    AppUserModalCurrentPassword: UserModalCurrentPassword,
  },
  data() {
    return {
      modal: false,
      modalCurrentPassword: false,
      isCheckedCurrentPassword: false,
    };
  },
  methods: {
    ...mapActions('user', ['deleteCurrentUser']),

    // deleting current user
    async onDeleteCurrentUser() {
      if (!this.isCheckedCurrentPassword) {
        this.modalCurrentPassword = true;
        return;
      } else {
        await this.deleteCurrentUser();
        this.modalCurrentPassword = false;
      }
    },

    // cancel deleting current user
    onCancel() {
      this.modal = false;
      this.modalCurrentPassword = false;
    },

    // executed when the current password is confirmed
    passwordAccepted() {
      this.isCheckedCurrentPassword = true;
      this.onDeleteCurrentUser();
      this.modal = false;
      this.$router.push('/');
    },
  },
};
</script>
