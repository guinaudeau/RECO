<template>
  <div class="contenu">
    <!--<h1>Bienvenue sur la page d'accueil</h1>
    <p>Cette page affiche une liste de séries avec des options de recherche et de sélection.</p>
    <p>cocher la série pour la sélectionner puis clicker sur resultat pour voir les seris similaires</p>-->
  <h2>Liste des séries</h2>
  <form @submit.prevent="searchQuery">
    <input type="text" v-model="rechercher" placeholder="Rechercher une série" />
    <button type="submit">Rechercher</button>
    <button type="reset" @click="series = props.series">annuler</button>
  </form>

  <div class="series-grid">
    <div v-for="serie in series" :key="serie.name" class="serie-card">
      <img :src="serie.image" alt="Image de la série" class="serie-image" />
      <p>{{ serie.name }}</p>
      <div class="checkbox-wrapper-50">
        <input type="checkbox" class="plus-minus" v-model="serie.checked" @change="countChoices(serie)">
      </div>
      <button @click="showDescription(serie)">Voir description</button>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

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
  if (filteredSeries.length === 0) {
    alert("Aucune série trouvée.")
    return
  }
}

// Fonction pour afficher la description d'une série
const showDescription = (serie) => {
  if (serie.name && serie.description) {
    alert(`Description de "${serie.name}": ${serie.description}`)
  } else {
    alert("Les informations de la série sont incomplètes.")
  }
}

// Fonction pour gérer les cases cochées
let listeCoches = []
function countChoices(serie) {
  if (serie.checked) {
    nbCheck++
    listeCoches.push(serie.name)
    if (nbCheck > 2) {
      let removed = listeCoches.shift() // Retirer le premier élément si plus de 2 séries sont cochées
      props.series.find(s => s.name === removed).checked = false
      nbCheck--
    }
  } else {
    nbCheck--
    listeCoches = listeCoches.filter(s => s !== serie.name) // Retirer la série de la liste si décochée
  }
}
</script>

<style>
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 20px 10px;
  background: #c4e0ff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
  margin: 30px auto 10px auto;
}

td {
  background: #cae3ff;
  border-radius: 14px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  padding: 18px 12px 12px 12px;
  vertical-align: top;
  text-align: center;
  min-width: 170px;
  transition: box-shadow 0.2s;
}

td:hover {
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.25);
}

.serie-image {
  max-width: 110px;
  max-height: 160px;
  border-radius: 10px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
  background: #f3f3f3;
  transition: transform 0.3s;
}

.serie-image:hover {
  transform: scale(1.08);
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 18px 0 10px 0;
  gap: 10px;
}

input[type="text"],
input[type="email"] {
  padding: 8px 14px;
  border: 1.5px solid #dbe2ea;
  border-radius: 6px;
  font-size: 1.1em;
  background: #f8fafd;
  transition: border 0.2s;
}

input[type="text"]:focus,
input[type="email"]:focus {
  border: 1.5px solid #7dcfff;
  outline: none;
}

button,
button[type="submit"] {
  background: #7dcfff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  transition: background 0.2s, color 0.2s;
}

button:hover,
button[type="submit"]:hover {
  background: #2d3a4a;
  color: #fff;
}

p {
  color: #3a4a5d;
  font-size: 1.08em;
  margin: 8px 0 0 0;
}

@media (max-width: 900px) {
  table, tbody, tr, td {
    display: block;
    width: 100%;
  }
  td {
    margin-bottom: 18px;
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

@media (max-width: 900px) {
  .series-grid {
    grid-template-columns: 1fr !important;
    padding: 12px;
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
    }    to {
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



.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px 20px;
  margin: 30px auto 10px auto;
  background: #c3d8dc; /*#c4e0ff;*/
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
  padding: 24px;
}

.serie-card {
  background: #c4e0ff;
  border-radius: 14px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);
  padding: 18px 12px 12px 12px;
  text-align: center;
  min-width: 0;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.serie-card:hover {
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.10);
}

/* Mode sombre */
html.dark,
html.dark-mode {
  background: #181c23;
  color: #e6eaf3;
}

html.dark table,
html.dark-mode table,
html.dark .series-grid,
html.dark-mode .series-grid,
html.dark .serie-card,
html.dark-mode .serie-card {
  background: #232834;
  color: #e6eaf3;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
}

html.dark td,
html.dark-mode td {
  background: #232834;
  color: #e6eaf3;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);
}

html.dark td:hover,
html.dark-mode td:hover {
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.32);
}

html.dark .serie-image,
html.dark-mode .serie-image {
  background: #232834;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.22);
}

html.dark h2,
html.dark-mode h2 {
  color: #7dcfff;
}

html.dark input[type="text"],
html.dark-mode input[type="text"],
html.dark input[type="email"],
html.dark-mode input[type="email"] {
  background: #232834;
  color: #e6eaf3;
  border: 1.5px solid #3a4152;
}

html.dark input[type="text"]:focus,
html.dark-mode input[type="text"]:focus,
html.dark input[type="email"]:focus,
html.dark-mode input[type="email"]:focus {
  border: 1.5px solid #7dcfff;
}

html.dark button,
html.dark-mode button,
html.dark button[type="submit"],
html.dark-mode button[type="submit"] {
  background: #2d3a4a;
  color: #fff;
}

html.dark button:hover,
html.dark-mode button:hover,
html.dark button[type="submit"]:hover,
html.dark-mode button[type="submit"]:hover {
  background: #7dcfff;
  color: #232834;
}

html.dark p,
html.dark-mode p {
  color: #b6c2d1;
}
</style>
