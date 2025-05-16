<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps(['sliders','characteristics']) // Recevoir les sliders et caractéristiques via props
const emit = defineEmits(['update:sliders']) // Émettre un événement pour notifier le parent
// Créer une copie locale des sliders
const localSliders = ref({ ...props.sliders })

// Surveiller les changements locaux et émettre un événement
watch(
  localSliders,
  (newValue) => {
    emit('update:sliders', newValue) // Émettre les nouvelles valeurs des sliders
  },
  { deep: true }
)
</script>

<template>
  <h2>Personnalisation des critères</h2>
  <ul>
    <li>
      Vidéo : {{ localSliders.vidéo }}
      <input type="range" v-model="localSliders.vidéo" min="0" max="1" step="0.01" />
    </li>
    <li>
      Scénario : {{ localSliders.llama_Synopsis }}
      <input type="range" v-model="localSliders.llama_Synopsis" min="0" max="1" step="0.01" />
    </li>
    <li>
      Audio : {{ localSliders.audio }}
      <input type="range" v-model="localSliders.audio" min="0" max="1" step="0.01" />
    </li>
  </ul>
  <ul v-for="characteristic in props.characteristics" :key="characteristic.name">
    <li>
      {{ characteristic.name }} : {{ characteristic.value }}
      <input type="range" v-model="characteristic.value" min="0" max="1" step="0.01" />
    </li>
  </ul>
</template>

<style>
input[type="range"] {
  appearance: auto;
  color: #ef233c;
  --thumb-height: 1.125em;
  --track-height: 0.125em;
  --track-color: rgba(255, 255, 255, 0.1);
  --brightness-hover: 180%;
  --brightness-down: 80%;
  --clip-edges: 0.125em;
  font-size: 1.5rem;
  width: 12.5em;
}
</style>
