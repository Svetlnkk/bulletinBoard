<template>
    <v-container>
        <v-row>
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
                                input-value="orders.done"
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
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            orders: [
                {
                    id: 'dsfa',
                    name: 'List',
                    phone: '8-900-121-12-85',
                    adId: '12312',
                    done: false,
                }
            ]
        }
    },
    methods: {
        markDone (order) {
            order.done = true
        }
    }
}
</script>