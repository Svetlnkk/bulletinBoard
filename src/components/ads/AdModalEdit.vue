<template>
    <v-dialog width="400" v-model="modal">
        <template v-slot:activator="{ on, attrs }">
            <v-btn 
            class="orange white--text mr-3"
            depressed
            v-bind="attrs"
            v-on="on"
            >
            Edit</v-btn>
        </template>
        <v-card>
            <v-container>
                <v-row>
                    <v-col class="col-xs-12 py-0 orange">
                        <v-card-title>
                            <h1 class="text-h5 text-sm-h4 font-weight-bold">Edit ad</h1>
                        </v-card-title>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                    <v-col class="col-xs-12">
                        <v-card-text>
                            <v-form 
                                ref="formEdit"
                                v-model="valid"
                            >
                                <v-text-field
                                    name="title" 
                                    label="Ad title"
                                    type="text" 
                                    color="teal"
                                    required
                                    :rules="editedTitleRules"
                                    counter="60"
                                    v-model="editedTitle"
                                    validate-on-blur
                                    >
                                </v-text-field>
                                <v-textarea 
                                    name="description" 
                                    label="Ad description"
                                    color="teal"
                                    type="text"
                                    v-model="editedDescription"
                                    :rules="editedDescriptionRules"
                                    counter="1000"
                                    validate-on-blur
                                >
                                </v-textarea>
                                <v-text-field
                                    name="price" 
                                    label="Price"
                                    type="number" 
                                    color="teal"
                                    :rules="priceRules"
                                    counter="20"
                                    v-model="editedPrice"
                                    validate-on-blur
                                    >
                                </v-text-field>
                            </v-form>
                        </v-card-text>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row>
                    <v-col class="col-xs-12">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="" text @click='onCancel'>Cancel</v-btn>
                            <v-btn class="orange white--text" depressed @click='onSave'>Save</v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['ad'],
    data () {
        return {
            modal: false,
            valid: false,
            editedTitle: this.ad.title,
            editedDescription: this.ad.description,
            editedPrice: this.ad.price,
            editedTitleRules: [
                v => !!v || 'Title is required',
                v => (v && v.length >= 4) || 'Title must be equal or more than 4 characters',
                v => (v && v.length <= 60) || 'Title must be equal or less than 60 characters',
            ],
            editedDescriptionRules: [
                v => !!v || 'Description is required',
                v => (v && v.length >= 30) || 'Description must be equal or more than 30 characters',
                v => (v && v.length <= 1000) || 'Description must be equal or less than 1000 characters',
            ],
            priceRules: [
                v => (String(v) && String(v).length <= 20) || 'The price must be equal or less than 20 digits',
            ]
        }
    },
    methods: {
        onCancel () {
            this.editedTitle = this.ad.title;
            this.editedDescription = this.ad.description;
            this.editedPrice = Number(this.ad.price);
            this.modal = false;
        },
        onSave () {
            if (this.$refs.formEdit.validate()) {
                this.$store.dispatch('updateAd', {
                    title: this.editedTitle,
                    description: this.editedDescription,
                    id: this.ad.id,
                    price: Number(this.editedPrice),
                })
            }
        },
    }
}
</script>

<style>

</style>