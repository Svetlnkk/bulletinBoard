<template>
    <v-dialog width="400" v-model="modal">
        <template v-slot:activator="{ on, attrs }">
            <v-btn 
            class="primary white--text"
            depressed
            v-if="!isOwner"
            v-bind="attrs"
            v-on="on"
            >
            Buy</v-btn>
            <v-btn 
                v-else
                disabled
                >Your Ad</v-btn>
        </template>
        <v-card>
            <v-container>
                <v-row>
                    <v-col class="col-xs-12 py-0 primary">
                        <v-card-title>
                            <h2 class="white--text modal__title">Do you want to buy it?</h2>
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
                                    name="name" 
                                    label="Your name"
                                    type="text" 
                                    color="teal"
                                    required
                                    :rules="nameRules"
                                    counter="60"
                                    v-model="name"
                                    validate-on-blur
                                    >
                                </v-text-field>
                                <v-text-field 
                                    name="phone" 
                                    label="Your phone"
                                    color="teal"
                                    type="text"
                                    v-model="phone"
                                    :rules="phoneRules"
                                    counter
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
                            <v-btn
                            class=""
                            text
                            @click='onCancel'
                            :disabled="localLoading"
                            >Close</v-btn>
                            <v-btn
                            class="primary"
                            depressed
                            @click='onSave'
                            :disabled="localLoading"
                            :loading="localLoading"
                            >Buy it</v-btn>
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
            name: '',
            phone: '',
            localLoading: false,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length >= 2) || 'Name must be equal or more than 2 characters',
                v => (v && v.length <= 60) || 'Name must be equal or less than 60 characters',
            ],
            phoneRules: [
                v => !!v || 'Phone is required',
                v => (v && v.length >= 5) || 'Phone must be equal or more than 5 characters',
                v => (v && v.length <= 30) || 'Phone must be equal or less than 30 characters',
                v => !/\s/.test(v) || 'No spaces are allowed',
                v => /^[0-9 +]+$/.test(v) || 'Phone can only contain digits and  + sign',
            ],

        }
    },
    computed: {
        isOwner () {
            if(!this.$store.getters.user.id) return
            return this.ad.ownerId === this.$store.getters.user.id
        },
    },
    methods: {
        onCancel () {
            this.name = '';
            this.phone = ''
            this.modal = false;
            this.localLoading = false;
        },
        onSave () {
            if (this.$refs.formEdit.validate()) {
                this.localLoading = true;
                this.$store.dispatch('createOrder', {
                    name: this.name,
                    phone: this.phone,
                    adId: this.ad.id,
                    ownerId: this.ad.ownerId,
                })
                .finally( () => {
                    this.name = '';
                    this.phone = '';
                    this.localLoading = false;
                    this.modal = false;
                })
            }
        }
    }
}
</script>

<style>
.v-card__title .modal__title {
        word-break: normal;
    }
</style>

<style scoped>
    
</style>