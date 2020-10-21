<template>
    <v-dialog v-model="modal" width="400">
        <!-- dialog activator -->
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                class="orange white--text mr-3"
                depressed
                v-on="on"
            >
                Edit</v-btn
            >
        </template>

        <!-- dialog body -->
        <v-card>
            <v-container>
                <!-- title -->
                <v-row>
                    <v-col class="col-xs-12 py-0 orange">
                        <v-card-title>
                            <h1 class="text-h5 text-sm-h4 font-weight-bold">
                                Edit ad
                            </h1>
                        </v-card-title>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <!-- form -->
                <v-row>
                    <v-col class="col-xs-12">
                        <v-card-text>
                            <v-form ref="formEdit" v-model="valid">
                                <v-text-field
                                    v-model="editedTitle"
                                    :rules="editedTitleRules"
                                    color="teal"
                                    counter="60"
                                    label="Ad title"
                                    name="title"
                                    required
                                    type="text"
                                    validate-on-blur
                                >
                                </v-text-field>
                                <v-textarea
                                    v-model="editedDescription"
                                    :rules="editedDescriptionRules"
                                    color="teal"
                                    counter="1000"
                                    label="Ad description"
                                    name="description"
                                    type="text"
                                    validate-on-blur
                                >
                                </v-textarea>
                                <v-text-field
                                    v-model="editedPrice"
                                    :rules="priceRules"
                                    color="teal"
                                    counter="20"
                                    label="Price"
                                    name="price"
                                    type="number"
                                    validate-on-blur
                                >
                                </v-text-field>
                            </v-form>
                        </v-card-text>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <!-- actions -->
                <v-row>
                    <v-col class="col-xs-12">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="onCancel">Cancel</v-btn>
                            <v-btn
                                class="orange white--text"
                                depressed
                                @click="onSave"
                                >Save</v-btn
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
            valid: false,
            editedTitle: this.ad.title,
            editedTitleRules: [
                (v) => !!v || "Title is required",
                (v) =>
                    (v && v.length >= 4) ||
                    "Title must be equal or more than 4 characters",
                (v) =>
                    (v && v.length <= 60) ||
                    "Title must be equal or less than 60 characters",
            ],
            editedDescription: this.ad.description,
            editedDescriptionRules: [
                (v) => !!v || "Description is required",
                (v) =>
                    (v && v.length >= 30) ||
                    "Description must be equal or more than 30 characters",
                (v) =>
                    (v && v.length <= 1000) ||
                    "Description must be equal or less than 1000 characters",
            ],
            editedPrice: this.ad.price,
            priceRules: [
                (v) =>
                    (String(v) && String(v).length <= 20) ||
                    "The price must be equal or less than 20 digits",
            ],
        };
    },
    methods: {
        onCancel() {
            this.editedTitle = this.ad.title;
            this.editedDescription = this.ad.description;
            this.editedPrice = Number(this.ad.price);
            this.modal = false;
        },
        onSave() {
            if (this.$refs.formEdit.validate()) {
                this.$store.dispatch("updateAd", {
                    title: this.editedTitle,
                    description: this.editedDescription,
                    id: this.ad.id,
                    price: Number(this.editedPrice),
                });
            }
        },
    },
};
</script>
