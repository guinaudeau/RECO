<template>
  <div class="container">
    <h2>Le projet RECO+</h2>
    <div class=texte>
        <h3>RECO+ en bref</h3>
        <p class="about">Si visionner des séries télévisées s’est inscrit au fil des années comme une activité centrale de notre forme de vie contemporaine, les spectateurs ont de plus en plus de mal à se retrouver dans la masse et la variété de l’offre. Il est urgent de mettre en place un système avancé de recommandation sérielle, répondant à la fois aux exigences croissantes de l’industrie des séries et aux besoins et intérêts des téléspectateurs. RECO+ sera un système innovant conçu pour fournir aux spectateurs un classement des séries télévisées en fonction de leurs compétences, demandes et préférences éthiques. L’idée novatrice de RECO+ est d’offrir de meilleures recommandations sérielles en changeant le paradigme, c’est-à-dire en explorant le contenu (vidéo, textuel, scénaristique) des séries, plutôt qu’en traçant les comportements de visionnage. RECO+ se concevra de manière conviviale, en s’appuyant sur une IA pourvue par l’agrégation de données multimodales, interactive et générative. RECO+ s’articule autour de critères éthiques tels que la diversité, l’inclusivité et la durabilité, sera accessible au grand public, tout en étant indépendant des recommandations des diffuseurs. L’innovation RECO+ servira à la fois les utilisateurs, les créateurs et les producteurs.</p>
    </div>
    <div class=texte>
      <h3>Le projet RECO+</h3>
      <p>activité centrale de la forme de vie contemporaine, les spectateurs ont de plus en plus du mal à se retrouver dans la masse et la variété de l’offre. La production de contenu télévisé a connu des changements radicaux ces dernières années. Le nombre total d'utilisations de la vidéo en ligne en France et en Europe a été stimulé par plusieurs acteurs nationaux et internationaux, avec leurs offres de vidéo à la demande avec ou sans abonnement (SVOD / AVOD).
Cette augmentation de l’offre de séries n’a pas été accompagnée d’une amélioration des outils de sélection et de recommandation. Les fournisseurs rencontrent donc des difficultés à fidéliser les utilisateurs. Les logiciels existant reposent sur l'utilisation de métadonnées, d'informations sur le profil de l'utilisateur et de l'historique de visionnage, sans tenir compte du contenu.
En réponse à la masse croissante de données vidéo, à la diversité des offres de séries et à l’insatisfaction croissante des spectateurs par rapport aux recommandations disponibles, RECO+ vise à créer un logiciel avancé de recommandation sérielle destiné à répondre aux besoins des producteurs et des spectateurs, à travers l’analyse du contenu textuel et vidéo des séries télévisées, plutôt que sur les données de comportement des utilisateurs.
Dans ce travail, nous présentons un système de recommandation basé sur le contenu, spécialement conçu pour les contenus multimodaux longs, tels que les séries télévisées, à partir de données extraites de leurs premiers épisodes. Contrairement aux systèmes traditionnels, notre approche génère des recommandations sans s'appuyer sur les données utilisateur, améliorant ainsi la précision et la confidentialité. L'un des objectifs clés de notre système est de garantir l'interprétabilité en utilisant des caractéristiques clairement définies et compréhensibles par l'utilisateur afin d'éviter l'effet « boîte noire » fréquemment associé aux systèmes de recommandation modernes.</p>
    </div>
    <div class=texte>
      <h3>Les critères de RECO+</h3>
      <p>Notre approche fait progresser les systèmes de recommandation basés sur le contenu en introduisant divers descripteurs de contenu multimodaux, y compris des critères visuels, auditifs et textuels extraits des sous-titres, des descriptions audio et des vidéos.
