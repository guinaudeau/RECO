<script setup>
import { ref, onMounted } from 'vue'
import { selectedSeries } from './store.js'

const df = ref([]) // Tableau réactif pour stocker les données du CSV

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

  console.log(`Vecteurs extraits pour ${serie_name} (${features}) :`, feats)
  return feats
}

// Fonction pour calculer la similarité cosinus
function calcul_similarite_par_feature(serie_1, serie_2, df, features) {
  const resultats = {}

  features.forEach(feature => {
    const features_1 = get_features(serie_1, feature, df)
    const features_2 = get_features(serie_2, feature, df)

    console.log(`Caractéristiques de ${serie_1} pour ${feature} :`, features_1)
    console.log(`Caractéristiques de ${serie_2} pour ${feature} :`, features_2)

    if (features_1.length === 0 || features_2.length === 0) {
      resultats[feature] = null
      return
    }

    // Utilisation de la fonction cosine_similarity
    resultats[feature] = cosine_similarity(features_1, features_2)

    console.log(`Similarité cosinus pour ${feature} : ${resultats[feature]}`)
  })

  return resultats
}

// Fonction cosine_similarity
  function cosine_similarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, value, index) => sum + value * vecB[index], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

const features = ['llama_Synopsis', 'audio', 'vidéo']
const similarities = ref({})

onMounted(async () => {
  if (!df.value || df.value.length === 0) {
    await loadCSV('/RECO/data/characteristics.csv')
  }
  if (selectedSeries.value.length >= 2) {
    const serie1 = selectedSeries.value[0]['name']
    const serie2 = selectedSeries.value[1]['name']
    similarities.value = calcul_similarite_par_feature(serie1, serie2, df, features)
    console.log(`Similarités cosinus entre "${serie1}" et "${serie2}" :`, similarities.value)
  } else {
    console.warn('Moins de deux séries sélectionnées pour calculer la similarité.')
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

  <h3>Similarités cosinus par feature :</h3>
  <ul>
    <li v-for="(value, feature) in similarities" :key="feature">
      {{ feature }} : {{ value !== null ? value.toFixed(4) : 'Non calculable' }}
    </li>
  </ul>
</template>