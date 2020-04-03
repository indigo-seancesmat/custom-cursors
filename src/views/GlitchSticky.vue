<template>
  <CustomCursor>
    <div class="home container">
      <div class="row row--center">
        <a href="#" class="glitch-link"><h1>Quarantine</h1></a>
      </div>
    </div>
  </CustomCursor>
</template>

<script>
import CustomCursor from "@/components/GlitchStickyCursor";

export default {
  name: "GlitchSticky",
  components: {
    CustomCursor
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  text-transform: uppercase;
  color: #ef1455;
  margin-top: 25vh;
}
h1 {
  font-size: 100px;
  margin: 0;
}
</style>
