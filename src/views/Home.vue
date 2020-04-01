<template>
  <div class="home container">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div class="row row--center">
      <button class="cursor--outline">DOPE BUTTON</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
  }
};
</script>

<style lang="scss" scoped>
button {
  margin-top: 60px;
  background: transparent;
  border: 1px solid var(--color-text);
  padding: 4px 16px;
  color: var(--color-text);
  font-weight: bold;
  font-size: 16px;
}
</style>
