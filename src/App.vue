<template>
  <div id="app">
    <CustomCursor>
      <header class="header">
        <div class="header__inner">
          <div>Logo</div>
          <div id="nav" class="nav">
            <router-link to="/" class="nav__link">Home</router-link> |
            <router-link to="/about" class="nav__link">
              <svg
                class="settings-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <g class="settings-icon__group settings-icon__group--1">
                  <line
                    class="settings-icon__line"
                    x1="79.69"
                    y1="16.2"
                    x2="79.69"
                    y2="83.8"
                  />
                  <rect
                    class="settings-icon__rect"
                    x="73.59"
                    y="31.88"
                    width="12.19"
                    height="12.19"
                  />
                </g>
                <g class="settings-icon__group settings-icon__group--2">
                  <line
                    class="settings-icon__line"
                    x1="50.41"
                    y1="16.2"
                    x2="50.41"
                    y2="83.8"
                  />
                  <rect
                    class="settings-icon__rect"
                    x="44.31"
                    y="54.33"
                    width="12.19"
                    height="12.19"
                  />
                </g>
                <g class="settings-icon__group settings-icon__group--3">
                  <line
                    class="settings-icon__line"
                    x1="20.31"
                    y1="16.2"
                    x2="20.31"
                    y2="83.8"
                  />
                  <rect
                    class="settings-icon__rect"
                    x="14.22"
                    y="26.97"
                    width="12.19"
                    height="12.19"
                  />
                </g>
              </svg>
            </router-link>
          </div>
        </div>
      </header>
      <router-view />
    </CustomCursor>
  </div>
</template>

<script>
import CustomCursor from "@/components/CustomCursor";
export default {
  name: "App",
  components: {
    CustomCursor
  }
};
</script>

<style lang="scss">
html {
  --color-text: #fff;
  --color-bg: #171717;
  --color-link: #ff0000;
}

html,
body {
  margin: 0;
  padding: 0;
  color: var(--color-text);
  background: var(--color-bg);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    cursor: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.header {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  &__inner {
    width: 100%;
    max-width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.nav {
  display: flex;
  align-items: center;
  &__link {
    display: flex;
    width: 75px;
    height: 75px;
    margin: 0 5px;
    justify-content: center;
    align-items: center;

    .settings-icon {
      display: block;
      width: 40px;
      height: 40px;
    }
    .settings-icon__line {
      stroke: var(--color-text);
      stroke-width: 5px;
      transition: all 0.2s ease 0.05s;
    }
    .settings-icon__rect {
      stroke: var(--color-text);
      fill: var(--color-bg);
      stroke-width: 5px;
      transition: all 0.2s ease 0.05s;
    }

    &:hover .settings-icon__line,
    &:hover .settings-icon__rect {
      stroke: var(--color-link);
      transition: all 0.2s ease 0.05s;
    }
    &:hover .settings-icon__group--1 .settings-icon__rect {
      transform: translateY(20px);
    }
    &:hover .settings-icon__group--2 .settings-icon__rect {
      transform: translateY(-20px);
    }
    &:hover .settings-icon__group--3 .settings-icon__rect {
      transform: translateY(25px);
    }
  }
}

.container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.row {
  width: 100%;
  max-width: 1200px;
  display: flex;

  &.row--center {
    justify-content: center;
  }
}
</style>
