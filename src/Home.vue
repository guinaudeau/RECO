<template>
  <h2>Liste des séries</h2>
  <form @submit.prevent="afficherSelectionnes">
    <input type="checkbox" v-model="afficherSelectionnes" />
    <label>Afficher les séries sélectionnées</label>
    <button type="submit">Afficher</button>
  </form>
  <form @submit.prevent="searchQuery">
    <input type="text" v-model="rechercher" autocomplete="on" placeholder="Rechercher une série" />
    <button type="submit">Rechercher</button>
</form>
    <table>
      <tbody>
        <tr v-for="(group, groupIndex) in groupedSeries" :key="groupIndex">
          <td
            v-for="serie in group"
            :key="serie.id"
            data-titre="séris"
            class="checkbox-wrapper-50"
          >
            <p>{{ serie['TV Serie Name'] }}</p>
            <input type="checkbox" v-model="serie.checked" class="plus-minus" />
            <button @click="modifySerie(serie)">plus d'information</button>
          </td>
        </tr>
      </tbody>
    </table>

  <p>Nombre de séries : {{ series.length }}</p>
  <p>Nombre de séries cochées : {{ series.filter(serie => serie.checked).length }}</p>
  <p>Nombre de séries non cochées : {{ series.filter(serie => !serie.checked).length }}</p>
  <p>Nombre de séries modifiées : {{ series.filter(serie => serie.modified).length }}</p>
  
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import * as XLSX from 'xlsx'
import { selectedSeries } from './store.js'

const series = ref([])
let rechercher = ref('')

// Fonction pour charger les données depuis un fichier Excel
const loadExcelData = async (filePath) => {
  try {
    const response = await fetch(filePath)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Le fichier Excel ne contient aucune feuille.')
    }

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    if (!sheet) {
      throw new Error('La feuille Excel est vide ou invalide.')
    }

    series.value = XLSX.utils.sheet_to_json(sheet).map((serie, index) => ({
      ...serie,
      id: index,
      checked: false,
      deleted: false,
      modified: false
    }))
  } catch (error) {
    console.error('Erreur lors du chargement du fichier Excel :', error)
  }
}

// Fonction pour rechercher une série
const searchQuery = () => {
  const filteredSeries = series.value.filter(serie => {
    return Object.values(serie).some(value => {
      return String(value).toLowerCase().includes(rechercher.value.toLowerCase())
    })
  })
  series.value = filteredSeries
}

// Fonction pour mettre à jour les séries sélectionnées dans le store
const afficherSelectionnes = () => {
  selectedSeries.value = series.value.filter(serie => serie.checked) // Met à jour le store
  if (selectedSeries.value.length > 0) {
    alert('Séries sélectionnées : ' + selectedSeries.value.map(serie => serie['TV Serie Name']).join(', '))
  } else {
    alert('Aucune série sélectionnée')
  }
}

// Charger les données Excel au montage du composant
onMounted(() => {
  loadExcelData('/RECO/data/characteristics.csv')
})

// Propriété calculée pour regrouper les séries par lot de 5
const groupedSeries = computed(() => {
  const filteredSeries = series.value.filter(serie => !serie.deleted)
  const groups = []
  for (let i = 0; i < filteredSeries.length; i += 5) {
    groups.push(filteredSeries.slice(i, i + 5))
  }
  return groups
})
</script>

