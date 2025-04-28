<script setup>
import { sliders } from './store.js'

</script>

<template>
  <h2>Personnalisation des critères</h2>
  <ul>
    <li>
      Couleur : {{ sliders.couleur }}
      <input type="range" v-model="sliders.couleur" min="0" max="100" step="5" />
    </li>
    <li>
      Scénario : {{ sliders.scenario }}
      <input type="range" v-model="sliders.scenario" min="0" max="100" step="5" />
    </li>
    <li>
      Exemple : {{ sliders.exemple }}
      <input type="range" v-model="sliders.exemple" min="0" max="100" step="5" />
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
