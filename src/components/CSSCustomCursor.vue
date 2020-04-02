<template>
  <div id="app">
    <div class="app-container">
      <div class="app-container__inner">
        <div class="cursor cursor--small" ref="cursor--small">
          <svg
            id="cursorPlus"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 19.5417 19.5417"
          >
            <path
              d="M9.7708,0a9.7709,9.7709,0,1,0,9.7709,9.7708A9.76,9.76,0,0,0,9.7708,0Zm4.5736,10.6024h-3.742v3.742H8.9393v-3.742H5.1973V8.9393h3.742V5.1973h1.6631v3.742h3.742Z"
            />
          </svg>
        </div>
        <div
          class="cursor cursor--trail"
          ref="cursor--trail"
          :style="{
            marginTop: `${trailingCursorStyles.y}px`,
            marginLeft: `${trailingCursorStyles.x}px`,
            width: `${trailingCursorStyles.width}px`,
            height: `${trailingCursorStyles.height}px`,
            borderRadius: `${trailingCursorStyles.radius}%`
          }"
        ></div>
        <canvas class="cursor cursor--canvas" resize></canvas>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
export default {
  name: "CustomCursor",
  data() {
    return {
      isStuck: false,
      lastX: 0,
      lastY: 0,
      stuckX: "",
      stuckY: "",
      clientX: null,
      clientY: null,
      trailingCursorStyles: {
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        radius: 100
      },
      animationSpeed: 0.25
    };
  },
  mounted() {
    this.setUpCursor();
    this.setUpHoverState();
    this.setUpMagnet();
  },
  methods: {
    setUpCursor() {
      // set the starting position of the cursor outside of the screen
      this.clientX = -100;
      this.clientY = -100;
      this.innerCursor = this.$refs["cursor--small"];
      this.trailingCursor = this.$refs["cursor--trail"];

      // add listener to track the current mouse position
      document.addEventListener("mousemove", e => {
        this.clientX = e.clientX;
        this.clientY = e.clientY;
      });

      // transform the innerCursor to the current mouse position
      // use requestAnimationFrame() for smooth performance
      const render = () => {
        this.innerCursor.style.transform = `translate(${this.clientX}px, ${this.clientY}px)`;
        this.trailingCursor.style.marginLeft = `${this.trailingCursorStyles.x}px`;
        this.trailingCursor.style.marginTop = `${this.trailingCursorStyles.y}px`;

        if (!this.isStuck) {
          // move circle around normally
          this.lastX = this.lerp(this.lastX, this.clientX, 0.2);
          this.lastY = this.lerp(this.lastY, this.clientY, 0.2);
          this.trailingCursorStyles.x = this.lastX;
          this.trailingCursorStyles.y = this.lastY;
        } else if (this.isStuck) {
          // fixed position on a nav item
          this.lastX = this.lerp(this.lastX, this.stuckX, 0.2);
          this.lastY = this.lerp(this.lastY, this.stuckY, 0.2);
          this.trailingCursorStyles.x = this.lastX;
          this.trailingCursorStyles.y = this.lastY;
        }

        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    },
    setUpHoverState() {
      // find the center of the link element and set stuckX and stuckY
      // these are needed to set the position of the noisy circle
      const handleMouseEnter = e => {
        const navItem = e.currentTarget;
        this.navItemBox = navItem.getBoundingClientRect();
        this.stuckX = Math.round(
          this.navItemBox.left + this.navItemBox.width / 2
        );
        this.stuckY = Math.round(
          this.navItemBox.top + this.navItemBox.height / 2
        );
        this.isStuck = true;

        gsap.to(this.trailingCursorStyles, {
          width: this.navItemBox.width,
          height: this.navItemBox.height,
          radius: 0,
          duration: 0.25
        });
      };

      // reset isStuck on mouseLeave
      const handleMouseLeave = () => {
        this.isStuck = false;
        setTimeout(() => {
          if (!this.isStuck) {
            gsap.to(this.trailingCursorStyles, {
              width: 30,
              height: 30,
              duration: this.animationSpeed
            });
            gsap.to(this.trailingCursorStyles, {
              radius: 100,
              duration: 0.1,
              delay: 0.15
            });
          }
        }, 50);
      };

      const handleImageMouseEnter = () => {
        // gsap.to(this.trailingCursor, {
        //   opacity: 0,
        //   duration: 0.25
        // });
        this.innerCursor.classList.add("cursor--image");
      };
      const handleImageMouseLeave = () => {
        // gsap.to(this.trailingCursor, {
        //   opacity: 1,
        //   duration: 0.25,
        //   delay: 0.15
        // });
        this.innerCursor.classList.remove("cursor--image");
      };

      // add event listeners to nav links
      const linkItems = document.querySelectorAll(".nav__link");
      linkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });

      // add event listeners to nav links
      const outlines = document.querySelectorAll(".cursor--outline");
      outlines.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });

      const images = document.querySelectorAll("img");
      images.forEach(item => {
        item.addEventListener("mouseenter", handleImageMouseEnter);
        item.addEventListener("mouseleave", handleImageMouseLeave);
      });
    },
    lerp(a, b, n) {
      return (1 - n) * a + n * b;
    },
    map(value, in_min, in_max, out_min, out_max) {
      return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
    }
  }
};
</script>
<style lang="scss" scoped>
#app,
.page,
.page a,
.page a:hover {
  cursor: none;
}

.app-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__inner {
    width: 100%;
    height: 100%;
  }
}
#cursorPlus {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  fill: #fff;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0) rotate(0deg);
  transition: 0.25s linear;
}
.cursor {
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  &--small {
    width: 5px;
    height: 5px;
    left: -2.5px;
    top: -2.5px;
    border-radius: 50%;
    z-index: 11000;
    background: var(--color-text);
  }
  &--trail {
    content: "";
    border: 1px red solid;
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%);
  }
  &--image {
    &.cursor--small {
      background: transparent;
    }
    #cursorPlus {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1) rotate(90deg);
    }
  }
  &--canvas {
    width: 100vw;
    height: 100vh;
    z-index: 12000;
  }
}
</style>
