<script>
</script>
<template>
<div class="partenaire">
  <h2>Partenaire</h2>
  <div class="content">
        <p>projet réalisé en partenaria avec :</p>
        <div class="pair">
            <div>
                <h4> le CNRS</h4>
                <p>Le CNRS est un organisme public de recherche français, l'un des plus grands et prestigieux au monde. Il couvre tous les domaines scientifiques, de la physique à la biologie, en passant par les sciences humaines et sociales.</p>
            </div>
            <a href="https://www.cnrs.fr/fr" target="Fenêtre définie"><img src="CNRS.png" alt="logo du CNRS" /></a>
        </div>
        <div class="impair">
            <div>
                <h4> l'ISJPS</h4>
                <p>L’Institut des sciences juridique et philosophique de la Sorbonne (ISJPS) réunit des chercheurs, des enseignants-chercheurs, des chercheurs associés, des post-doctorants et des doctorants qui abordent ensemble, à partir de leur expertise disciplinaire, des thématiques stratégiques au cœur de notre société.</p>
            </div>
            <a href="https://isjps.pantheonsorbonne.fr/" target="Fenêtre définie"><img src="ISJPS.png" alt="logo du ISJPS" /></a>
        </div>
        <div class="pair">
            <div>
                <h4> le JFLI</h4>
                <p>Le Laboratoire Franco-Japonais d'Informatique est un Laboratoire de Recherche International (IRL 3527) entre deux institutions françaises (CNRS et Sorbonne Université) et trois institutions japonaises (NII, Université de Tokyo et Université Keio). </p>
            </div>
            <a href="https://jfli.cnrs.fr/" target="Fenêtre définie"><img src="logo-jfli.png" alt="logo du JFLI" /></a>
        </div>
        <div class="impair">
            <div>
            <h4> BétaSérie</h4>
            <p>Une plateforme de recommandation de séries.</p>
            </div>
            <a href="https://www.betaseries.com/" target="Fenêtre définie"><img src="betaSeries.jfif" alt="logo de BétaSérie" /></a>
        </div>
    </div>
</div>
</template>
<style>
img{
  max-width: 100%;
  height: auto;
}
a {
  font-size:20px;
  max-width:200px;
  height:auto;
  padding:0;
  display:inline-block;
  text-align:center;
  border-radius:50%;
  box-shadow:0 0 0 1px rgba(255,255,255,0.4);
  margin:0 8px;
  color:#fff;
  opacity:0.75;
}
a:hover {
  opacity:1;
  box-shadow:0 0 0 1px rgba(255,255,255,0.8);
}
div.pair {
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: space-evenly;
  margin-bottom: 20px;
}
div.impair{
  display: flex;
  flex-direction: row;
  align-items: right;
  justify-content: space-evenly;
  margin-bottom: 20px;
}
</style>