<template>
  <v-dialog
    v-model="modal"
    max-width="400"
    @keydown.esc="onCancel"
    @click:outside="onCancel"
  >
    <!-- activator -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" class="red white--text mr-3" depressed v-on="on">
        Delete
      </v-btn>
    </template>

    <!-- delete card -->
    <v-card>
      <v-container>
        <v-row>
          <v-col class="col-xs-12 py-0 red">
            <!-- delete title -->
            <v-card-title class="white--text">
              Delete this ad?
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
              <v-btn class="red white--text" depressed @click="onDelete">
                Ok
              </v-btn>
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
  props: {
    ad: Object,
  },
  data() {
    return {
      modal: false,
    };
  },
  methods: {
    ...mapActions('ads', ['deleteAd']),
    ...mapActions('shared', ['setError']),
    //  cancel to deleting ad
    onCancel() {
      this.modal = false;
    },

    // deleting ad
    async onDelete() {
      try {
        this.deleteAd({
          adId: this.ad.id,
          imageSrc: this.ad.imageSrc,
        });
        this.$router.push('/list');
      } catch (error) {
        this.modal = false;
        this.setError(error.message);
        throw error;
      }
    },
  },
};
</script>
