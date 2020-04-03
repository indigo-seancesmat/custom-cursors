<template>
  <div id="app">
    <div class="app-container">
      <div class="app-container__inner">
        <div class="cursor cursor--small" ref="cursor--small">
          <svg width="280" height="280" viewBox="0 0 280 280">
            <defs>
              <filter
                id="filter-1"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
                filterUnits="objectBoundingBox"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.02 0.15"
                  numOctaves="3"
                  result="warp"
                ></feTurbulence>
                <feDisplacementMap
                  xChannelSelector="R"
                  yChannelSelector="G"
                  :scale="scale"
                  in="SourceGraphic"
                  in2="warp"
                ></feDisplacementMap>
              </filter>
            </defs>
            <circle
              class="cursor__inner"
              cx="140"
              cy="140"
              :r="circleRadius"
              :stroke-width="strokeWidth"
              :style="{ filter: filter, stroke: '#fff', fill: 'transparent' }"
            ></circle>
          </svg>
        </div>
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
      animationSpeed: 0.25,
      circleRadius: 50,
      strokeWidth: 2,
      filter: "url('#filter-1')",
      scale: 0
    };
  },
  mounted() {
    this.setUpCursor();
    this.setUpHoverState();
  },
  methods: {
    setUpCursor() {
      // set the starting position of the cursor outside of the screen
      this.clientX = -100;
      this.clientY = -100;
      this.innerCursor = this.$refs["cursor--small"];
      //   this.trailingCursor = this.$refs["cursor--trail"];

      // add listener to track the current mouse position
      document.addEventListener("mousemove", e => {
        this.clientX = e.clientX;
        this.clientY = e.clientY;
      });

      // transform the innerCursor to the current mouse position
      // use requestAnimationFrame() for smooth performance
      const render = () => {
        this.innerCursor.style.transform = `translate(${this.clientX}px, ${this.clientY}px)`;

        if (!this.isStuck) {
          // move circle around normally
          this.lastX = this.lerp(this.lastX, this.clientX, 0.2);
          this.lastY = this.lerp(this.lastY, this.clientY, 0.2);
        } else if (this.isStuck) {
          // fixed position on a nav item
          this.lastX = this.lerp(this.lastX, this.stuckX, 0.2);
          this.lastY = this.lerp(this.lastY, this.stuckY, 0.2);
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

        this.filter = 'url("#filter-1")';
        if (e.target.classList.contains("glitch-link")) {
          gsap.to(this, {
            circleRadius: this.navItemBox.width / 2,
            stokeWidth: 4,
            duration: 0.25
          });
        } else {
          gsap.to(this, {
            circleRadius: 80,
            stokeWidth: 4,
            duration: 0.25
          });
        }

        this.tl = gsap.timeline({ repeat: -1 });
        this.tl
          .to(this, {
            scale: 40,
            duration: 0.6
          })
          .to(this, {
            scale: 18,
            duration: 0.5
          })
          .to(this, {
            scale: 50,
            duration: 0.1
          })
          .to(this, {
            scale: 18,
            duration: 0.01
          })
          .to(this, {
            scale: 80,
            duration: 0.1
          })
          .to(this, {
            scale: 10,
            duration: 0.5
          });
      };

      // reset isStuck on mouseLeave
      const handleMouseLeave = () => {
        this.isStuck = false;
        this.filter = "none";
        this.tl.kill();
        gsap.to(this, {
          circleRadius: 50,
          baseFrequencyX: 0,
          baseFrequencyY: 0,
          scale: 10,
          stokeWidth: 2,
          duration: 0.25
        });
      };

      // add event listeners to nav links
      const linkItems = document.querySelectorAll(".glitch-link");
      linkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });
      const navLinkItems = document.querySelectorAll(".nav__link");
      navLinkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
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
.page a:hover,
button {
  cursor: none;
}

.glitch-link {
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
a:hover {
  .cursor--small svg circle {
    radius: 10px;
  }
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
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 180px;
      height: 180px;
      position: absolute;
      overflow: visible;
    }
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
}
</style>
