<template>
    <v-dialog width="400" v-model="modal">
        <template v-slot:activator="{ on, attrs }">
            <v-btn 
            class="teal darken-2 white--text mr-3"
            depressed
            v-bind="attrs"
            v-on="on"
            >
            Edit</v-btn>
        </template>
        <v-card>
            <v-container>
                <v-row>
                    <v-col class="col-xs-12 py-0 teal darken-2">
                        <v-card-title class="text-subtitle-1 text-sm-h5">
                            <h3 class="white--text">Change user settings</h3>
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
                                    label="User name"
                                    type="text"
                                    color="teal"
                                    required
                                    v-model="editedName"
                                    :rules="nameEditRules"
                                    counter="30"
                                    validate-on-blur
                                    >
                                </v-text-field>
                                <v-text-field 
                                    name="email" 
                                    label="Email"
                                    color="teal"
                                    type="email"
                                    required
                                    v-model="editedEmail"
                                    :rules="emailEditRules"
                                    counter
                                    validate-on-blur
                                >
                                </v-text-field>
                                <v-text-field 
                                    name="password" 
                                    label="New password"
                                    color="teal"
                                    type="password"
                                    v-model="editedPassword"
                                    :rules="passwordEditRules"
                                    counter
                                    validate-on-blur
                                >
                                </v-text-field>
                                <v-text-field 
                                    name="confirmPassword" 
                                    label="Confirm new password"
                                    color="teal"
                                    type="password"
                                    v-model="editedConfirmPassword"
                                    :rules="confirmEditPasswordRules"
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
                            <v-btn class="" text @click='onCancel'>Cancel</v-btn>
                            <v-btn class="teal darken-2 white--text" :disabled="!valid" depressed @click='onSave'>Save</v-btn>
                            <!-- <v-btn class="success" depressed @click='checkPassword'>PasswordModal</v-btn> -->
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-dialog width="400" v-model="modalPassword">
            <v-card>
                <v-container>
                    <v-row>
                        <v-col class="col-xs-12">
                            <v-card-title class="subtitle-1">
                                <h4>Enter current password</h4>
                            </v-card-title>

                            <v-text-field
                                name="currentPassword"
                                label="********"
                                single-line
                                color="teal"
                                type="password"
                                v-model="currentPassword"
                            >
                            </v-text-field>

                            <v-card-actions class="px-0">
                            <v-spacer></v-spacer>
                            <v-btn class="" @click="modalPassword = false" text>Cancel</v-btn>
                            <v-btn class="teal darken-2 white--text" depressed @click="checkPassword" :loading="localLoading">Ok</v-btn>
                        </v-card-actions>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script>
export default {
    props: ['user', 'userName'],
    data () {
        return {
            modal: false,
            modalPassword: false,
            currentPassword: '',
            isCheckedCurrentPassword: false,
            valid: false,
            editedName: this.user.name,
            editedEmail: this.user.email,
            editedPassword: '',
            editedConfirmPassword: '',
            localLoading: false,
            emailEditRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            passwordEditRules: [
                v => (v && v.length >= 6 || v.length === 0) || 'Password must be equal or more than 6 characters',
                v => (!/\s/.test(v) || v.length === 0) || 'No spaces are allowed',
                v => (/[a-z]/.test(v) || v.length === 0) || 'Need at least one latin letter with lowercase',
                v => (/[A-Z]/.test(v) || v.length === 0) || 'Need at least one latin letter with uppercase',
                v => (/\d/.test(v) || v.length === 0) || 'Need at least one digit',
                v => (!/\W/.test(v) || v.length === 0) ||  'You can not enter anything other than Latin letters and digits'
            ],
            confirmEditPasswordRules: [
                v => v === this.editedPassword || 'Password must match'
            ],
            nameEditRules: [
                v => !!v || 'Name is required',
                v => (v && v.length >= 2) || 'Name must be equal or more than 2 characters',
                v => (v && v.length <= 30) || 'Name must be equal or less than 30 characters',
            ]

        }
    },
    watch: {
        userName () {
            this.editedName = this.user.name;
        }
    },
    methods: {
        onCancel () {
            this.editedName = this.user.name;
            this.editedEmail = this.user.email;
            this.editedPassword = '';
            this.editedConfirmPassword = '';
            this.currentPassword = '';
            this.modal = false;
        },
        async checkPassword () {
            this.localLoading = true

            try {
                await this.$store.dispatch('checkAuthenticate', this.currentPassword)
                this.localLoading = false;
                this.modalPassword = false;
                this.currentPassword = '';
                this.isCheckedCurrentPassword = true;

                this.onSave()
            } catch (error) {
                this.currentPassword = '';
                this.isCheckedCurrentPassword = false;
                this.localLoading = false;
                throw error
            }
        },
        async onSave () {
            const user = {
                name: this.editedName === this.user.name ? null : this.editedName,
                email: this.editedEmail  === this.user.email ? null : this.editedEmail,
                password: !this.editedPassword ? null : this.editedPassword
            }

            if (this.$refs.formEdit.validate() && (user.name ||user.email || user.password)) {

                if(user.name && !user.email && !user.password) {
                    this.$store.dispatch('updateUser', user)
                    this.isCheckedCurrentPassword = false;
                    this.modal = false
                    return
                } else if(!this.isCheckedCurrentPassword) {
                    this.modalPassword = true;
                    return
                } else {
                    this.$store.dispatch('updateUser', user)

                this.isCheckedCurrentPassword = false;
                this.modal = false
                }
            } else {
                this.modal = false
            }
        },
    },
}
</script>

<style>

</style>

