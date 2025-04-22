<script setup>
import { shallowRef } from 'vue'
import Home from './Home.vue'
import SelectionPuissance from './SelectionPuissance.vue'

// use shallowRef to avoid component being deeply observed
const activeComponent = shallowRef(Home)
</script>

<template>
	<label>
    <input type="radio" v-model="activeComponent" :value="Home"> A
  </label>
  <label>
    <input type="radio" v-model="activeComponent" :value="SelectionPuissance"> B
  </label>
  <Transition name="fade" mode="out-in">
    <component :is="activeComponent"></component>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>