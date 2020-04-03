<template>
  <div id="app">
    <div class="app-container">
      <div class="app-container__inner">
        <div class="cursor cursor--small" ref="cursor--small"></div>
        <canvas class="cursor cursor--canvas" resize></canvas>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import paper from "paper";
import SimplexNoise from "simplex-noise";
export default {
  name: "CustomCursor",
  data() {
    return {
      innerCursor: null,
      isStuck: false,
      showCursor: false,
      group: null,
      lastX: 0,
      lastY: 0,
      stuckX: "",
      stuckY: "",
      fillOuterCursor: null,
      shapeBounds: {
        width: 75,
        height: 75
      },
      polygon: null,
      noiseScale: 150, // speed
      noiseRange: 4, // range of distortion
      isNoisy: false, // state
      noiseObjects: null,
      bigCoordinates: null,
      clientX: null,
      clientY: null
    };
  },
  mounted() {
    this.setUpCursor();
    this.setUpCanvas();
    this.setUpHoverState();
    this.setUpMagneticNoise();
  },
  methods: {
    setUpCursor() {
      // set the starting position of the cursor outside of the screen
      this.clientX = -100;
      this.clientY = -100;
      this.innerCursor = this.$refs["cursor--small"];

      // add listener to track the current mouse position
      document.addEventListener("mousemove", e => {
        this.clientX = e.clientX;
        this.clientY = e.clientY;
      });

      // transform the innerCursor to the current mouse position
      // use requestAnimationFrame() for smooth performance
      const render = () => {
        this.innerCursor.style.transform = `translate(${this.clientX}px, ${this.clientY}px)`;
        // if you are already using TweenMax in your project, you might as well
        // use TweenMax.set() instead
        // TweenMax.set(innerCursor, {
        //   x: clientX,
        //   y: clientY
        // });

        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    },
    setUpCanvas() {
      const canvas = document.querySelector(".cursor--canvas");
      paper.setup(canvas);
      const strokeColor = "rgba(255, 0, 0, 0.5)";
      const strokeWidth = 1;
      const segments = 8;
      const radius = 15;

      // the base shape for the noisy circle
      this.polygon = new paper.Path.RegularPolygon(
        new paper.Point(0, 0),
        segments,
        radius
      );
      this.polygon.strokeColor = strokeColor;
      this.polygon.strokeWidth = strokeWidth;
      this.polygon.smooth();
      this.group = new paper.Group([this.polygon]);
      this.group.applyMatrix = false;

      this.noiseObjects = this.polygon.segments.map(() => new SimplexNoise());
      this.bigCoordinates = [];

      // the draw loop of Paper.js
      // (60fps with requestAnimationFrame under the hood)
      paper.view.onFrame = () => {
        // using linear interpolation, the circle will move 0.2 (20%)
        // of the distance between its current position and the mouse
        // coordinates per Frame
        this.lastX = this.lerp(this.lastX, this.clientX, 0.2);
        this.lastY = this.lerp(this.lastY, this.clientY, 0.2);
        this.group.position = new paper.Point(this.lastX, this.lastY);
      };
    },
    lerp(a, b, n) {
      return (1 - n) * a + n * b;
    },
    map(value, in_min, in_max, out_min, out_max) {
      return (
        ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      );
    },
    setUpHoverState() {
      // find the center of the link element and set stuckX and stuckY
      // these are needed to set the position of the noisy circle
      const handleMouseEnter = e => {
        const navItem = e.currentTarget;
        const navItemBox = navItem.getBoundingClientRect();
        this.stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
        this.stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
        this.isStuck = true;
        if (e.target.classList.contains("cursor--outline")) {
          this.shapeBounds = {
            width: navItemBox.width,
            height: navItemBox.height
          };
        }
      };

      // reset isStuck on mouseLeave
      const handleMouseLeave = () => {
        this.isStuck = false;
      };

      // add event listeners to nav links
      const linkItems = document.querySelectorAll(".nav__link");
      linkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });
      const wavyLinkItems = document.querySelectorAll(".wavy-link");
      wavyLinkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
      });
    },
    setUpMagneticNoise() {
      // the draw loop of Paper.js
      // (60fps with requestAnimationFrame under the hood)
      paper.view.onFrame = event => {
        // using linear interpolation, the circle will move 0.2 (20%)
        // of the distance between its current position and the mouse
        // coordinates per Frame
        if (!this.isStuck) {
          // move circle around normally
          this.lastX = this.lerp(this.lastX, this.clientX, 0.2);
          this.lastY = this.lerp(this.lastY, this.clientY, 0.2);
          this.group.position = new paper.Point(this.lastX, this.lastY);
        } else if (this.isStuck) {
          // fixed position on a nav item
          this.lastX = this.lerp(this.lastX, this.stuckX, 0.2);
          this.lastY = this.lerp(this.lastY, this.stuckY, 0.2);
          this.group.position = new paper.Point(this.lastX, this.lastY);
        }

        if (
          this.isStuck &&
          this.polygon.bounds.width < this.shapeBounds.width
        ) {
          // scale up the shape
          this.polygon.scale(1.08);
        } else if (!this.isStuck && this.polygon.bounds.width > 30) {
          // remove noise
          if (this.isNoisy) {
            this.polygon.segments.forEach((segment, i) => {
              segment.point.set(
                this.bigCoordinates[i][0],
                this.bigCoordinates[i][1]
              );
            });
            this.isNoisy = false;
            this.bigCoordinates = [];
          }
          // scale down the shape
          const scaleDown = 0.92;
          this.polygon.scale(scaleDown);
        }

        // while stuck and big, apply simplex noise
        if (
          this.isStuck &&
          this.polygon.bounds.width >= this.shapeBounds.width
        ) {
          this.isNoisy = true;
          // first get coordinates of large circle
          if (this.bigCoordinates.length === 0) {
            this.polygon.segments.forEach((segment, i) => {
              this.bigCoordinates[i] = [segment.point.x, segment.point.y];
            });
          }

          // loop over all points of the polygon
          this.polygon.segments.forEach((segment, i) => {
            // get new noise value
            // we divide event.count by noiseScale to get a very smooth value
            const noiseX = this.noiseObjects[i].noise2D(
              event.count / this.noiseScale,
              0
            );
            const noiseY = this.noiseObjects[i].noise2D(
              event.count / this.noiseScale,
              1
            );

            // map the noise value to our defined range
            const distortionX = this.map(
              noiseX,
              -1,
              1,
              -this.noiseRange,
              this.noiseRange
            );
            const distortionY = this.map(
              noiseY,
              -1,
              1,
              -this.noiseRange,
              this.noiseRange
            );

            // apply distortion to coordinates
            const newX = this.bigCoordinates[i][0] + distortionX;
            const newY = this.bigCoordinates[i][1] + distortionY;

            // set new (noisy) coodrindate of point
            segment.point.set(newX, newY);
          });
        }
        this.polygon.smooth();
      };
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
  &--canvas {
    width: 100vw;
    height: 100vh;
    z-index: 12000;
  }
}
</style>