<style>
  tbody{
    text-align: center;
  }
  form {
    margin-bottom: 20px;
  }
    .checkbox-wrapper-50 *,
    .checkbox-wrapper-50 *::before,
    .checkbox-wrapper-50 *::after {
      box-sizing: border-box;
    }

    .checkbox-wrapper-50 .plus-minus {
      --primary: #1E2235;
      --secondary: #FAFBFF;
      --duration: .5s;
      -webkit-appearance: none;
      -moz-appearance: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-mask-image: -webkit-radial-gradient(white, black);
      outline: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      perspective: 240px;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      border: 4px solid var(--primary);
      background-size: 300% 300%;
      transition: transform 0.3s;
      transform: scale(var(--scale, 1)) translateZ(0);
      -webkit-animation: var(--name, unchecked-50) var(--duration) ease forwards;
              animation: var(--name, unchecked-50) var(--duration) ease forwards;
      margin: 0;
    }
    .checkbox-wrapper-50 .plus-minus::before,
    .checkbox-wrapper-50 .plus-minus::after {
      content: "";
      position: absolute;
      width: 16px;
      height: var(--height, 16px);
      left: 6px;
      top: var(--top, 6px);
      background: var(--background, var(--primary));
      -webkit-animation: var(--name-icon-b, var(--name-icon, unchecked-icon-50)) var(--duration) ease forwards;
              animation: var(--name-icon-b, var(--name-icon, unchecked-icon-50)) var(--duration) ease forwards;
    }
    .checkbox-wrapper-50 .plus-minus::before {
      -webkit-clip-path: polygon(0 6px, 6px 6px, 6px 0, 10px 0, 10px 6px, 16px 6px, 16px 10px, 10px 10px, 10px 16px, 6px 16px, 6px 10px, 0 10px);
              clip-path: polygon(0 6px, 6px 6px, 6px 0, 10px 0, 10px 6px, 16px 6px, 16px 10px, 10px 10px, 10px 16px, 6px 16px, 6px 10px, 0 10px);
    }
    .checkbox-wrapper-50 .plus-minus::after {
      --height: 4px;
      --top: 12px;
      --background: var(--secondary);
      --name-icon-b: var(--name-icon-a, checked-icon-50);
    }
    .checkbox-wrapper-50 .plus-minus:active {
      --scale: .95;
    }
    .checkbox-wrapper-50 .plus-minus:checked {
      --name: checked-50;
      --name-icon-b: checked-icon-50;
      --name-icon-a: unchecked-icon-50;
    }

    @-webkit-keyframes checked-icon-50 {
      from {
        transform: translateZ(12px);
      }
      to {
        transform: translateX(16px) rotateY(90deg) translateZ(12px);
      }
    }

    @keyframes checked-icon-50 {
      from {
        transform: translateZ(12px);
      }
      to {
        transform: translateX(16px) rotateY(90deg) translateZ(12px);
      }
    }
    @-webkit-keyframes unchecked-icon-50 {
      from {
        transform: translateX(-16px) rotateY(-90deg) translateZ(12px);
      }
      to {
        transform: translateZ(12px);
      }
    }
    @keyframes unchecked-icon-50 {
      from {
        transform: translateX(-16px) rotateY(-90deg) translateZ(12px);
      }
      to {
        transform: translateZ(12px);
      }
    }
    @-webkit-keyframes checked-50 {
      from {
        background-image: radial-gradient(ellipse at center, var(--primary) 0%, var(--primary) 25%, var(--secondary) 25.1%, var(--secondary) 100%);
        background-position: 100% 50%;
      }
      to {
        background-image: radial-gradient(ellipse at center, var(--primary) 0%, var(--primary) 25%, var(--secondary) 25.1%, var(--secondary) 100%);
        background-position: 50% 50%;
      }
    }
    @keyframes checked-50 {
      from {
        background-image: radial-gradient(ellipse at center, var(--primary) 0%, var(--primary) 25%, var(--secondary) 25.1%, var(--secondary) 100%);
        background-position: 100% 50%;
      }
      to {
        background-image: radial-gradient(ellipse at center, var(--primary) 0%, var(--primary) 25%, var(--secondary) 25.1%, var(--secondary) 100%);
        background-position: 50% 50%;
      }
    }
    @-webkit-keyframes unchecked-50 {
      from {
        background-image: radial-gradient(ellipse at center, var(--secondary) 0%, var(--secondary) 25%, var(--primary) 25.1%, var(--primary) 100%);
        background-position: 100% 50%;
      }
      to {
        background-image: radial-gradient(ellipse at center, var(--secondary) 0%, var(--secondary) 25%, var(--primary) 25.1%, var(--primary) 100%);
        background-position: 50% 50%;
      }
    }
    @keyframes unchecked-50 {
      from {
        background-image: radial-gradient(ellipse at center, var(--secondary) 0%, var(--secondary) 25%, var(--primary) 25.1%, var(--primary) 100%);
        background-position: 100% 50%;
      }
      to {
        background-image: radial-gradient(ellipse at center, var(--secondary) 0%, var(--secondary) 25%, var(--primary) 25.1%, var(--primary) 100%);
        background-position: 50% 50%;
      }
    }
    table{overflow-x: auto}
</style>