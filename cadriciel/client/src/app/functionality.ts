export const welcomeItem = [
    {
        name: 'Bienvenue',
        shortcutName: 'Bienvenue',
        shortDescription: 'Bienvenue sur Polydessin!',
        description:
            "Apprenez à utiliser notre application web en parcourant notre guide d'utilisation! Pour rechercher de l'information sur une fonctionnalité en particulier, vous pouvez utiliser notre barre de défilement à gauche. Sinon, le bouton au bas de la page vous amènera à la page suivante du guide.",
        icon: 'nothing',
    },
];

export const menuItems = [
    {
        name: 'Créer un nouveau dessin',
        shortcutName: 'Créer',
        shortDescription: "Cette option vous permet d'ouvrir un nouvel espace de dessin selon la taille et la couleur de fond de votre choix.",
        description:
            "La largeur et la hauteur sont en pixel et sont automatiquement générés selon la taille de votre fenêtre. Pour la couleur, la couleur blanche est par défaut, mais celle-ci peut être changé par n'importe quelle autre couleur notée en hexadécimal ou avec nos couleurs prédéfinies.",
        icon: 'add_circle',
    },
    {
        name: 'Ouvrir la galerie de dessins',
        shortcutName: 'Ouvrir',
        shortDescription: "Vous pouvez choisir d'ouvrir la galerie en tout temps lors de l'utilisation de l'application en choisissant l'icone de la galerie ou en appuyant sur ctrl+G sur votre clavier.",
        description: " Cette option vous laisse visualiser votre dernier dessin enregistré sur le serveur. Aussi, elle vous donne l'option de supprimer des images du serveur en appuyant sur l'icone de la poubelle qui se trouve dans la carte du dessin que vous voulez supprimer. Aussi, elle vous donne la possibilité de modifier un dessin qui se trouve sur le serveur en appuyant sur l'icone de la flèhe qui se trouve dans la carte du dessin que vous voulez continuer",
        icon: 'camera',
    },
    {
        name: "Afficher le guide d'utilisation",
        shortcutName: 'Guide',
        shortDescription: "Le guide d'utilisation vous aide à utiliser et mieux comprendre notre application web!",
        description:
            "Celui-ci s'ouvre en fenêtre modale et s'ouvre facilement par dessus le menu ou votre dessin sans perdre votre progrès! N'ayez donc aucune crainte à l'utiliser aussitôt que vous voulez des renseignements sur une de nos fonctionnalités!",
        icon: 'menu_book',
    },
    {
        name: 'Continuer un dessin',
        shortcutName: 'Continuer',
        shortDescription: 'Cette option vous laisse visualiser votre dernier dessin enregistré sur le serveur.',
        description: 'Disponible sous ',
        icon: 'arrow_forward',
    },
    {
        name: 'Exporter un dessin',
        shortcutName: 'Exporter',
        shortDescription: 'Permet dexporter un dessin localement selon 3 différents formats: SVG, PNG ou JPG.',
        description: "Cette option vous donne la possibilité de sauvegarder le dessin que vous avez créer à l'aide de notre application sur votre ordinateur local. Vous avez la possibilité de choisir un filtre parmi cinq filtres existant. Pour sauvegarder un dessin vous devez chosir le format sous lequel vous voulez télécharger votre dessin, ainsi de cheoisir un nom à votre dessin.",
        icon: 'save',
    },
];

