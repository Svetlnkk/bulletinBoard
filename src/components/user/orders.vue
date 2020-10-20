<template>
    <v-container>
        <v-row v-if="loading">
            <v-col class='col-sm-8 col-lg-6 mx-auto pt-5'>
                <v-progress-circular
                    :size="50"
                    :width="4"
                    color="teal"
                    indeterminate
                    >
                    </v-progress-circular>
            </v-col>
        </v-row>
        <v-row v-else-if="!loading && orders.length !== 0">
            <v-col class='col-sm-8 col-lg-6 mx-auto'>
                <h1 class="text--secondary mb-3">Orders</h1>
                <v-list
                    subheader
                    two-line
                    flat
                    >
                    <v-list-item
                        v-for="order in orders"
                        :key="order.id"
                    >
                        <template>

                            <v-list-item-action>
                            <v-checkbox
                                success
                                :disabled="order.done"
                                :input-value="order.done"
                                @change="markDone(order)"
                            >
                            </v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content>
                            <v-list-item-title>{{ order.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ order.phone }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-btn
                                    class="teal white--text"
                                    :to="/ad/ + order.adId"
                                    >
                                    Open</v-btn>
                            </v-list-item-action>
                        </template>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
                <h1 class="text--secondary">You have no orders</h1>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    computed: {
        loading () {
            return this.$store.getters.loading
        },
        orders () {
            return this.$store.getters.orders
        }
    },
    methods: {
        markDone (order) {
            this.$store.dispatch('markOrderDone', order.id)
                .then( () => order.done = true )
                .catch( () => {} )
        }
    },
    created() {
        this.$store.dispatch('fetchOrders')
    }
}
</script>