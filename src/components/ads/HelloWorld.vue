<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.hello {
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
}
</style>