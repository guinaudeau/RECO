<script setup>
import { ref, onMounted } from 'vue'
import { selectedSeries } from './store.js'

const df = ref([]) // Tableau réactif pour stocker les données du CSV
const similaritiesTable = ref([]) // Tableau pour stocker les similarités avec toutes les séries
const comparisonResult = ref(null) // Résultat de la comparaison entre deux séries

// Define sliders with default values
const sliders = ref({
  couleur: 0,
  scenario: 0,
  exemple: 0,
})

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
  const features = ['llama_Synopsis', 'audio', 'vidéo']
  similaritiesTable.value = df.value.map(row => {
    const otherSerieName = row['name']
    if (otherSerieName === serie_name) return null // Ignore la série elle-même

    const similarities = features.map(feature => {
      const features_1 = get_features(serie_name, feature, df)
      const features_2 = get_features(otherSerieName, feature, df)
      return cosine_similarity(features_1, features_2)
    })

    const averageSimilarity = similarities.reduce((sum, val) => sum + val, 0) / similarities.length
    return { 
      name: otherSerieName, 
      similarity: averageSimilarity, 
      details: {
        llama_Synopsis: similarities[0],
        audio: similarities[1],
        vidéo: similarities[2]
      }
    }
  }).filter(item => item !== null) // Supprime les entrées nulles
}

// Fonction pour comparer deux séries
function comparerDeuxSeries(serie1, serie2) {
  const features = ['llama_Synopsis', 'audio', 'vidéo']
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
    <li>Couleur : {{ sliders.couleur }}</li>
    <li>Scénario : {{ sliders.scenario }}</li>
    <li>Exemple : {{ sliders.exemple }}</li>
  </ul>

  <h3 v-if="selectedSeries.length === 1">Tableau des similarités</h3>
  <table v-if="similaritiesTable.length > 0 && selectedSeries.length === 1">
    <thead>
      <tr>
        <th>Série</th>
        <th>Score de Similarité</th>
        <th>llama_Synopsis</th>
        <th>Audio</th>
        <th>Vidéo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in similaritiesTable" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.similarity.toFixed(4) }}</td>
        <td>{{ item.details.llama_Synopsis.toFixed(4) }}</td>
        <td>{{ item.details.audio.toFixed(4) }}</td>
        <td>{{ item.details.vidéo.toFixed(4) }}</td>
      </tr>
    </tbody>
  </table>

  <h3 v-if="selectedSeries.length === 2">Comparaison entre deux séries</h3>
  <p v-if="comparisonResult">
    Similarité entre {{ comparisonResult.serie1 }} et {{ comparisonResult.serie2 }} :
    {{ comparisonResult.similarity.toFixed(4) }}
  </p>
  <ul v-if="comparisonResult">
    <li>llama_Synopsis : {{ comparisonResult.details.llama_Synopsis.toFixed(4) }}</li>
    <li>Audio : {{ comparisonResult.details.audio.toFixed(4) }}</li>
    <li>Vidéo : {{ comparisonResult.details.vidéo.toFixed(4) }}</li>
  </ul>
</template>