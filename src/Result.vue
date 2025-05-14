<script setup>
import { defineProps, ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'

const props = defineProps(['series', 'sliders']) // Recevoir les séries et sliders via props
const similaritiesTable = ref([]) // Tableau des similarités
const characteristics = ref([]) // Données des caractéristiques

// Fonction pour charger les données de characteristics.csv
async function loadCharacteristics() {
  return new Promise((resolve, reject) => {
    Papa.parse('/RECO/data/characteristics.csv', {
      download: true,
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    })
  })
}

// Fonction pour calculer la similarité entre deux vecteurs
function cosineSimilarity(vectorA, vectorB) {
  const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0)
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0))
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0))
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}

// Fonction pour récupérer les caractéristiques d'une série
function getFeatures(serieName, featureKeys) {
  const serie = characteristics.value.find(item => item.name === serieName)
  if (!serie) return featureKeys.map(() => 0) // Retourne un vecteur nul si la série n'est pas trouvée

  // Récupérer les plages spécifiques pour chaque clé
  const llamaSynopsis = Object.values(serie).slice(1, 52).map(value => parseFloat(value) || 0) // Colonnes 1 à 51
  const audio = Object.values(serie).slice(52, 58).map(value => parseFloat(value) || 0) // Colonnes 52 à 57
  const video = Object.values(serie).slice(58).map(value => parseFloat(value) || 0) // Colonnes 58 à la fin

  // Retourner les vecteurs correspondants
  return featureKeys.map(key => {
    if (key === 'llama_Synopsis') return llamaSynopsis
    if (key === 'audio') return audio
    if (key === 'vidéo') return video
    return []
  }).flat() // Aplatir les vecteurs pour obtenir un seul tableau
}

// Fonction pour calculer les similarités pour une série donnée
function calculerSimilaritesPourUneSerie(serie_name) {
  const selectedSerie = props.series.find(serie => serie.name === serie_name)
  if (!selectedSerie) return

  const featureKeys = ['llama_Synopsis', 'audio', 'vidéo'] // Clés des caractéristiques utilisées pour le calcul

  similaritiesTable.value = props.series
    .filter(serie => serie.name !== serie_name) // Exclure la série sélectionnée
    .map(serie => {
      const vectorA = getFeatures(selectedSerie.name, featureKeys) // Caractéristiques de la série sélectionnée
      const vectorB = getFeatures(serie.name, featureKeys) // Caractéristiques de l'autre série

      // Calculer la similarité globale pondérée par les sliders
      const featureSimilarities = featureKeys.map(key => {
        const featureVectorA = getFeatures(selectedSerie.name, [key])
        const featureVectorB = getFeatures(serie.name, [key])
        const similarity = cosineSimilarity(featureVectorA, featureVectorB)
        return {
          key,
          similarity,
          weight: props.sliders[key] || 1 // Pondération par le slider
        }
      })

      const weightedSimilarity = featureSimilarities.reduce(
        (sum, feature) => sum + feature.similarity * feature.weight,
        0
      ) / featureSimilarities.reduce((sum, feature) => sum + feature.weight, 0)

      return {
        name: serie.name,
        similarity: weightedSimilarity,
        featureSimilarities: featureSimilarities,
        image: serie.image,
        description: serie.description
      }
    })

  similaritiesTable.value.sort((a, b) => b.similarity - a.similarity) // Trier par similarité décroissante
}

// Charger les données au montage
onMounted(async () => {
  try {
    characteristics.value = await loadCharacteristics()
    const selectedSerie = props.series.find(serie => serie.checked)
    if (selectedSerie) {
      calculerSimilaritesPourUneSerie(selectedSerie.name)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des caractéristiques :', error)
  }
})

// Fonction pour afficher la similarité pour chaque feature
function showFeatureSimilarities(featureSimilarities) {
  const message = featureSimilarities
    .map(feature => `${feature.key} : ${(feature.similarity * 100).toFixed(2)}% (Pondération : ${feature.weight})`)
    .join('\n')
  alert(`Similarité par feature :\n${message}`)
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
        <th>Action</th>
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
        <td>
          <button @click="showFeatureSimilarities(item.featureSimilarities)">Voir Similarité par Feature</button>
        </td>
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

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>