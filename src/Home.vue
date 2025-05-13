<template>
  <h2>Liste des séries</h2>
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
          <div class="cell-content">
            <p class="serie-title">{{ serie.name }}</p>
            <img :src="serie.image" alt="Image de la série" v-if="serie.image" class="serie-image" />
            <button @click="showDescription(serie)" class="info-button">plus d'information</button>
            <input 
              type="checkbox" 
              v-model="serie.checked" 
              class="plus-minus" 
              @change="countChoices($event.target)" 
            />
          </div>
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
import { defineProps, ref, computed, watch } from 'vue'
import { selectedSeries } from './store.js'

const props = defineProps(['series']) // Recevoir les données via props
const series = ref(props.series) // Utiliser les données reçues
let rechercher = ref('')

// Fonction pour rechercher une série
const searchQuery = () => {
  const filteredSeries = series.value.filter(serie => {
    return Object.values(serie).some(value => {
      return String(value).toLowerCase().includes(rechercher.value.toLowerCase())
    })
  })
  series.value = filteredSeries
}

// Fonction pour afficher la description d'une série
const showDescription = (serie) => {
  if (serie.name && serie.description) {
    alert(`Description de "${serie.name}": ${serie.description}`)
  } else {
    alert("Les informations de la série sont incomplètes.")
  }
}

// Watch pour mettre à jour les séries sélectionnées dans store
watch(
  series,
  (newSeries) => {
    selectedSeries.value = newSeries.filter(serie => serie.checked) // Met à jour store
  },
  { deep: true }
)

// Propriété calculée pour regrouper les séries par lot de 5
const groupedSeries = computed(() => {
  const filteredSeries = series.value.filter(serie => !serie.deleted)
  const groups = []
  for (let i = 0; i < filteredSeries.length; i += 5) {
    groups.push(filteredSeries.slice(i, i + 5))
  }
  return groups
})

var nbCheck = 0;
// Fonction pour vérifier si une case est cochée
function isChecked(elmt) {
  return elmt.checked;
}
// Fonction pour compter le nombre de choix
function countChoices(elmt) {
  if (nbCheck < 2 || !isChecked(elmt)) {
    if (isChecked(elmt)) {
      nbCheck += 1;
    } else {
      nbCheck -= 1;
    }
  } else {
    elmt.checked = false;
  }
}
</script>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    overflow-x: auto;
  }

  tbody {
    text-align: center;
  }

  td {
    padding: 10px;
    vertical-align: top;
  }

  .cell-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .serie-title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .serie-image {
    max-width: 100px;
    max-height: 150px;
    margin-bottom: 10px;
  }

  .info-button {
    margin-bottom: 10px;
    padding: 5px 10px;
    font-size: 0.9em;
    cursor: pointer;
  }

  .plus-minus {
    margin-top: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #007bff; /* Couleur personnalisée pour la checkbox */
    border: 2px solid #ddd;
    border-radius: 4px;
  }

  .plus-minus:checked {
    border-color: #007bff;
    background-color: #007bff;
  }

  
  @media (max-width: 768px) {
    table {
      display: block;
      width: 100%;
    }

    tbody {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    td {
      display: block;
      width: 100%;
      max-width: 300px;
      margin: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .cell-content {
      padding: 10px;
    }
  
    form {
    margin-bottom: 20px;
  }
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
        background-position: 0% 50%;
      }
    }
    @keyframes checked-50 {
      from {
        background-image: radial-gradient(ellipse at center, var(--primary) 0%, var(--primary) 25%, var(--secondary) 25.1%, var(--secondary) 100%);
        background-position: 100% 50%;
      }
      to {
        background-position: 0% 50%;
      }
    }
    table{overflow-x: auto}
    table img{
      max-width: 100px;
      max-height: 200px;
    }
</style>