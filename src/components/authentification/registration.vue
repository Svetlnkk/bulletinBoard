<template>
<v-container fluid fill-height>
    <v-row class="align-center justify-center">
        <v-col class="col-xs-12 col-sm-8 col-md-4">
            <v-card class="elevation-12">

            <v-app-bar dark color="teal">
                <v-toolbar-title>Registration form</v-toolbar-title>
            </v-app-bar>

            <v-card-text>
                <v-form 
                    ref="form"
                    v-model="valid"
                    >
                    <v-text-field
                        prepend-icon="mdi-account"
                        name="name" 
                        label="Your name"
                        type="text" 
                        color="teal"
                        :rules="nameRules"
                        counter="30"
                        v-model="name"
                        validate-on-blur
                        >
                    </v-text-field>
                    <v-text-field
                        prepend-icon="mdi-email"
                        name="email" 
                        label="Email"
                        type="email" 
                        color="teal"
                        :rules="emailRules"
                        counter
                        v-model="email"
                        validate-on-blur
                        >
                    </v-text-field>
                    <v-text-field 
                        prepend-icon="mdi-lock" 
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        name="password" 
                        label="Password"
                        :type="showPassword? 'text' : 'password'" 
                        color="teal"
                        v-model="password"
                        :rules="passwordRules"
                        counter
                        @click:append="showPassword = !showPassword"
                        validate-on-blur
                    >
                    </v-text-field>
                    <v-text-field 
                        prepend-icon="mdi-lock" 
                        :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        name="confirm-password" 
                        label="Confirm password"
                        :type="showConfirmPassword? 'text' : 'password'" 
                        color="teal"
                        v-model="confirmPassword"
                        :rules="confirmPasswordRules"
                        counter
                        @click:append="showConfirmPassword = !showConfirmPassword"
                        validate-on-blur
                    >
                    </v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    color="teal"
                    text
                    @click.prevent="onSubmit"
                    :loading="loading"
                    :disabled="!valid || loading"
                >
                Create account</v-btn>
            </v-card-actions>
            
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>

export default {
    data () {
        return {
            email: '',
            password: '',
            name: '',
            showPassword: false,
            confirmPassword: '',
            showConfirmPassword: false,
            valid: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 6) || 'Password must be equal or more than 6 characters',
                v => !/\s/.test(v) || 'No spaces are allowed',
                v => /[a-z]/.test(v) || 'Need at least one latin letter with lowercase',
                v => /[A-Z]/.test(v) || 'Need at least one latin letter with uppercase',
                v => /\d/.test(v) || 'Need at least one digit',
                v => !/\W/.test(v) ||  'You can not enter anything other than Latin letters and digits'
            ],
            confirmPasswordRules: [
                v => !!v || 'Password is required',
                v => v === this.password || 'Password must match'
            ],
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 30) || 'Name must be equal or less than 30 characters',
            ]
        }
    },
    computed: {
        loading () {
            return this.$store.getters.loading
        },
    },
    methods: {
        onSubmit() {
            if (this.$refs.form.validate()) {
                const user = {
                    email: this.email,
                    password: this.password,
                    name: this.name
                }
                
                this.$store.dispatch('registerUser', user)
                    .then( () => {
                        this.$router.push('/')
                    })
                    .catch( () => {} )
            }
        },
    }
}
</script>