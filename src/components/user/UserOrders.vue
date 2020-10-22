<template>
  <v-container>
    <!-- in loading progress -->
    <v-row v-if="loading">
      <v-col class="col-sm-8 col-lg-6 mx-auto pt-5">
        <v-progress-circular :size="50" :width="4" color="teal" indeterminate>
        </v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="!loading && orders.length !== 0">
      <v-col class="col-sm-8 col-lg-6 mx-auto">
        <!-- title -->
        <h1 class="text--secondary mb-3">Orders</h1>
        <v-list flat subheader two-line>
          <!-- orders list -->
          <v-list-item v-for="order in orders" :key="order.id">
            <template>
              <!-- complete order -->
              <v-list-item-action>
                <v-checkbox
                  :disabled="order.done"
                  :input-value="order.done"
                  success
                  @change="markDone(order)"
                >
                </v-checkbox>
              </v-list-item-action>

              <!-- content -->
              <v-list-item-content>
                <!-- name -->
                <v-list-item-title>{{ order.name }}</v-list-item-title>

                <!-- phone -->
                <v-list-item-subtitle>{{ order.phone }}</v-list-item-subtitle>
              </v-list-item-content>

              <!-- open this ad -->
              <v-list-item-action>
                <v-btn :to="/ad/ + order.adId" class="teal white--text">
                  Open</v-btn
                >
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
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('shared', {
      loadingUser: 'loadingUser',
    }),
    ...mapGetters('orders', {
      orders: 'orders',
    }),
    loading() {
      return this.loadingUser;
    },
    orders() {
      return this.orders;
    },
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    ...mapActions('orders', {
      fetchOrders: 'fetchOrders',
      markOrderDone: 'markOrderDone',
    }),
    markDone(order) {
      this.markOrderDone(order.id)
        .then(() => (order.done = true))
        .catch(() => {});
    },
  },
};
</script>
