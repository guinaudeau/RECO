<script setup>
import { defineProps, ref, onActivated, defineEmits, watch } from 'vue'
//import {computed } from 'vue'
const emit = defineEmits(['update:sliders'])

const props = defineProps(['series', 'sliders', 'characteristics']) // Recevoir les séries et sliders via props
const similaritiesTable = ref([]) // Tableau des similarités
const comparisonResult = ref(null) // Résultat de la comparaison entre deux séries
let editFeature = ref(false) // État pour afficher/masquer la personnalisation

// Initialiser tous les sliders à "1" (tout coché par défaut, y compris les features principales)
function getDefaultSliders() {
  const sliders = {};
  featureKeys.forEach(key => {
    sliders[key] = "1" ;
    (featureColumns[key] || []).forEach(col => {
      sliders[col] = "1";
    })
  })
  return sliders;
}

// Copie locale pour l'édition (tout coché par défaut si vide)
const localSliders = ref(
  Object.keys(props.sliders || {}).length
    ? Object.fromEntries(Object.entries(props.sliders).map(([k, v]) => [k, v === 1 ? "1" : v === 0 ? "0" : v]))
    : (getDefaultSliders())
)

// Quand on ouvre la personnalisation, synchroniser la copie locale
function openEdit() {
  localSliders.value = { ...props.sliders }
  editFeature.value = true
}

// Émettre la mise à jour au parent
function validerChanges() {
  emit('update:sliders', localSliders.value)
  editFeature.value = false
  // Réinitialiser les résultats
  comparisonResult.value = null
  similaritiesTable.value = []
}
watch(
  () => props.sliders,
  () => {
    const selectedSeries = props.series.filter(serie => serie.checked)
    if (typeAffichage.value === 1 && selectedSeries.length > 0) {
      calculerSimilaritesPourUneSerie(selectedSeries[0].name)
    } else if (typeAffichage.value === 2 && selectedSeries.length > 1) {
      calculerSimilaritesEntreDeuxSeries(selectedSeries[0].name, selectedSeries[1].name)
    }
  },
  { deep: true }
)

// Fonction pour calculer la similarité entre deux vecteurs (pas de pondération)
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

// Mapping des features vers les colonnes du CSV
const featureColumns = {
  plot: [
    "Plot complexity", "Language level", "Character development", "Originality of the plot", "Themes of good and evil",
    "Deception", "Personal emancipation trajectories", "Collective struggles", "Found families theme",
    "Shakespearean human issues", "Brutal realism"
  ],
  content: [
    "Wokeness", "Historical restitution accuracy", "Multiple characters", "Disabilities", "Politics",
    "Security issues", "Environmental issues", "Investigation", "Thought-provoking series", "Religion", "Travel"
  ],
  character: [
    "Female characters", "Diversity", "Multigenerational", "Animals"
  ],
  representation: [
    "Graphic nature", "Sexual violence", "Violence", "Vulgar dialogues"
  ],
  visuals: [
    "Urban atmosphere", "Rurality", "Wilderness", "Space", "Diversity of locations"
  ],
  comedy: [
    "Humor", "Dark humor", "Satire"
  ],
  emotion: [
    "Nostalgia factor", "Romantic elements", "Feel good", "Dark", "Cute"
  ],
  artistic: [
    "Presence of music", "Language diversity", "Cultural references", "Food"
  ],
  structural: [
    "Suspense", "Action elements", "Everyday life"
  ],
  audio: [
    "NoEnergy", "Music", "Noise", "Voice", "F/H"
  ],
  video: [
    "Mean Brightness", "STDÊ Brightness", "MinÊ Brightness", "MaxÊ Brightness", "Mean Contrast", "STDÊ Contrast", "MinÊ Contrast", "MaxÊ Contrast", "Mean Saturation", "STDÊ Saturation", "MinÊ Saturation", "MaxÊ Saturation", "Heat", "Scene/Seconds", "Plans tres rapide", "Plans courts", "Plans moyens", "Plans longs", "Plans tres longs", "Optical Flow Max", "Optical Flow Score", "Optical Flow STD"
  ]
}

const featureKeys = [
  "plot", "content", "character", "representation", "visuals",
  "comedy", "emotion", "artistic", "structural", "audio", "video"
]

// Fonction pour activer/désactiver toutes les sous-features d'un groupe
function toggleFeatureGroup(key, checked) {
  (featureColumns[key] || []).forEach(col => {
    localSliders.value[col] = checked ? "1" : "0"
  })
}

