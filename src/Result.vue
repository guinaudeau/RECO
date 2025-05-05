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
    console.log('Contenu brut du fichier CSV :', text)

    const rows = text.split('\n').map(row => row.split(';'))
    console.log('Lignes du fichier CSV :', rows)

    const headers = rows.shift() // Extraire les en-têtes
    console.log('En-têtes du fichier CSV :', headers)

    df.value = rows.map(row => {
      const obj = {}
      row.forEach((value, index) => {
        obj[headers[index]] = isNaN(value) ? value : parseFloat(value) // Convertir en nombre si possible
      })
      return obj
    })
    console.log('Données chargées :', df.value)
  } catch (error) {
    console.error('Erreur lors du chargement du fichier CSV :', error)
  }
}

// Fonction pour extraire les caractéristiques d'une série
function get_features(serie_name, features, df) {
  const serie = df.value.find(row => row['name'] === serie_name)
  console.log(`Série recherchée : ${serie_name}`)
  console.log(`Série trouvée :`, serie)
  if (!serie) {
    console.error(`Série ${serie_name} non trouvée dans les données.`)
    return []
  }

  // Correspondance des caractéristiques avec les indices des colonnes
  const featureMapping = {
    'audio': Object.keys(serie).slice(310, 315), // Colonnes 311 à 315
    'vidéo': Object.keys(serie).slice(315),      // Colonnes 316 à la fin
    'llama_Synopsis': Object.keys(serie).slice(100, 150), // Colonnes 101 à 150
  }

  const extractedFeatures = features.flatMap(feature => {
    const columns = featureMapping[feature]
    const values = columns.map(columnName => {
      const value = parseFloat(serie[columnName]) || 0 // Convertir en nombre ou remplacer par 0
      console.log(`Valeur extraite pour ${feature} (${columnName}) : ${value}`)
      return value
    })
    return values
  })

  console.log(`Caractéristiques extraites pour ${serie_name} :`, extractedFeatures)
  return extractedFeatures
}

// Fonction pour calculer la similarité cosinus
function calcul_similarite_par_feature(serie_1, serie_2, df, features) {
  const resultats = {}

  features.forEach(feature => {
    const features_1 = get_features(serie_1, [feature], df)
    const features_2 = get_features(serie_2, [feature], df)

    console.log(`Caractéristiques de ${serie_1} pour ${feature} :`, features_1)
    console.log(`Caractéristiques de ${serie_2} pour ${feature} :`, features_2)

    if (features_1.length === 0 || features_2.length === 0) {
      resultats[feature] = null
      return
    }

    const dotProduct = features_1.reduce((sum, val, i) => sum + val * features_2[i], 0)
    const magnitude1 = Math.sqrt(features_1.reduce((sum, val) => sum + val ** 2, 0))
    const magnitude2 = Math.sqrt(features_2.reduce((sum, val) => sum + val ** 2, 0))

    console.log(`Produit scalaire pour ${feature} : ${dotProduct}`)
    console.log(`Magnitude 1 pour ${feature} : ${magnitude1}`)
    console.log(`Magnitude 2 pour ${feature} : ${magnitude2}`)

    if (magnitude1 === 0 || magnitude2 === 0) {
      resultats[feature] = 0
    } else {
      resultats[feature] = dotProduct / (magnitude1 * magnitude2)
    }

    console.log(`Similarité cosinus pour ${feature} : ${resultats[feature]}`)
  })

  return resultats
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