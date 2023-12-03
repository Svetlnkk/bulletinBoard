<template>
  <!-- dialog old (current) password -->
  <v-dialog
    v-model="modalCurrentPassword"
    eager
    max-width="400"
    @click:outside="$emit('close')"
    @keydown.esc="$emit('close')"
  >
    <v-card>
      <v-container>
        <!-- dialog old (current) title -->
        <v-row>
          <v-col class="col-12 red darken-3">
            <v-card-title class="subtitle-1 white--text">
              <h4>Введите <u>текущий</u> пароль</h4>
            </v-card-title>
          </v-col>
        </v-row>

        <!-- dialog old (current) password -->
        <v-row>
          <v-col class="col-12">
            <v-text-field
              v-model="currentPassword"
              color="red darken-3"
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

              <v-btn text @click="$emit('close')">Отмена</v-btn>

              <!-- dialog old (current) save button -->
              <v-btn
                :loading="localLoading"
                class="red darken-3 white--text"
                depressed
                @click="checkPassword"
                >Сохранить</v-btn
              >
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'UserModalCurrentPassword',
  props: {
    modalCurrentPassword: Boolean,
  },
  data() {
    return {
      currentPassword: '',
      localLoading: false,
    };
  },
  methods: {
    ...mapActions('user', ['checkAuthenticate']),
    ...mapActions('shared', ['clearError', 'setError']),

    // check old password
    async checkPassword() {
      this.localLoading = true;

      try {
        this.clearError();

        await this.checkAuthenticate(this.currentPassword);

        this.localLoading = false;
        this.currentPassword = '';
        this.$emit('close');

        this.$emit('passwordAccepted');
      } catch (error) {
        this.currentPassword = '';
        this.localLoading = false;
        this.setError(error.message);
        throw error;
      }
    },
  },
};
</script>
