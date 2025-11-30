<template>
  <div class="border-b border-slate-700/50">
    <button
      @click="toggle"
      class="flex justify-between items-center w-full py-5 text-left"
    >
      <h3 class="text-lg font-medium text-white">{{ question }}</h3>
      <svg
        class="w-6 h-6 text-slate-400 transform transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    <transition
      name="expand"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div class="pb-5 text-slate-300 text-left md:text-justify">
          <p><slot /></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  question: {
    type: String,
    required: true,
  },
});

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

// --- Transition hooks ---
const enter = (el) => {
  el.style.height = "auto";
  const height = getComputedStyle(el).height;
  el.style.height = "0";
  // Force repaint to make sure the starting style is applied
  getComputedStyle(el);
  // Give it a tick to apply the style before transitioning
  setTimeout(() => {
    el.style.height = height;
  });
};

const afterEnter = (el) => {
  el.style.height = "auto";
};

const leave = (el) => {
  el.style.height = getComputedStyle(el).height;
  // Force repaint
  getComputedStyle(el);
  setTimeout(() => {
    el.style.height = "0";
  });
};

const afterLeave = (el) => {
  // Clean up inline styles
  el.style.height = null;
};
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}
</style>
