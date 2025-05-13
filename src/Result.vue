<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['series', 'sliders']) // Recevoir les séries et sliders via props
const similaritiesTable = ref([]) // Tableau des similarités

// Fonction pour calculer la similarité entre deux vecteurs
function cosineSimilarity(vectorA, vectorB) {
  const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0)
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0))
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0))
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}

// Fonction pour récupérer les caractéristiques d'une série
function getFeatures(serie, featureKeys) {
  return featureKeys.map(key => serie[key] || 0) // Retourne les valeurs des caractéristiques ou 0 si elles sont absentes
}

// Fonction pour calculer les similarités pour une série donnée
function calculerSimilaritesPourUneSerie(serie_name) {
  const selectedSerie = props.series.find(serie => serie.name === serie_name)
  if (!selectedSerie) return

  const featureKeys = ['llama_Synopsis', 'audio', 'vidéo'] // Clés des caractéristiques utilisées pour le calcul

  similaritiesTable.value = props.series
    .filter(serie => serie.name !== serie_name) // Exclure la série sélectionnée
    .map(serie => {
      const vectorA = getFeatures(selectedSerie, featureKeys) // Caractéristiques de la série sélectionnée
      const vectorB = getFeatures(serie, featureKeys) // Caractéristiques de l'autre série

      const similarity = cosineSimilarity(vectorA, vectorB)

      return {
        name: serie.name,
        similarity: similarity,
        image: serie.image,
        description: serie.description
      }
    })

  similaritiesTable.value.sort((a, b) => b.similarity - a.similarity) // Trier par similarité décroissante
}

// Exemple : Calculer les similarités pour la première série cochée
const selectedSerie = computed(() => props.series.find(serie => serie.checked))
if (selectedSerie.value) {
  calculerSimilaritesPourUneSerie(selectedSerie.value.name)
}
</script>

<template>
  <h2>Résultats des séries sélectionnées</h2>
  <table v-if="similaritiesTable.length > 0">
    <thead>
      <tr>
        <th>Série</th>
        <th>Image</th>
        <th>Description</th>
        <th>Score de Similarité</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in similaritiesTable" :key="item.name">
        <td>{{ item.name }}</td>
        <td>
          <img :src="item.image" alt="Image de la série" class="serie-image" />
        </td>
        <td>{{ item.description }}</td>
        <td>{{ (item.similarity * 100).toFixed(2) }}%</td>
      </tr>
    </tbody>
  </table>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

tbody {
  text-align: center;
}

td {
  padding: 10px;
  vertical-align: top;
}

.serie-image {
  max-width: 100px;
  max-height: 150px;
}
</style>