<template>
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
</template>
<script>
export default {};
</script>
