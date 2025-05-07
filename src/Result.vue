<script setup>
import { ref, onMounted } from 'vue'
import { selectedSeries, sliders } from './store.js'

const df = ref([]) // Tableau réactif pour stocker les données du CSV
const similaritiesTable = ref([]) // Tableau pour stocker les similarités avec toutes les séries
const comparisonResult = ref(null) // Résultat de la comparaison entre deux séries

const features = ['llama_Synopsis', 'audio', 'vidéo']

// Fonction pour charger le fichier CSV
async function loadCSV(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du fichier CSV : ${response.statusText}`)
    }
    const text = await response.text()
    const rows = text.split('\n').map(row => row.split(','))
    const headers = rows[0]
    const data = rows.slice(1).map(row => {
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = row[index]
      })
      return obj
    })
    df.value = data
  } catch (error) {
    console.error('Erreur lors du chargement du CSV :', error)
  }
}

// Fonction pour extraire les caractéristiques d'une série
function get_features(serie_name, features, df) {
  const feats = []
  const feature_names = {
    'llama_Synopsis': [1, 51],
    'audio': [51, 56],
    'vidéo': [56, Object.keys(df.value[0]).length] // Utilisation de la longueur des clés
  }

  if (features in feature_names) {
    const df_serie = df.value.filter(row => row['name'] === serie_name)
    if (df_serie.length > 0) {
      const idx = feature_names[features]
      const keys = Object.keys(df_serie[0]).slice(idx[0], idx[1]) // Obtenez les clés des colonnes
      feats.push(...keys.map(key => parseFloat(df_serie[0][key]) || 0)) // Récupérez les valeurs
    }
  } else {
    console.error("Nom de caractéristique inconnu")
  }

  return feats
}

// Fonction pour calculer la similarité cosinus
function cosine_similarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

// Fonction pour calculer les similarités avec toutes les séries
function calculerSimilaritesPourUneSerie(serie_name) {
  similaritiesTable.value = df.value.map(row => {
    const otherSerieName = row['name']
    if (otherSerieName === serie_name) return null // Ignore la série elle-même

    // Calcul des similarités pondérées
    const weightedSimilarities = features
      .map(feature => {
        const features_1 = get_features(serie_name, feature, df)
        const features_2 = get_features(otherSerieName, feature, df)
        const sliderValue = sliders.value[feature] || 0 // Utilise 0 si le slider est invalide
        if (sliderValue === 0) {
          return null // Ignore cette feature si le slider est égal à 0
        }
        const similarityScore = cosine_similarity(features_1, features_2) * sliderValue
        console.log("Feature:", feature)
        console.log("Slider value:", sliderValue)
        console.log("Similarity score:", similarityScore)
        return { similarity: similarityScore, weight: sliderValue }
      })
      .filter(item => item !== null) // Supprime les features ignorées

    // Calcul de la moyenne pondérée
    const totalWeight = weightedSimilarities.reduce((sum, item) => sum + item.weight, 0)
    const averageSimilarity = totalWeight > 0
      ? weightedSimilarities.reduce((sum, item) => sum + item.similarity, 0) / totalWeight
      : 0 // Si totalWeight est 0, définissez averageSimilarity à 0

    console.log("Weighted Similarities:", weightedSimilarities)
    console.log("Total Weight:", totalWeight)
    console.log("Average Similarity:", averageSimilarity)

    return { 
      name: otherSerieName, 
      similarity: averageSimilarity, 
      details: {
        llama_Synopsis: weightedSimilarities.find(item => item && item.similarity && item.weight === sliders.value['llama_Synopsis'])?.similarity || 0,
        audio: weightedSimilarities.find(item => item && item.similarity && item.weight === sliders.value['audio'])?.similarity || 0,
        vidéo: weightedSimilarities.find(item => item && item.similarity && item.weight === sliders.value['vidéo'])?.similarity || 0
      }
    }
  }).filter(item => item !== null) // Supprime les entrées nulles

  // Trie les résultats par similarité décroissante et limite à 10 résultats
  similaritiesTable.value.sort((a, b) => b.similarity - a.similarity)
  similaritiesTable.value = similaritiesTable.value.slice(0, 10)
}

// Fonction pour comparer deux séries
function comparerDeuxSeries(serie1, serie2) {
  const similarities = features.map(feature => {
    const features_1 = get_features(serie1, feature, df)
    const features_2 = get_features(serie2, feature, df)
    return cosine_similarity(features_1, features_2)
  })

  const averageSimilarity = similarities.reduce((sum, val) => sum + val, 0) / similarities.length
  comparisonResult.value = { 
    serie1, 
    serie2, 
    similarity: averageSimilarity,
    details: {
      llama_Synopsis: similarities[0],
      audio: similarities[1],
      vidéo: similarities[2]
    }
  }
}

onMounted(async () => {
  await loadCSV('/RECO/data/characteristics.csv')

  if (selectedSeries.value.length === 1) {
    const serieName = selectedSeries.value[0]['name']
    calculerSimilaritesPourUneSerie(serieName)
  } else if (selectedSeries.value.length === 2) {
    const [serie1, serie2] = selectedSeries.value.map(serie => serie['name'])
    comparerDeuxSeries(serie1, serie2)
  }
})
</script>

<template>
  <h2>Résultats des séries sélectionnées</h2>
  <ul>
    <li v-for="serie in selectedSeries" :key="serie.id">
      {{ serie['name'] }}
    </li>
  </ul>
  <p v-if="selectedSeries.length === 0">Aucune série sélectionnée.</p>

  <h3>Valeurs des sliders :</h3>
  <ul>
    <li>Video : {{ sliders.vidéo }}</li>
    <li>Scénario : {{ sliders.llama_Synopsis }}</li>
    <li>Audio : {{ sliders.audio }}</li>
  </ul>

  <h3 v-if="selectedSeries.length === 1">Tableau des similarités</h3>
  <table v-if="similaritiesTable.length > 0 && selectedSeries.length === 1">
    <thead>
      <tr>
        <th>Série</th>
        <th>Score de Similarité (%)</th>
        <th>llama_Synopsis (%)</th>
        <th>Audio (%)</th>
        <th>Vidéo (%)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in similaritiesTable" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ (item.similarity * 100).toFixed(2) }}</td>
        <td>{{ (item.details.llama_Synopsis * 100).toFixed(2) }}</td>
        <td>{{ (item.details.audio * 100).toFixed(2) }}</td>
        <td>{{ (item.details.vidéo * 100).toFixed(2) }}</td>
      </tr>
    </tbody>
  </table>

  <h3 v-if="selectedSeries.length === 2">Comparaison entre deux séries</h3>
  <p v-if="comparisonResult">
    Similarité entre {{ comparisonResult.serie1 }} et {{ comparisonResult.serie2 }} :
    {{ (comparisonResult.similarity * 100).toFixed(2) }}%
  </p>
  <ul v-if="comparisonResult">
    <li>llama_Synopsis : {{ (comparisonResult.details.llama_Synopsis * 100).toFixed(2) }}%</li>
    <li>Audio : {{ (comparisonResult.details.audio * 100).toFixed(2) }}%</li>
    <li>Vidéo : {{ (comparisonResult.details.vidéo * 100).toFixed(2) }}%</li>
  </ul>
</template>