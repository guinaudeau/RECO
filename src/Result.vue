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
const loadCSV = async (filePath) => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du fichier CSV : ${response.statusText}`)
    }
    const text = await response.text()
    console.log('Contenu brut du fichier CSV :', text) // Log du contenu brut

    const rows = text.split('\n').map(row => row.split(';'))
    console.log('Lignes du fichier CSV :', rows) // Log des lignes

    const headers = rows.shift() // Extraire les en-têtes
    console.log('En-têtes du fichier CSV :', headers) // Log des en-têtes

    df.value = rows.map(row => {
      const obj = {}
      row.forEach((value, index) => {
        obj[headers[index]] = isNaN(value) ? value : parseFloat(value) // Convertir en nombre si possible
      })
      return obj
    })
    console.log('Données chargées :', df.value) // Log des données finales
  } catch (error) {
    console.error('Erreur lors du chargement du fichier CSV :', error)
  }
}

// Fonction pour extraire les caractéristiques d'une série
function get_features(serie_name, features, df) {
  const serie = df.value.find(row => row['TV Serie Name'] === serie_name)
  console.log(`Série recherchée : ${serie_name}`)
  console.log(`Série trouvée :`, serie)
  if (!serie) {
    console.error(`Série ${serie_name} non trouvée dans les données.`)
    return []
  }

  // Correspondance des caractéristiques avec les plages d'indices
  const featureMapping = {
    'audio': [311, 315],
    'vidéo': [316, 337],
    'llama_Synopsis': [101, 150],
  }

  const extractedFeatures = features.flatMap(feature => {
    const [start, end] = featureMapping[feature]
    const values = []
    for (let i = start; i <= end; i++) {
      const columnName = Object.keys(serie)[i] // Récupérer le nom de la colonne à partir de l'index
      values.push(parseFloat(serie[columnName]) || 0) // Convertir en nombre ou remplacer par 0
    }
    return values
  })

  console.log('Indices des colonnes pour les caractéristiques :', featureMapping)
  console.log('Colonnes extraites pour chaque caractéristique :', extractedFeatures)
  return extractedFeatures
}

// Fonction pour calculer la similarité cosinus
function calcul_similarite(serie_1, serie_2, df, features) {
  const features_1 = get_features(serie_1, features, df)
  const features_2 = get_features(serie_2, features, df)

  console.log(`Caractéristiques de ${serie_1} :`, features_1)
  console.log(`Caractéristiques de ${serie_2} :`, features_2)

  if (features_1.length === 0 || features_2.length === 0) {
    return null
  }

  const dotProduct = features_1.reduce((sum, val, i) => sum + val * features_2[i], 0)
  const magnitude1 = Math.sqrt(features_1.reduce((sum, val) => sum + val ** 2, 0))
  const magnitude2 = Math.sqrt(features_2.reduce((sum, val) => sum + val ** 2, 0))

  console.log(`Produit scalaire : ${dotProduct}`)
  console.log(`Magnitude 1 : ${magnitude1}`)
  console.log(`Magnitude 2 : ${magnitude2}`)

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  const similarity = dotProduct / (magnitude1 * magnitude2)
  console.log(`Similarité cosinus : ${similarity}`)
  return similarity
}

const features = ['llama_Synopsis', 'audio', 'vidéo']
const similarity = ref(null)

onMounted(async () => {
  if (!df.value || df.value.length === 0) { // Utilisation de .value
    await loadCSV('/RECO/data/characteristics.csv') // charger les données si elles sont vides
  }
  if (selectedSeries.value.length >= 2) {
    const serie1 = selectedSeries.value[0]['TV Serie Name']
    const serie2 = selectedSeries.value[1]['TV Serie Name']
    similarity.value = calcul_similarite(serie1, serie2, df, features)
    console.log(`Similarité cosinus entre "${serie1}" et "${serie2}" :`, similarity.value)
  } else {
    console.warn('Moins de deux séries sélectionnées pour calculer la similarité.')
  }
})
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
  <h3>Exemple de calcul de similarité :</h3>
  <p v-if="similarity !== null">
    Similarité cosinus entre "{{ selectedSeries[0]?.['TV Serie Name'] }}" et "{{ selectedSeries[1]?.['TV Serie Name'] }}" : {{ similarity }}
  </p>
  <p v-else>
    Impossible de calculer la similarité (moins de deux séries sélectionnées).
  </p>
</template>