Les critères, obtenus par des approches d'intelligence artificielle à l'état de l'art directement sur les images, le signal audio ou le texte transcrit.
Pour les 50 critères calculés à partir de la modalité textuelle, nous utilisons le LLM ChatGPT d'OpenAI pour évaluer la présence et la pertinence de thèmes sémantiques spécifiques, tels que la violence, la politique ou le suspense, dans les sous-titres et les audio-description. Le modèle est alimenté avec une liste de 50 thèmes prédéfinis, chacun accompagné d'une définition claire. Pour chaque entrée, il attribue un score de pertinence compris entre 0 et 1000, reflétant le degré d'expression du thème correspondant dans le texte. Cette stratégie permet au modèle d'effectuer des évaluations ciblées et interprétables, tout en minimisant le risque d'hallucinations en lui permettant d'ignorer les thèmes qu'il ne peut pas évaluer avec certitude.
      </p>
    </div>
    <div >
      <ul>
        <li>
          <h4>
            Critères visuels
            <button @click="showVisuel = !showVisuel">{{ showVisuel ? 'Masquer' : 'Afficher' }}</button>
          </h4>
          <ul v-if="showVisuel">
            <li v-for="(crit, i) in visuelCriteres" :key="i">{{ crit }}</li>
          </ul>
        </li>
        <li>
          <h4>
            Critères audio
            <button @click="showAuditif = !showAuditif">{{ showAuditif ? 'Masquer' : 'Afficher' }}</button>
          </h4>
          <ul v-if="showAuditif">
            <li v-for="(crit, i) in auditifCriteres" :key="i">{{ crit }}</li>
          </ul>
        </li>
        <li>
          <h4>
            Critères textuels
            <button @click="showTextuel = !showTextuel">{{ showTextuel ? 'Masquer' : 'Afficher' }}</button>
          </h4>
          <ul v-if="showTextuel">
            <li v-for="(crit, i) in textuelCriteres" :key="i">{{ crit }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showVisuel = ref(false)
const showAuditif = ref(false)
const showTextuel = ref(false)
// liste des critères non dynamiques (possible de les charger depuis un fichier CSV si nécessaire)
const visuelCriteres = [
  "Mean Brightness", "STD Brightness", "Min Brightness", "Max Brightness",
  "Mean Contrast", "STD Contrast", "Min Contrast", "Max Contrast",
  "Mean Saturation", "STD Saturation", "Min Saturation", "Max Saturation",
  "Heat", "Scene/Seconds", "Plans tres rapide", "Plans courts", "Plans moyens",
  "Plans longs", "Plans tres longs", "Optical Flow Max", "Optical Flow Score", "Optical Flow STD"
]

const auditifCriteres = [
  "NoEnergy", "Music", "Noise", "Voice", "F/H"
]

const textuelCriteres = [
  "Action elements", "Animals", "Brutal realism", "Character development", "Collective struggles",
  "Cultural references", "Cute", "Dark", "Dark humor", "Deception", "Disabilities", "Diversity",
  "Diversity of locations", "Environmental issues", "Everyday life", "Feel good", "Female characters",
  "Food", "Found families theme", "Graphic nature", "Historical restitution accuracy", "Humor",
  "Investigation", "Language diversity", "Language level", "Multigenerational", "Multiple characters",
  "Nostalgia factor", "Originality of the plot", "Personal emancipation trajectories", "Plot complexity",
  "Politics", "Presence of music", "Religion", "Romantic elements", "Rurality", "Satire",
  "Security issues", "Sexual violence", "Shakespearean human issues", "Space", "Suspense",
  "Themes of good and evil", "Thought-provoking series", "Travel", "Urban atmosphere", "Violence",
  "Vulgar dialogues", "Wilderness", "Wokeness"
]
</script>

<style>
div.texte {
  background-color: #d5e6f6;
  margin: 2em auto;
  padding: 2em 2.5em;
  max-width: 900px;
  font-size: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  line-height: 1.7;
  letter-spacing: 0.01em;
}

div.texte h3 {
  text-align: left;
  font-variant: small-caps;
  margin-bottom: 0.7em;
  text-decoration: underline;
  font-size: 1.5em;
  color: #d5e6f6;
}

div.texte p {
  margin-bottom: 1.2em;
  margin-top: 0.5em;
  text-align: justify;
}

h2 {
  text-align: center;
  margin-top: 2em;
  margin-bottom: 1.5em;
  font-size: 2.2em;
  letter-spacing: 0.04em;
  color: #2d2d0d;
}

/* Mode sombre */
html.dark div.texte {
  background-color: #333;
  color: #f3f3e0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.25);
}

html.dark div.texte h3,
html.dark h2 {
  color: #ffe066;
}

div.content ul ul {
  margin-left: 2em;
  background: #f9f9e0;
  border-radius: 8px;
  padding: 0.5em 1em;
}

html.dark div.content ul ul {
  background: #444;
}
.container {
  background: #f0f9ff;
  width: 100%;
  padding: 25px 40px 10px 40px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}
.dark .container {
  background: #181c23;
}
</style>
