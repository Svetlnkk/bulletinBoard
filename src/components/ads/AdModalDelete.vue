<template>
  <v-dialog v-model="modal" width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" class="red white--text mr-3" depressed v-on="on">
        Delete
      </v-btn>
    </template>
    <v-card>
      <v-container>
        <v-row>
          <v-col class="col-xs-12 py-0 red">
            <v-card-title class="white--text">
              Delete this ad?
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="onCancel">
                Cancel
              </v-btn>
              <v-btn class="red white--text" depressed @click="onDelete"
                >Ok</v-btn
              >
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    ad: String,
  },
  data() {
    return {
      modal: false,
    };
  },
  methods: {
    onCancel() {
      this.modal = false;
    },
    onDelete() {
      this.$store
        .dispatch('deleteAd', {
          id: this.ad.id,
          imageSrc: this.ad.imageSrc,
        })
        .then(() => {
          this.modal = false;
          this.$router.push('/list');
        });
    },
  },
};
</script>
