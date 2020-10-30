<template>
  <v-dialog
    v-model="modal"
    max-width="400"
    @keydown="onCancelKeydown"
    @click:outside="onCancel"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" class="red--text mr-3" text v-on="on">
        Delete Account
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-row>
          <v-col class="col-xs-12 py-0 red">
            <!-- delete title -->
            <v-card-title class="white--text">
              Delete your account?
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- delete actions -->
            <v-card-actions>
              <v-spacer></v-spacer>

              <!-- delete "cancel" button -->
              <v-btn text @click="onCancel">
                Cancel
              </v-btn>

              <!-- delete "ok" button -->
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
              :modalCurrentPassword="modalCurrentPassword"
              :isCheckedCurrentPassword="isCheckedCurrentPassword"
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

    async onDeleteCurrentUser() {
      if (!this.isCheckedCurrentPassword) {
        this.modalCurrentPassword = true;
        return;
      } else {
        await this.deleteCurrentUser();
        this.modalCurrentPassword = false;
      }
    },
    onCancel() {
      this.modal = false;
      this.modalCurrentPassword = false;
    },
    onCancelKeydown(event) {
      if (event.code === 'Escape') {
        this.onCancel();
      } else {
        return;
      }
    },
    passwordAccepted() {
      this.isCheckedCurrentPassword = true;
      this.onDeleteCurrentUser();
      this.modal = false;
      this.$router.push('/');
    },
  },
};
</script>
