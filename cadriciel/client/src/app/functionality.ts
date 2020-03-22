// tslint:disable:max-lines max-line-length
/*
We disabled these rules because functionality.ts contains multiple arrays with our functionalities. Each object contains a
description (which can be long) displayed in the user manual.
*/
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
        shortDescription:
            "Cette option vous permet d'ouvrir un nouvel espace de dessin selon la taille et la couleur de fond de votre choix.",
        description:
            "La largeur et la hauteur sont en pixel et sont automatiquement générés selon la taille de votre fenêtre. Pour la couleur, la couleur blanche est par défaut, mais celle-ci peut être changé par n'importe quelle autre couleur notée en hexadécimal ou avec nos couleurs prédéfinies.",
        icon: 'add_circle',
    },
    {
        name: 'Ouvrir la galerie de dessins',
        shortcutName: 'Ouvrir',
        shortDescription:
            `Cette option vous permez de visualiser tous les dessins que vous avez sauvegardé sur le serveur de polydessin, comme elle vous dnne la possibilité de continuer un dessin sauvegardé en appuyant sur la flèche qui se trouve sous chaque dessin.
            Aussi, vous pouvez supprimer un dessin sauvegardé sur la base de donnée.`,
        description: `Pour ouvrir la fenêtre d'exportation, vous pouvez appuyer appuyer sur l'icône appropriée de la barre des options,
        comme vous pouvez l'ouvrir en faisant la touche 'ctrl+G' de votre clavier`,
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
        shortDescription: 'Cette option vous laisse continuer votre dernier dessin sauvegardé automatiquement.',
        description: 'Disponible sous peu!',
        icon: 'arrow_forward',
    },
    {
        name: 'Exporter un dessin',
        shortcutName: 'Exporter',
        shortDescription: `Permet dexporter un dessin localement selon 3 différents formats: SVG, PNG ou JPG.
         Aussi, elle vous permet d'appliquer des filtres sur le dessin que vous voulez exporter.`,
        description: `Pour ouvrir la fenêtre d'exportation, vous pouvez appuyer appuyer sur l'icône appropriée de la barre des options,
        comme vous pouvez l'ouvrir en faisant la touche 'ctrl+E' de votre clavier`,
        icon: 'save',
    },
];

