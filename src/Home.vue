<template>
  <h2>Liste des séries</h2>
  <form @submit.prevent="searchQuery">
    <input type="text" v-model="rechercher" placeholder="Rechercher une série" />
    <button type="submit">Rechercher</button>
  </form>

  <table>
    <tbody>
      <tr v-for="(group, groupIndex) in groupedSeries" :key="groupIndex">
        <td v-for="serie in group" :key="serie.name">
          <div>
            <img :src="serie.image" alt="Image de la série" class="serie-image" />
            <p>{{ serie.name }}</p>
            <input type="checkbox" v-model="serie.checked" @change="countChoices(serie)" />
            <button @click="showDescription(serie)">Voir description</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <p>Nombre de séries : {{ series.length }}</p>
  <p>Nombre de séries cochées : {{ series.filter(serie => serie.checked).length }}</p>
  <p>Nombre de séries non cochées : {{ series.filter(serie => !serie.checked).length }}</p>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'

const props = defineProps(['series']) // Recevoir les séries via props
const series = ref(props.series) // Référence locale pour manipuler les séries
let rechercher = ref('') // Champ de recherche
let nbCheck = 0 // Nombre de séries cochées

// Fonction pour rechercher une série
const searchQuery = () => {
  const filteredSeries = props.series.filter(serie =>
    Object.values(serie).some(value =>
      String(value).toLowerCase().includes(rechercher.value.toLowerCase())
    )
  )
  series.value = filteredSeries
}

// Fonction pour afficher la description d'une série
const showDescription = (serie) => {
  if (serie.name && serie.description) {
    alert(`Description de "${serie.name}": ${serie.description}`)
  } else {
    alert("Les informations de la série sont incomplètes.")
  }
}

// Propriété calculée pour regrouper les séries par lot de 5
const groupedSeries = computed(() => {
  const groups = []
  for (let i = 0; i < series.value.length; i += 5) {
    groups.push(series.value.slice(i, i + 5))
  }
  return groups
})

// Fonction pour gérer les cases cochées
function countChoices(serie) {
  if (serie.checked) {
    nbCheck++
    if (nbCheck > 2) {
      serie.checked = false
      nbCheck--
      alert('Vous ne pouvez sélectionner que 2 séries au maximum.')
    }
  } else {
    nbCheck--
  }
}
</script>

<style>
.serie-image {
  max-width: 100px;
  max-height: 150px;
}
</style>