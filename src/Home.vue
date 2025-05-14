<template>
  <h2>Liste des séries</h2>
  <form @submit.prevent="searchQuery">
    <input type="text" v-model="rechercher" placeholder="Rechercher une série" />
    <button type="submit">Rechercher</button>
  </form>

  <table>
    <tbody>
      <tr v-for="(group, groupIndex) in groupedSeries" :key="groupIndex">
        <td v-for="serie in group" :key="serie.name">
          <div>
            <img :src="serie.image" alt="Image de la série" class="serie-image" />
            <p>{{ serie.name }}</p>
            <div class="checkbox-wrapper-50">
              <input type="checkbox" class="plus-minus" v-model="serie.checked" @change="countChoices(serie)">
            </div>
            <button @click="showDescription(serie)">Voir description</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <p>Nombre de séries : {{ series.length }}</p>
  <p>Nombre de séries cochées : {{ series.filter(serie => serie.checked).length }}</p>
  <p>Nombre de séries non cochées : {{ series.filter(serie => !serie.checked).length }}</p>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'

const props = defineProps(['series']) // Recevoir les séries via props
const series = ref(props.series) // Référence locale pour manipuler les séries
let rechercher = ref('') // Champ de recherche
let nbCheck = 0 // Nombre de séries cochées

// Fonction pour rechercher une série
const searchQuery = () => {
  const filteredSeries = props.series.filter(serie =>
    Object.values(serie).some(value =>
      String(value).toLowerCase().includes(rechercher.value.toLowerCase())
    )
  )
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

// Propriété calculée pour regrouper les séries par lot de 5
const groupedSeries = computed(() => {
  const groups = []
  for (let i = 0; i < series.value.length; i += 5) {
    groups.push(series.value.slice(i, i + 5))
  }
  return groups
})

// Fonction pour gérer les cases cochées
function countChoices(serie) {
  if (serie.checked) {
    nbCheck++
    if (nbCheck > 2) {
      serie.checked = false
      nbCheck--
      alert('Vous ne pouvez sélectionner que 2 séries au maximum.')
    }
  } else {
    nbCheck--
  }
}
</script>

<style>
.serie-image {
  max-width: 100px;
  max-height: 150px;
}
.serie-image:hover {
  transform: scale(1.1);
  transition: transform 0.3s;
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
</style>