// Fonction pour savoir si toutes les sous-features ET la principale sont cochées
// function isFeatureGroupChecked(key) {
//   if (localSliders.value[key] !== "1") return false
//   const cols = featureColumns[key] || []
//   if (cols.length === 0) return false
//   return cols.every(col => localSliders.value[col] === "1")
// }

// Fonction pour récupérer les caractéristiques d'une série selon le mapping (pas de pondération)
function getFeatures(serieName, featureKeys) {
  const serie = props.characteristics.find(item => item["Serie"] === serieName)
  if (!serie) return featureKeys.map(() => [])

  return featureKeys.flatMap(key => {
    const cols = featureColumns[key] || []
    // On ne prend en compte que les sous-features activées
    return cols
      .filter(col => localSliders.value[col] === "1")
      .map(col => parseFloat(serie[col]) || 0)
  })
}

// Fonction pour calculer les similarités pour une série donnée (moyenne simple)
function calculerSimilaritesPourUneSerie(serie_name) {
  const selectedSerie = props.series.find(serie => serie.name === serie_name)
  if (!selectedSerie) return

  similaritiesTable.value = props.series
    .filter(serie => serie.name !== serie_name)
    .map(serie => {
      const featureSimilarities = featureKeys.map(key => {
        const cols = featureColumns[key] || []
        const activeCols = cols.filter(col => localSliders.value[col] === "1")
        if (activeCols.length === 0) return null
        const featureVectorA = getFeatures(selectedSerie.name, [key])
        const featureVectorB = getFeatures(serie.name, [key])
        const similarity = cosineSimilarity(featureVectorA, featureVectorB)
        return { key, similarity, count: activeCols.length }
      }).filter(Boolean)

      // Moyenne simple des similarités de features actives
      const meanSimilarity = featureSimilarities.length > 0
        ? featureSimilarities.reduce((sum, feature) => sum + feature.similarity, 0) / featureSimilarities.length
        : 0

      return {
        name: serie.name,
        similarity: meanSimilarity,
        featureSimilarities,
        image: serie.image,
        description: serie.description
      }
    })

  similaritiesTable.value.sort((a, b) => b.similarity - a.similarity) // Trier par similarité décroissante
}

// Fonction pour calculer la similarité entre deux séries (moyenne simple)
function calculerSimilaritesEntreDeuxSeries(serie1Name, serie2Name) {
  const featureSimilarities = featureKeys.map(key => {
    const cols = featureColumns[key] || []
    const activeCols = cols.filter(col => localSliders.value[col] === "1")
    if (activeCols.length === 0) return null
    const featureVectorA = getFeatures(serie1Name, [key])
    const featureVectorB = getFeatures(serie2Name, [key])
    const similarity = cosineSimilarity(featureVectorA, featureVectorB)
    return { key, similarity, count: activeCols.length }
  }).filter(Boolean)

  const meanSimilarity = featureSimilarities.length > 0
    ? featureSimilarities.reduce((sum, feature) => sum + feature.similarity, 0) / featureSimilarities.length
    : 0

  // Stocker le résultat dans comparisonResult
  comparisonResult.value = {
    serie1Name,
    serie2Name,
    weightedSimilarity: meanSimilarity,
    featureSimilarities
  }
}

// Charger les données et effectuer les calculs à chaque fois que le composant est activé
let typeAffichage = ref(0) // 1 pour une série, 2 pour deux séries
onActivated(async () => {
  try {
    console.log('Caractéristiques disponibles :', props.characteristics)
    // Vérifier si la liste des séries sélectionnées est vide
    const selectedSeries = props.series.filter(serie => serie.checked)
    if (selectedSeries.length === 0) {
      // Rediriger vers Home si aucune série n'est sélectionnée
      window.location.hash = '#/'
      return
    }
    if (selectedSeries.length === 1) {
      typeAffichage.value = 1
      // Calculer les similarités pour la première série cochée
      calculerSimilaritesPourUneSerie(selectedSeries[0].name)
      
    } else if (selectedSeries.length === 2) {
      // Calculer les similarités entre deux séries cochées
      calculerSimilaritesEntreDeuxSeries(selectedSeries[0].name, selectedSeries[1].name)
      typeAffichage.value = 2
    }
  } catch (error) {
    console.error('Erreur lors du chargement des caractéristiques :', error)
  }
})

// Fonction pour afficher la similarité pour chaque feature
function showFeatureSimilarities(featureSimilarities) {
  const message = featureSimilarities
    .map(feature => `${feature.key} : ${(feature.similarity * 100).toFixed(2)}%`)
    .join('\n')
  alert(`Similarité par feature :\n${message}`)
}

