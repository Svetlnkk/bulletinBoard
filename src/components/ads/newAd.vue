<template>
    <v-container>
        <v-row>
            <v-col class='col-sm-8 col-lg-6 mx-auto'>
                <h1 class="text--secondary mb-3">Create new ad</h1>
                 <v-form 
                    ref="form"
                    v-model="valid"
                    >
    
                    <v-text-field
                        name="title" 
                        label="Ad title"
                        type="text" 
                        color="teal"
                        required
                        :rules="titleRules"
                        counter="60"
                        v-model="title"
                        validate-on-blur
                        >
                        </v-text-field>
                    <v-textarea 
                        name="description" 
                        label="Ad description"
                        color="teal"
                        type="text"
                        v-model="description"
                        :rules="descriptionRules"
                        counter="1000"
                        validate-on-blur
                    >
                    </v-textarea>
                </v-form>
                <v-row>
                    <v-col>
                        <v-btn
                            :loading="loading3"
                            :disabled="loading3"
                            color="blue-grey"
                            class="my-2 white--text mt-3"
                            @click="loader = 'loading3'"
                            >
                            Upload
                            <v-icon
                                right
                                dark
                            >
                                mdi-cloud-upload
                            </v-icon>
                        </v-btn>
                        
                    </v-col>
                    <v-col>
                         <v-switch
                            v-model="promo"
                            inset
                            label="Add to promo?"
                            color="teal"
                            >
                        </v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-img src="" alt="" max-height="150" class="d-block"></v-img>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="sm-12">
                        <v-btn 
                        :disabled="!valid"
                        class="success"
                        block
                        @click="createAd"
                        >
                        Create ad</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            description: '',
            imageSrc: 'https://i.pinimg.com/474x/77/99/f5/7799f530a3609570afc09d32450b4508.jpg',
            promo: false,
            valid: false,
            titleRules: [
                v => !!v || 'Title is required',
                v => (v && v.length >= 4) || 'Title must be equal or more than 4 characters',
                v => (v && v.length <= 60) || 'Title must be equal or less than 60 characters',
            ],
            descriptionRules: [
                v => !!v || 'Description is required',
                v => (v && v.length >= 30) || 'Description must be equal or more than 30 characters',
                v => (v && v.length <= 1000) || 'Description must be equal or less than 1000 characters',
            ]
        }
    },
    methods: {
        createAd () {
            if (this.$refs.form.validate()) {
                const ad = {
                    title: this.title,
                    description: this.description,
                    promo: this.promo,
                    imageSrc: 'https://i.pinimg.com/474x/77/99/f5/7799f530a3609570afc09d32450b4508.jpg'
                }
                this.$store.dispatch('createAd', ad)
            }
        }
    }
}
</script>