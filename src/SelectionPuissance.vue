<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps(['sliders', 'characteristics', 'characteristicsColumns'])
const emit = defineEmits(['update:sliders'])

// Créer une copie locale des sliders
const localSliders = ref({ ...props.sliders })

// Initialiser les sliders pour chaque colonne si absent
props.characteristicsColumns.forEach(col => {
  if (!(col in localSliders.value)) {
    localSliders.value[col] = 1
  }
})

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
      <input type="range" v-model="localSliders.vidéo" min="0" max="2" step="0.01" value="1"/>
    </li>
    <li>
      Scénario : {{ localSliders.llama_Synopsis }}
      <input type="range" v-model="localSliders.llama_Synopsis" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      Audio : {{ localSliders.audio }}
      <input type="range" v-model="localSliders.audio" min="0" max="2" step="0.01" value="1" />
    </li>
  </ul>
  <button @click="voirPlus = !voirPlus">
    {{ voirPlus ? 'Masquer les autres critères' : 'Voir plus de critères' }}
  </button>
  <ul id="voirPlus" hidden>
    <li v-for="col in props.characteristicsColumns" :key="col">
      {{ col }} : {{ localSliders[col] }}
      <input type="range" v-model="localSliders[col]" min="0" max="2" step="0.01" value="1"/>
    </li>
  </ul>
</template>

<style>
ul {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

li {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0.5em;
}

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
  margin-left: 1em;
}
</style>