/*
const allKeys = computed(() => {
  // Prend la première série pour obtenir les colonnes
  const firstSerie = props.characteristics[0]
  return firstSerie ? Object.keys(firstSerie) : []
})

const llamaSynopsisCols = computed(() => allKeys.value.slice(1, 51))
const audioCols = computed(() => allKeys.value.slice(51, 56))
const videoCols = computed(() => allKeys.value.slice(56))

// Fonction utilitaire pour diviser un tableau en morceaux
function chunkArray(array, size) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

const audioColsChunks = computed(() => chunkArray(audioCols.value, 10))
const videoColsChunks = computed(() => chunkArray(videoCols.value, 10))
const llamaSynopsisColsChunks = computed(() => chunkArray(llamaSynopsisCols.value, 10))

function syncCheckboxGroup(mainKey) {
  let group = []
  if (mainKey === 'llama_Synopsis') group = llamaSynopsisCols.value
  if (mainKey === 'audio') group = audioCols.value
  if (mainKey === 'vidéo') group = videoCols.value
  const value = localSliders.value[mainKey]
  group.forEach(key => {
    localSliders.value[key] = value
  })
}
*/
</script>

<template>
  <div class="contenu">
    <h2>Résultats des séries sélectionnées</h2>
    <div id="personnalisation">
      <button @click="openEdit" v-if="!editFeature">personnaliser le resultat</button>
      <div v-if="editFeature">
        <button @click="validerChanges">Valider les changements</button>
        <h3>Personnalisation des critères</h3>
        <!-- Grille pour les critères principaux, répartie sur 3 par ligne -->
        <div class="checkbox-grid-multi">
          <div
            class="checkbox-row"
            v-for="row in Math.ceil(featureKeys.length / 3)"
            :key="row"
          >
            <div
              v-for="key in featureKeys.slice((row - 1) * 3, row * 3)"
              :key="key"
            >
              <label class="feature-title-checkbox">
                <input
                  type="checkbox"
                  v-model="localSliders[key]"
                  true-value="1"
                  false-value="0"
                  @change="toggleFeatureGroup(key, $event.target.checked)"
                />
                <strong>{{ key }}</strong>
              </label>
              <div class="checkbox-col">
                <label
                  v-for="col in featureColumns[key]"
                  :key="col"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    v-model="localSliders[col]"
                    true-value="1"
                    false-value="0"
                  />
                  {{ col }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <button @click="validerChanges">Valider les changements</button>
        <button @click="editFeature = false">Annuler</button>
      </div>
    </div>
    <table v-if="typeAffichage===1" class="similarities-table">
      <caption>Tableau des similarités</caption>
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
    <div v-else-if="typeAffichage === 2 && comparisonResult" class="comparison-result">
      <h3>Comparaison entre {{ comparisonResult.serie1Name }} et {{ comparisonResult.serie2Name }}</h3>
      <p><strong>Similarité globale :</strong> {{ (comparisonResult.weightedSimilarity * 100).toFixed(2) }}%</p>
      <ul>
        <li v-for="feature in comparisonResult.featureSimilarities || []" :key="feature.key">
          <strong>{{ feature.key }} :</strong> {{ (feature.similarity * 100).toFixed(2) }}%
        </li>
      </ul>
    </div>
    <p v-else>Aucune série trouvée.</p>
  </div>
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

/* Styles pour la personnalisation */
#personnalisation {
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
}

/* Ligne principale des checkboxes */
.main-checkbox-row {
  display: flex;
  gap: 2em;
  justify-content: center;
  margin-bottom: 1em;
}

/* Grille des checkboxes */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1em 2em;
  margin-bottom: 1em;
  justify-items: start;
}

/* Grille multi-lignes pour les critères principaux */
.checkbox-grid-multi {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1em;
}

.checkbox-row {
  display: flex;
  gap: 2em;
  justify-content: center;
  flex-wrap: wrap;
}

.checkbox-row > div {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  min-width: 180px;
  flex: 1 1 180px;
  max-width: 250px;
}

.feature-title-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.5em;
}

@media (max-width: 1100px) {
  .checkbox-row {
    gap: 1em;
  }
  .checkbox-row > div {
    min-width: 140px;
    max-width: 1fr;
  }
}

@media (max-width: 800px) {
  .checkbox-row {
    flex-wrap: wrap;
    gap: 0.5em;
  }
  .checkbox-row > div {
    min-width: 120px;
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .checkbox-row {
    flex-direction: column;
    align-items: stretch;
  }
  .checkbox-row > div {
    min-width: 100%;
    max-width: 100%;
  }
}

/* Éléments individuels de la checkbox */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1em;
}

.checkbox-col {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}
</style>