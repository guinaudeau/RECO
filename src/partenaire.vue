<script>
</script>
<template>
<div class="partenaire">
  <h2>Partenaire</h2>
  <div class="container">
        <p>projet réalisé en partenaria avec :</p>
        <div class="pair">
            <div class="description">
                <h4> le CNRS</h4>
                <p>Le CNRS est un organisme public de recherche français, l'un des plus grands et prestigieux au monde. Il couvre tous les domaines scientifiques, de la physique à la biologie, en passant par les sciences humaines et sociales.</p>
            </div>
            <a href="https://www.cnrs.fr/fr" target="Fenêtre définie"><img src="CNRS.png" alt="logo du CNRS" /></a>
        </div>
        <div class="impair">
            
          <a href="https://isjps.pantheonsorbonne.fr/" target="Fenêtre définie"><img src="ISJPS.png" alt="logo du ISJPS" /></a>
          <div class="description">
              <h4> l'ISJPS</h4>
              <p>Le projet DEMOSERIES rassemble une équipe de chercheurs en philosophie morale, études cinématographiques, médias numériques et données culturelles, sociologie, droit et sciences politiques, afin d'explorer un corpus de séries télévisées sur la sécurité, de leur conception à leur réception. Cela requiert une éthique particulariste fondée sur l'attention portée à des situations multidimensionnelles, associée à des méthodes qualitatives (entretiens avec des experts en sécurité, des showrunners, des téléspectateurs ; analyses d'images, de tropes, de mots ; ethnographie de la réception) et quantitatives (tweets et web analytics). En élucidant la manière dont ces séries sont conçues par leurs créateurs et leurs publics, DEMOSERIES vise ainsi à comprendre si et comment elles peuvent jouer un rôle crucial dans la sensibilisation nécessaire à la sécurité des individus et des sociétés, et dans la création de valeurs partagées et partageables au sein de l'UE et au-delà.</p>
          </div>
        </div>
        <div class="pair">
            <div class="description">
                <h4> le JFLI</h4>
                <p>Le Japanese French Laboratory for Informatics (JFLI) est un laboratoire international de recherche (IRL 3527) regroupant deux institutions françaises (CNRS et Sorbonne Université) et trois institutions japonaises (NII, Université de Tokyo et Université Keio). Sur la base de la coopération scientifique existante entre le Japon et la France, quatre thèmes ont été sélectionnés pour leur potentiel de recherche collaborative fructueuse : Informatique quantique, Intelligence artificielle, Réseaux et cybersécurité, Fondements de l’informatique. </p>
            </div>
            <a href="https://jfli.cnrs.fr/" target="Fenêtre définie"><img src="logo-jfli.png" alt="logo du JFLI" /></a>
        </div>
        <div class="impair">
          <a href="https://www.betaseries.com/" target="Fenêtre définie"><img src="betaSeries.jfif" alt="logo de BétaSérie" /></a>
          <div class="description">
            <h4> BétaSérie</h4>
            <p>BétaSérie est une plateforme communautaire dédiée aux séries télévisées, offrant des outils de recommandation, des critiques et des analyses approfondies. Elle permet aux utilisateurs de découvrir de nouvelles séries en fonction de leurs goûts et de leurs préférences, tout en favorisant les échanges entre passionnés.</p>
          </div>
        </div>
    </div>
</div>

</template>
<style>
img {
  max-width: 100%;
  height: auto;
}

a {
  font-size: 20px;
  max-width: 200px;
  height: auto;
  padding: 0;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  margin: 0 8px;
  opacity: 0.75;
  transition: opacity 0.2s, box-shadow 0.2s;
}

a:hover {
  opacity: 1;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.8);
}

div.pair,
div.impair {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 20px;
}

div.description {
  max-width: 400px;
  margin-right: 20px;
  text-align: center;
}
.partenaire {
  background: #f0f9ff;
  width: 100%;
  padding: 25px 40px 10px 40px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}
</style>