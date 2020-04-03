import Vue from "vue";
import VueRouter from "vue-router";
import Glitch from "../views/Glitch.vue";
import GlitchSticky from "../views/GlitchSticky.vue";
import Attach from "../views/Attach.vue";
import CanvasWavy from "../views/CanvasWavy.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Glitch",
    component: Glitch
  },
  {
    path: "/glitch-sticky",
    name: "GlitchSticky",
    component: GlitchSticky
  },
  {
    path: "/attach",
    name: "Attach",
    component: Attach
  },
  {
    path: "/canvas-wavy",
    name: "CanvasWavy",
    component: CanvasWavy
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
