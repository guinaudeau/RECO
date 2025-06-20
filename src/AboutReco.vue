<template>
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
    

</template>
<script setup>

</script>
<style>
    div.texte{
        background-color:rgb(255, 255, 191);
        margin: 1em;
        margin-left: 3em;
        margin-right: 3em;
        font-size: 20px;
    }
    div.texte h3{
        text-align: left;
        font-variant: small-caps;
        margin-left: 3em;
        text-decoration: underline;
    }
    html.dark div.texte{
        background-color: #333;
    }
    p.about {
  animation-duration: 3s;
  animation-name: slidein;
}

@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
</style>