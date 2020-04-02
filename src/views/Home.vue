<template>
  <div class="home container">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <div class="row row--center">
      <button class="cursor--outline">DOPE BUTTON</button>
    </div>
    <div class="row row--center">
      <img
        src="https://images.unsplash.com/photo-1487715433499-93acdc0bd7c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1414&q=80"
      />
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
  //   border: 1px solid var(--color-text);
  border: none;
  padding: 4px 16px;
  color: var(--color-text);
  font-weight: bold;
  font-size: 16px;
}
img {
  margin-top: 100px;
  max-width: 600px;
}
</style>
