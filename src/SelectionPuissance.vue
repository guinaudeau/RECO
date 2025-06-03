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

const voirPlus = ref(false)
</script>

<template>
  <h2>Personnalisation des critères</h2>
  <ul>
    <li>
      plot : {{ localSliders.plot }}
      <input type="range" v-model="localSliders.plot" min="0" max="2" step="0.01" value="1"/>
    </li>
    <li>
      content : {{ localSliders.content }}
      <input type="range" v-model="localSliders.content" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      character : {{ localSliders.character }}
      <input type="range" v-model="localSliders.character" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      representation : {{ localSliders.representation }}
      <input type="range" v-model="localSliders.representation" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      visuals : {{ localSliders.visuals }}
      <input type="range" v-model="localSliders.visuals" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      comedy : {{ localSliders.comedy }}
      <input type="range" v-model="localSliders.comedy" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      emotion : {{ localSliders.emotion }}
      <input type="range" v-model="localSliders.emotion" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      artistic : {{ localSliders.artistic }}
      <input type="range" v-model="localSliders.artistic" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      structural : {{ localSliders.structural }}
      <input type="range" v-model="localSliders.structural" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      audio : {{ localSliders.audio }}
      <input type="range" v-model="localSliders.audio" min="0" max="2" step="0.01" value="1" />
    </li>
    <li>
      vidéo : {{localSliders.video}}
      <input type="range" v-model="localSliders.video" min="0" max="2" step="0.01" value="1"/>
    </li>
  </ul>
  <button @click="voirPlus = !voirPlus" id="buttonvoirPlus">
    {{ voirPlus ? 'Masquer les autres critères' : 'Voir plus de critères' }}
  </button>
  <ul id="voirPlus" v-show="voirPlus">
    <li v-for="col in props.characteristicsColumns" :key="col">
      {{ col }} : {{ localSliders[col] }}
      <input type="range" v-model="localSliders[col]" min="0" max="2" step="0.01" value="1"/>
    </li>
  </ul>
  <button @click="voirPlus = !voirPlus" id="buttonvoirPlus" v-show="voirPlus">
    {{ voirPlus ? 'Masquer les autres critères' : 'Voir plus de critères' }}
  </button>
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

#buttonvoirPlus {
  background: #edf2f4;
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.5em;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, color 0.2s;
}

#buttonvoirPlus:hover {
  background: #d90429;
  color: #fff;
}

html.dark #buttonvoirPlus {
  background: #22223b;
  color: #f8f8f2;
  border: 1px solid #4a4e69;
}

html.dark #buttonvoirPlus:hover {
  background: #d90429;
  color: #fff;
  border-color: #d90429;
}
</style>
