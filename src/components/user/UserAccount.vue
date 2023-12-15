<template>
  <v-container>
    <v-row>
      <v-col class="col-12 col-sm-8 mx-auto">
        <v-card v-if="!loading">
          <v-card-title class="teal darken-2">
            <span class="white--text">Настройки аккаунта</span>
            <v-spacer></v-spacer>
          </v-card-title>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-face</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title class="name-user">
                  {{ currentUser.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-email</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title class="email-user">
                  {{ currentUser.email }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>

            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-account-key-outline</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>●●●●●●●●</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>
          </v-list>

          <v-card-actions>
            <app-user-modal-delete
              :loading="loading"
              :currentUser="currentUser"
            ></app-user-modal-delete>

            <v-spacer></v-spacer>

            <app-user-modal-edit
              :loading="loading"
              :currentUser="currentUser"
            ></app-user-modal-edit>
          </v-card-actions>
        </v-card>

        <div v-else>
          <v-container>
            <v-row>
              <v-col class="col-xs-12 text-center pt-5">
                <v-progress-circular
                  :size="50"
                  :width="4"
                  color="teal"
                  indeterminate
                >
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import UserModalDelete from './UserModalDelete';
import UserModalEdit from './UserModalEdit';

export default {
  name: 'UserAccount',
  components: {
    AppUserModalDelete: UserModalDelete,
    AppUserModalEdit: UserModalEdit,
  },
  computed: {
    ...mapState('shared', ['loading']),
    ...mapState('user', ['currentUser']),
  },
};
</script>
