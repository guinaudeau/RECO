<script setup>
import { defineProps, ref, onActivated } from 'vue'
import Papa from 'papaparse'

const props = defineProps(['series', 'sliders']) // Recevoir les séries et sliders via props
const similaritiesTable = ref([]) // Tableau des similarités
const characteristics = ref([]) // Données des caractéristiques
const comparisonResult = ref(null) // Résultat de la comparaison entre deux séries

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
function cosineSimilarity(A, B) {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < A.length; i++) {
    dotproduct += (A[i] * B[i]);
    mA += (A[i] * A[i]);
    mB += (B[i] * B[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  const denom = mA * mB;
  if (!denom) return 0;
  const result = dotproduct / denom;
  return isNaN(result) ? 0 : result;
}

// Fonction pour récupérer les caractéristiques d'une série
function getFeatures(serieName, featureKeys) {
  const serie = characteristics.value.find(item => item.name === serieName)
  if (!serie) return featureKeys.map(() => 0)

  // Récupérer les clés de colonnes du CSV
  const allKeys = Object.keys(serie)

  // Définir les plages d'index pour chaque feature
  const llamaSynopsisCols = allKeys.slice(1, 51)
  const audioCols = allKeys.slice(51, 56)
  const videoCols = allKeys.slice(56)

  const llamaSynopsis = llamaSynopsisCols.map(col => parseFloat(serie[col]) || 0)
  const audio = audioCols.map(col => parseFloat(serie[col]) || 0)
  const video = videoCols.map(col => parseFloat(serie[col]) || 0)

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
      // Calculer la similarité globale pondérée par les sliders
      const featureSimilarities = featureKeys.map(key => {
        const featureVectorA = getFeatures(selectedSerie.name, [key])
        const featureVectorB = getFeatures(serie.name, [key])
        const similarity = cosineSimilarity(featureVectorA, featureVectorB)
        console.log('similarity', similarity)
        return {
          key,
          similarity,
          weight: parseFloat(props.sliders[key]) || 1 // Conversion forcée ici
        }
      })
      console.log('weights', props.sliders)
      const weightedSimilarity = featureSimilarities.reduce(
        (sum, feature) => sum + feature.similarity * feature.weight,
        0
      ) / featureSimilarities.reduce((sum, feature) => sum + feature.weight, 0)
      // Ajout des logs pour le debug
    console.log('Similarité calculée pour', serie.name, ':', weightedSimilarity)
    featureSimilarities.forEach(feature => {
      console.log(`  - ${feature.key} : ${feature.similarity} (poids : ${feature.weight})`)
    })
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

// Fonction pour calculer la similarité entre deux séries
function calculerSimilaritesEntreDeuxSeries(serie1Name, serie2Name) {
  const featureKeys = ['llama_Synopsis', 'audio', 'vidéo'] // Clés des caractéristiques utilisées pour le calcul

  const featureSimilarities = featureKeys.map(key => {
    const weight = parseFloat(props.sliders[key]) || 0
    if (weight === 0) return null
    const featureVectorA = getFeatures(selectedSerie.name, [key])
    const featureVectorB = getFeatures(serie.name, [key])
    const similarity = cosineSimilarity(featureVectorA, featureVectorB)
    return {
      key,
      similarity,
      weight
    }
  }).filter(Boolean)

  const weightedSimilarity = featureSimilarities.length > 0
    ? featureSimilarities.reduce(
        (sum, feature) => sum + feature.similarity * feature.weight,
        0
      ) / featureSimilarities.reduce((sum, feature) => sum + feature.weight, 0)
    : 0

  // Stocker le résultat dans comparisonResult
  comparisonResult.value = {
    serie1Name,
    serie2Name,
    weightedSimilarity,
    featureSimilarities
  }
}

// Charger les données et effectuer les calculs à chaque fois que le composant est activé
onActivated(async () => {
  try {
    // Vérifier si la liste des séries sélectionnées est vide
    const selectedSeries = props.series.filter(serie => serie.checked)
    if (selectedSeries.length === 0) {
      // Rediriger vers Home si aucune série n'est sélectionnée
      window.location.hash = '#/'
      return
    }

    characteristics.value = await loadCharacteristics()
    if (selectedSeries.length === 1) {
      // Calculer les similarités pour la première série cochée
      calculerSimilaritesPourUneSerie(selectedSeries[0].name)
    } else if (selectedSeries.length === 2) {
      // Calculer les similarités entre deux séries cochées
      calculerSimilaritesEntreDeuxSeries(selectedSeries[0].name, selectedSeries[1].name)
    }
    
    /* teste pour faire un calcul sur toutes les séries cochées
    else {
      // Calculer les similarités pour toutes les séries cochées
      props.series.forEach(serie => {
        if (serie.checked) {
          calculerSimilaritesPourUneSerie(serie.name)
        }
      })
    }
    */
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

  <!-- Affichage des résultats de la comparaison -->
  <div v-if="comparisonResult" class="comparison-result">
    <h3>Comparaison entre {{ comparisonResult.serie1Name }} et {{ comparisonResult.serie2Name }}</h3>
    <p><strong>Similarité globale pondérée :</strong> {{ (comparisonResult.weightedSimilarity * 100).toFixed(2) }}%</p>
    <ul>
      <li v-for="feature in comparisonResult.featureSimilarities" :key="feature.key">
        <strong>{{ feature.key }} :</strong> {{ (feature.similarity * 100).toFixed(2) }}% (Pondération : {{ feature.weight }})
      </li>
    </ul>
  </div>
  
  <div v-else>Aucune série sélectionnée ou aucune similarité calculée.</div>
  <p v-if="similaritiesTable.length === 0">Aucune série trouvée.</p>
</template>

<style>
/* Styles pour le tableau */
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

/* Styles pour les boutons */
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

/* Styles pour la section de comparaison */
.comparison-result {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 5px;
  background-color: var(--background-color, #f9f9f9);
  color: var(--text-color, #000);
}

/* Titre de la section */
.comparison-result h3 {
  margin-bottom: 10px;
}

/* Liste des similarités */
.comparison-result ul {
  list-style-type: none;
  padding: 0;
}

.comparison-result li {
  margin-bottom: 5px;
}

/* Mode sombre */
html.dark .comparison-result {
  --background-color: #333;
  --text-color: #00c7ec;
  --border-color: #555;
}
</style>