export const toolsItems = [
    {
        name: 'Sélectionner',
        shortcutName: 'Sélectionner',
        shortDescription:
            "Grâce à cet outil, il vous est possible de sélectionner un objet sur l'espace de dessin et de le modifier. En effet, il vous est possible de le déplacer, de le pivoter ou même de l'agrandir ou le rétrécir.",
        description: "Pour faire une sélection d'un objet qui se trouve sur la surface de dessin vous pouvez sélectionner l'icone de la sélection ou appuyer sur la touche s en utilisant votre clavier. L'outil de sélection vous permet de sélectionner tous les objets existantes sur la vue de dessin en faisant ctrl+A",
        icon: 'cursor',
    },
    {
        name: 'Crayon',
        shortcutName: 'Crayon',
        shortDescription: 'Le crayon vous permet de dessiner un trait à l’écran.',
        description:
            "Après sa sélection, Il vous suffit de maintenir le clic gauche en vous déplaçant dans n’importe quelle direction dans l’aire de dessin. Pour séectionner un crayon, vous pouvez soit choisir l'icone de crayon de la barre des outils ou appuyer sur la clé c de votre clavier",
        icon: 'pencil',
    },
    {
        name: 'Pinceau',
        shortcutName: 'Pinceau',
        shortDescription: 'Le pinceau vous permet de tracer comme un crayon, mais avec une texture différente.',
        description: "Il vous est possible de modifier l’épaisseur et la texture du trait dans son panneau de configuration. Pour utiliser le pinceau, vous pouvez soit appuyez sur l'icone du pinceau ou appuyer sur la touche w de votre clavier. Vous pouvez chosir la texture que vous voulez appliquer, ainsi que de définir l'épaisseur du tracé",
        icon: 'brush',
    },
    {
        name: 'Plume',
        shortcutName: 'Plume',
        shortDescription:
            "La plume vous permet de tracer avec une texture similaire au crayon, mais avec une largeur variable par rapport à l’angle d’application.",
        description: "Disponible sous peu!",
        icon: 'calligraphie',
    },
    {
        name: 'Aérosol',
        shortcutName: 'Aérosol',
        shortDescription:
            "Cet outil vous permet de simuler un jet de peinture en aérosol en appuyant sur le clic gauche de la souris. En effet, plusieurs points de couleurs apparaissent lors du clic et le nombre de points augmentent si l’on maintient la touche.",
        description: "Vous pouvez configurer le nombre d'émission du jet par seconde comme vous pouvez configurer le diamètre du jet via le panneau des attributs. Pour choisir l'Aérosol vous pouvez choisir l'icone via la barre des outils comme vous pouvez faire la touche A à partir de votre clavier.",
        icon: 'spray',
    },
    {
        name: 'Efface',
        shortcutName: 'Efface',
        shortDescription: "L’efface supprimera tout objet auquel il sera en contact lors du clic de souris.",
        description: "Vous pouvez configurer la taille de l'efface à travers le panneau des attributs. Aussi, vous pouvez choisir l'efface via la barre des outils comme vous pouvez la chosir en faisant la touche E de votre clavier",
        icon: 'eraser',
    },
    {
        name: 'Ligne',
        shortcutName: 'Ligne',
        shortDescription:
            "Cet outil vous permet de créer des lignes droites. Il suffit de cliquer à un endroit sur le canvas, puis de cliquer à un autre endroit ensuite pour voir apparaître une ligne droite entre ces deux points. En cliquant de nouveau, une ligne se créera entre les deux derniers points et ainsi de suite. Pour finir une ligne, vous devez faire un double click avec la sourris",
        description:
            "Pour forcer des angles précis, la touche shift peut être appuyé afin de créer des lignes ayant des angles faisant des bonds de 45 degrés ; soit des angles de 0, 45, 90, 135, etc. De plus, si la touche retour arrière (Backspace) est appuyé, le dernier point sera supprimé. Aussi, la touche d’espacement (Escape) vous permet de supprimer la dernière ligne créée. Pour choisir l'outil ligne, vous pouvez chosir l'icone de la ligne de la barre de sélection ou apuiyez sur la touche l de votre clavier",
        icon: 'line',
    },
    {
        name: 'Rectangle',
        shortcutName: 'Rectangle',
        shortDescription:
            "En faisant un clic gauche, vous définissez un premier coin du rectangle. En vous déplaçant, un aperçu de la taille du rectangle est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. De plus, en maintenant la touche Shift, il vous est possible d’uniformiser les côtés de votre rectangle afin de créer un carré.",
        description: "Le type de tracé et l’épaisseur du trait de contour sont configurables dans le panneau d’attribut. Pour chosir d'utiliser l'outil rectangle, vous pouvez chosir le rectangle via la barre des outils ou appuyez sur la touche 1 de votre clavier",
        icon: 'rectangle',
    },
    {
        name: 'Ellipse',
        shortcutName: 'Ellipse',
        shortDescription:
            "En faisant un clic gauche, vous définissez un premier coin de l’ellipse. En vous déplaçant, un aperçu de sa taille est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. De plus, en maintenant la touche Shift, il vous est possible d’uniformiser le rayon de l’ellipse afin de créer un cercle.",
        description: "Le type de tracé et l’épaisseur du trait de contour sont configurables dans le panneau d’attribut. Pour chosir d'utiliser l'outil ellipse, vous pouvez chosir l'ellipse via la barre des outils ou appuyez sur la touche 2 de votre clavier",
        icon: 'ellipse',
    },
    {
        name: 'Polygone',
        shortcutName: 'Polygone',
        shortDescription:
            "En faisant un clic gauche, vous définissez un premier coin du polygone. En vous déplaçant, un aperçu de sa taille est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. Les polygones créés sont toujours réguliers et convexe.",
        description: "Le type de tracé ,l’épaisseur du trait de contour et le nombre de côté du polygonne sont configurables dans le panneau d’attribut. Pour chosir d'utiliser l'outil polygonne, vous pouvez chosir le hexagone via la barre des outils ou appuyez sur la touche 3 de votre clavier",
        icon: 'hexagon',
    },
    {
        name: 'Pipette',
        shortcutName: "Pipette",
        shortDescription:
            "La pipette est utilisé afin de retrouver facilement une couleur ayant déjà été utilisé dans le dessin. Effectivement, en sélectionnant une couleur sur le canvas, celle-ci remplacera la couleur que vous utilisez présentement.",
        description: "Pour changer la couleur principale en utilsant la pipette vous devez faire un clic gauche avec votre souris et pour changer la couleur secondaire c'est à travers le clic droit de votre souris. Pour utiliser l'outils pipette, vous pouvez choisir l'icone de la pipette via la barre des outils comme vous pouvez la choisir en appuyant sur la touche I de votre clavier",
        icon: 'pipette',
    },

    {
        name: 'Texte',
        shortcutName: 'Texte',
        shortDescription: "Disponible sous peu!",
        description: ' ',
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: 'text',
    },

    {
        name: 'Étampe',
        shortcutName: 'Étampe',
        shortDescription: "Disponible sous peu!",
        description: ' ',
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
        title="Flaticon"> www.flaticon.com</a>*/
        icon: 'stamp',
    },
    {
        name: 'Sélection de couleur',
        shortcutName: 'Couleur',
        shortDescription:
            "Cet outil vous permet de choisir une couleur primaire et une couleur secondaire qui se transmet pour chaque outil dessin de l’application.",
        description:
            "L’outil de sélection des couleurs est séparé en trois parties. La première partie est la plus haute et vous permet de sélectionner la couleur souhaitée via une interface visuelle. L’anneau sert à choisir une teinte et le rectangle vous permet de choisir la clarté de la couleur. Pour sélectionner une couleur primaire, il vous suffit de faire un clic gauche sur la teinte souhaitée dans l’anneau ou le rectangle. Un clic droit sélectionne la couleur secondaire. La couleur primaire sélectionnée se retrouve en bas à gauche de l’anneau et du côté droit se trouve la couleur secondaire. Le bouton péremuter inverse les couleurs primaires et secondaires. En bas de l’interface visuelle de sélection des teintes se trouve la deuxième partie de l’outil et vous permet de configurer manuellement votre couleur selon un code RGB hexadécimal. La saturation, la luminosité et la transparence sont aussi configurable. La troisième et dernière partie constitue les dix petits rectangle tout au bas de l’outil de couleur et vous permet de sélectionner une couleur précédemment choisie. Aussi, vous pouvez chosir un des dix derniers couleurs utilisées récemment en appuyant sur une couleur de l'historique des couleurs",
        icon: 'color',
    },
    {
        name: 'Applicateur de couleur',
        shortcutName: 'Sceau',
        shortDescription:
            "Cet outil vous permet de changer la couleur d'un objet déjà existant sur la surface de dessin . En effet, vous pouvez appliquer la couleur principale à l'intérieur de l'objet et appliquer la couleur secondaire si l'objet possède un contour",
        description:
            "Pour choisir l'applicateur de couleur vous pouvez choisir le sceau via la barre des outils comme vous pouvez l'utiliser en appuyant sur la touche R de votre clavier",
        icon: 'paint-bucket',
    },
    {
        name: 'Annuler',
        shortcutName: 'Annuler',
        shortDescription:
            "Cet ouil vous permet de revenir en arrière sur vos actions, si vous avez fait une action que vous ne voulez pas sur la surface de dessin.",
        description:
            "Pour choisir d'annuler un de vos actions que vous avez fait vous pouvez chosir le boutton annuler via la barre des outils, comme vous pouvez appuyez sur la touche ctrl+z pour annuler une action.",
        icon: 'undo',
    },
    {
        name: 'Refaire',
        shortcutName: 'Refaire',
        shortDescription:
            "Cet outil vous permet de refaire une action que vous avez annuler auparavant. Notez que vous ne pouvez pas refaire une action si vous avez fait ajouter un autre objet ou appliquer une modification à un objet sur la surface de dessin après avoir annuler une action.",
        description:
            "Pour choisir de refaire une action, vous pouvez choisir le boutton refaire via la barre des outils comme vous pouvez appuyer sur la touche ctrl+shift+z de votre clavier.",
        icon: 'redo',
    },
];