export const toolsItems = [
    {
        name: 'Sélectionner',
        shortcutName: 'Sélectionner',
        shortDescription:
            "Grâce à cet outil, il vous est possible de sélectionner un objet sur l'espace de dessin et de le modifier. En effet, il vous est possible de le déplacer, de le pivoter ou même de l'agrandir ou le rétrécir.",
        description: `Pour choisir cette option, vous pouvez sélectionner l'outil via la barre des outils en appuyant sur l'icône approprié,
        comme vous pouvez l'utiliser en appuyant sur la touche 'S' de votre clavier.`,
        icon: 'cursor',
    },
    {
        name: 'Crayon',
        shortcutName: 'Crayon',
        shortDescription: 'Le crayon vous permet de dessiner un trait à l’écran.',
        description:
            'Après sa sélection, Il vous suffit de maintenir le clic gauche en vous déplaçant dans n’importe quelle direction dans l’aire de dessin.',
        icon: 'pencil',
    },
    {
        name: 'Pinceau',
        shortcutName: 'Pinceau',
        shortDescription: 'Le pinceau vous permet de tracer comme un crayon, mais avec une texture différente.',
        description: 'Il vous est possible de modifier l’épaisseur et la texture du trait dans son panneau de configuration.',
        icon: 'brush',
    },
    {
        name: 'Plume',
        shortcutName: 'Plume',
        shortDescription:
            'La plume vous permet de tracer avec une texture similaire au crayon, mais avec une largeur variable par rapport à l’angle d’application.',
        description: 'Disponible sous peu!',
        icon: 'calligraphie',
    },
    {
        name: 'Aérosol',
        shortcutName: 'Aérosol',
        shortDescription:
            'Cet outil vous permet de simuler un jet de peinture en aérosol en appuyant sur le clic gauche de la souris. En effet, plusieurs points de couleurs apparaissent lors du clic et le nombre de points augmentent si l’on maintient la touche.',
        description: `Pour  utiliser l'aérosol, vous pouvez sélectionner l'outil en appuyant sur l'icône appropriée via la barre des outils,
        comme vous pouvez la sélectionner en appuyant sur la touche 'A' de votre clavier.`,
        icon: 'spray',
    },
    {
        name: 'Efface',
        shortcutName: 'Efface',
        shortDescription: 'L’efface supprimera tout objet auquel il sera en contact lors du clic de souris.',
        description: `Pour choisir cette option, vous pouvez sélectionner l'outil via la barre des outils en appuyant sur l'icône approprié,
        comme vous pouvez l'utiliser en appuyant sur la touche 'E' de votre clavier.`,
        icon: 'eraser',
    },
    {
        name: 'Ligne',
        shortcutName: 'Ligne',
        shortDescription:
            'Cet outil vous permet de créer des lignes droites. Il suffit de cliquer à un endroit sur le canvas, puis de cliquer à un autre endroit ensuite pour voir apparaître une ligne droite entre ces deux points. En cliquant de nouveau, une ligne se créera entre les deux derniers points et ainsi de suite.',
        description:
            'Pour forcer des angles précis, la touche shift peut être appuyé afin de créer des lignes ayant des angles faisant des bonds de 45 degrés ; soit des angles de 0, 45, 90, 135, etc. De plus, si la touche retour arrière (Backspace) est appuyé, le dernier point sera supprimé. Aussi, la touche d’espacement (Escape) vous permet de supprimer la dernière ligne créée.',
        icon: 'line',
    },
    {
        name: 'Rectangle',
        shortcutName: 'Rectangle',
        shortDescription:
            'En faisant un clic gauche, vous définissez un premier coin du rectangle. En vous déplaçant, un aperçu de la taille du rectangle est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. De plus, en maintenant la touche Shift, il vous est possible d’uniformiser les côtés de votre rectangle afin de créer un carré.',
        description: 'Le type de tracé et l’épaisseur du trait de contour sont configurable dans le panneau d’attribut.',
        icon: 'rectangle',
    },
    {
        name: 'Ellipse',
        shortcutName: 'Ellipse',
        shortDescription:
            'En faisant un clic gauche, vous définissez un premier coin de l’ellipse. En vous déplaçant, un aperçu de sa taille est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. De plus, en maintenant la touche Shift, il vous est possible d’uniformiser le rayon de l’ellipse afin de créer un cercle.',
        description: `Vous pouvez configurer les attributs de l'éllipse, comme le type de tracé et l'épaisseur du contour, via le panneau des attributs.
        Pour utiliser l'éllipse vous pouvovez le sélctionner en appuyant sur l'icône appropriée de la barre des outils
        comme vous pouvez l'utiliser en appuyant sur la touche 2 de votre clavier.`,
        icon: 'ellipse',
    },
    {
        name: 'Polygone',
        shortcutName: 'Polygone',
        shortDescription:
            'En faisant un clic gauche, vous définissez un premier coin du polygone. En vous déplaçant, un aperçu de sa taille est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. Les polygones créés sont toujours réguliers et convexe.',
        description: `Vous pouvez configurer les attributs de polygone, comme le nombre de côté et l'épaisseur du contour, via le panneau des attributs.
        Pour utiliser le polygone vous pouvovez le sélctionner en appuyant sur l'icône appropriée de la barre des outils
        comme vous pouvez l'utiliser en appuyant sur la touche 3 de votre clavier.`,
        icon: 'hexagon',
    },
    {
        name: 'Pipette',
        shortcutName: 'Pipette',
        shortDescription:
            'La pipette est utilisé afin de retrouver facilement une couleur ayant déjà été utilisé dans le dessin. Effectivement, en sélectionnant une couleur sur le canvas, celle-ci remplacera la couleur que vous utilisez présentement.',
        description: `Vous pouvez utiliser cette outils en sélectionnant l'icône approprié de la barre des outils
        ou en appuyant sur la touche 'I' de votre clavier.`,
        icon: 'pipette',
    },

    {
        name: 'Texte',
        shortcutName: 'Texte',
        shortDescription: 'Disponible sous peu!',
        description: ' ',
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: 'text',
    },

    {
        name: 'Étampe',
        shortcutName: 'Étampe',
        shortDescription: 'Disponible sous peu!',
        description: ' ',
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
        title="Flaticon"> www.flaticon.com</a>*/
        icon: 'stamp',
    },
    {
        name: 'Applicateur de couleur',
        shortcutName: 'App. de couleur',
        shortDescription:
            `Cette outil vous permet de changer la couleur secondaire et primaire d'un objet déjà créé,
             Pour changer la couleur primaire en faisant un clique gauche de votre souris.
             Par contre, si vous voulez changer la couleur secondaire c'est en faisant un clique droit de votre souris.`,
        description:
            `Vous pouvez utiliser cette outil via la barre des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'R' de votre clavier.`,
        icon: 'waterDrop',
    },
    {
        name: 'Annuler',
        shortcutName: 'Annuler',
        shortDescription: 'Cette fonctionnalité vous permet de revenir en arrière sur une action que vous avez fait.',
        description: `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
        ou en faisant la touche 'ctrl+Z' de votre clavier.`,
        icon: 'undo',
    },
    {
        name: 'Refaire',
        shortcutName: 'Refaire',
        shortDescription:
            `Cette fonctionnalité vous permet de refaire une action que vous avez précédemment annuler.
             Par contre, aucune action annulée ne peut être refaite si vous avez fait une autre action sauf refaire après l'annulation.`,
        description:
            `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'ctrl+shift+z' de votre clavier.`,
        icon: 'redo',
    },
];
