<template>
  <div id="app">
    <header class="header">
      <div class="header__inner">
        <div class="logo">Logo</div>
        <div id="nav" class="nav">
          <router-link to="/" class="nav__link">Glitch</router-link> |
          <router-link to="/glitch-sticky" class="nav__link"
            >Glitch Sticky</router-link
          >
          |
          <router-link to="/canvas-wavy" class="nav__link">
            Canvas Wavy
          </router-link>
          |
          <router-link to="/attach" class="nav__link">
            Attach
          </router-link>
        </div>
      </div>
    </header>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
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
    color: #fff;
    cursor: none;
    padding: 0px 16px;
    text-decoration: none;

    &:last-child {
      margin-right: -16px;
    }

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
