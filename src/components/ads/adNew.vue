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
                    <v-text-field
                        name="price" 
                        label="Price"
                        type="number" 
                        color="teal"
                        :rules="priceRules"
                        counter="20"
                        v-model="price"
                        validate-on-blur
                        >
                    </v-text-field>
                </v-form>
                <v-row>
                    <v-col>
                        <v-btn
                            color="blue-grey"
                            class="my-2 white--text mt-3"
                            @click="triggerUpload"
                            >
                            Upload
                            <v-icon
                                right
                                dark
                            >
                                mdi-cloud-upload
                            </v-icon>
                        </v-btn>
                        <input 
                        ref="fileInput"
                            type="file" 
                            style="display: none;"
                            accept="image/*"
                            @change="onFileChange"
                            >
                        
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
                        <v-img :src="imageSrc" v-if="imageSrc" alt="" contain max-height="350" class="d-block"></v-img>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="sm-12">
                        <v-btn 
                        :loading="loading"
                        :disabled="!valid || !image || loading"
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
            image: null,
            imageSrc: '',
            promo: false,
            price: null,
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
            ],
            priceRules: [
                v => (v && v.length <= 20) || 'The price must be equal or less than 20 characters',
            ]
        }
    },
    computed: {
        loading () {
            return this.$store.getters.loading
        }
    },
    methods: {
        createAd () {
            if (this.$refs.form.validate() && this.image) {
                const ad = {
                    title: this.title,
                    description: this.description,
                    promo: this.promo,
                    image: this.image,
                    price: Number(this.price),
                }
                this.$store.dispatch('createAd', ad)
                    .then( () => {
                        this.$router.push('/list')
                    }) 
                    .catch( () => {})
            }
        },
        triggerUpload () {
            this.$refs.fileInput.click()
        },
        onFileChange (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.imageSrc = reader.result;
            }
            reader.readAsDataURL(file)
            this.image = file
        }
    }
}
</script>