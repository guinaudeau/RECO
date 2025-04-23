<template>
  <h1>Liste des séries déploier</h1>
  <form @submit.prevent="afficherSelectionnes">
    <input type="checkbox" v-model="afficherSelectionnes" />
    <label>Afficher les séries sélectionnées</label>
    <button type="submit">Afficher</button>
  </form>
  <form @submit.prevent="searchQuery">
    <input type="text" v-model="rechercher" placeholder="Rechercher une série" />
    <button type="submit">Rechercher</button>
</form>
    <select v-model="selected">
        <option disabled value="">Please select one</option>
        <option>couleur</option>
        <option>sénario</option>
        <option>C</option>
    </select>
  <table>
    <tbody>
        <td data-titre="séris" v-for="serie in series.filter(serie => !serie.deleted)" :key="serie.id" class="checkbox-wrapper-50">
            <p>{{ serie['TV Serie Name'] }}</p>
            <input type="checkbox" v-model="serie.checked" class="plus-minus"/>
            <button @click="modifySerie(serie)">plus d'information</button>
        
        </td>
    </tbody>
  </table>

  <p>Nombre de séries : {{ series.length }}</p>
  <p>Nombre de séries cochées : {{ series.filter(serie => serie.checked).length }}</p>
  <p>Nombre de séries non cochées : {{ series.filter(serie => !serie.checked).length }}</p>
  <p>Nombre de séries modifiées : {{ series.filter(serie => serie.modified).length }}</p>
  <input type="range" min="0" max="100" value="40" step="5" />
  <h2> teste de proter</h2>
  
</template>
<script setup>
  import { ref, onMounted } from 'vue'
  import seriesData from './data/CharacteristiquesSeriesReco+.json'
  import infoSérie from './data/Series.json'
  const series = ref([])
  const seriesInfo = ref([])
  const rechercher = ref('')
  onMounted(() => {
    series.value = seriesData.map((serie, index) => ({
      ...serie,
      id: index,
      checked: false,
      supprimées: false
    }))
      seriesInfo.value = infoSérie.map((nom, description, image, index) => ({
          ...nom,
          ...description,
          ...image,
          id: index
      }))
  })
  const searchQuery =() => {
      //ToDo
      series.value.filter(serie => serie['supprimées']=true)
      alert(series.value.filter(serie => serie['TV Serie Name'].toLowerCase().includes(rechercher.value.toLowerCase()))['supprimées']=false)
      if (series.value.filter(serie => serie['TV Serie Name'].toLowerCase().includes('a'))!==undefined) {
          alert(series.value.filter(serie => serie['TV Serie Name'].toLowerCase().includes(rechercher.value.toLowerCase())).map(serie => serie['TV Serie Name']).join(', '))
          
      } else {
          alert('Aucune série trouvée')
      }

  }
  const modifySerie = (serie) => {
      let i=0
      while (serie[ 'TV Serie Name'] !== seriesInfo.value[i]['name']) {
          i++
      }
      alert(seriesInfo.value[i]['description'])
    
    serie.modified = true
  }

  const afficherSelectionnes = () => {
    const selectedSeries = series.value.filter(serie => serie.checked)
    if (selectedSeries.length > 0) {
      alert('Séries sélectionnées : ' + selectedSeries.map(serie => serie['TV Serie Name']).join(', '))
    } else {
      alert('Aucune série sélectionnée')
    }
  }
</script>

<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #69c8ff;
    color: #34495e;
    margin: 0;
  }
  input[type="range"] {
    font-size: 1.5rem;
    width: 12.5em;
  }
  tbody{
    text-align: center;
  }

  input[type="range"] {
    appearance: none;
    color: #ef233c;
    --thumb-height: 1.125em;
    --track-height: 0.125em;
    --track-color: rgba(0, 0, 0, 0.2);
    --brightness-hover: 180%;
    --brightness-down: 80%;
    --clip-edges: 0.125em;
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