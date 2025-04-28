<script setup>
import { selectedSeries, sliders } from './store.js'
</script>

<template>
  <h2>Résultats des séries sélectionnées</h2>
  <ul>
    <li v-for="serie in selectedSeries" :key="serie.id">
      {{ serie['TV Serie Name'] }}
    </li>
  </ul>
  <p v-if="selectedSeries.length === 0">Aucune série sélectionnée.</p>

  <h3>Valeurs des sliders :</h3>
  <ul>
    <li>Couleur : {{ sliders.couleur }}</li>
    <li>Scénario : {{ sliders.scenario }}</li>
    <li>Exemple : {{ sliders.exemple }}</li>
  </ul>
</template>