<template>
<v-container fluid fill-height>
    <v-row class="align-center justify-center">
        <v-col class="col-xs-12 col-sm-8 col-md-4">
            <v-card class="elevation-12">

            <v-app-bar dark color="teal">
                <v-toolbar-title>Login form</v-toolbar-title>
            </v-app-bar>

            <v-card-text>
                <v-form 
                    ref="form"
                    v-model="valid"
                    >
    
                    <v-text-field
                        prepend-icon="mdi-account"
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
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        name="password" 
                        label="Password"
                        :type="show? 'text' : 'password'" 
                        color="teal"
                        v-model="password"
                        :rules="passwordRules"
                        counter
                        @click:append="show = !show"
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
                Login</v-btn>
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
            show: false,
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
            ]
        }
    },
    computed: {
        loading() {
            return this.$store.getters.loading
        }
    },
    methods: {
        onSubmit() {
            if (this.$refs.form.validate()) {
                const user = {
                    email: this.email,
                    password: this.password,
                    valid: this.valid,
                }

                this.$store.dispatch('loginUser', user)
                    .then( () => {
                        this.$router.push('/')
                    })
                    .catch( () => {} )
            }
        }
    },
    created() {
        if(this.$route.query['loginError']) {
            this.$store.dispatch('setError', 'Please log in to access this page')
        }
    }
}
</script>