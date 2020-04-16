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
            `La largeur et la hauteur du dessin sont
            automatiquement générés selon les dimensions de la fenêtre de votre navigateur.
            Par défaut, la couleur du nouveau dessin sera blanche, mais il est possible de la redéfinir avec une nouvelle valeur hexadécimale ou encore avec l’outil de sélection de couleur situé sur le formulaire. Il est possible d’ouvrir le formulaire via le raccourci 'ctrl+O'. Notez que si le dessin en cours n’a pas été sauvegardé sur la gallerie, celui-ci sera écrasé.`,
        icon: 'add_circle',
    },
    {
        name: 'Ouvrir la galerie de dessins',
        shortcutName: 'Ouvrir',
        shortDescription:
            `Cette option vous permet de visualiser tous les dessins que vous avez sauvegardé sur le serveur de PolyDessin, comme elle vous donne la possibilité de continuer un dessin sauvegardé en appuyant sur la flèche qui se trouve sous chaque dessin.
            Aussi, vous pouvez supprimer un dessin sauvegardé sur la base de données ou encore rechercher l'un d'entres eux à l'aide d'étiquettes.`,
        description: `Pour ouvrir la fenêtre d'exportation, vous pouvez appuyer sur l'icône approprié de la barre d'options,
        comme vous pouvez l'ouvrir en faisant la touche 'ctrl+G' de votre clavier. Si des dessins précédemment sauvegardés sont présents sur le serveur, ils seront automatiquement affichés sous forme
        de fenêtre de prévisualisation en vous laissant le choix de supprimer ou de continuer celui-ci. Cette dernière option écrasera le dessin courant dans le cas où il n'a pas été sauvegardé au préalable.
        Enfin, il est possible de rechercher un dessin à l'aide d'étiquettes via la barre de filtrage située au haut de la gallerie.`,
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
        description: `
        Cette option vous permet de continuer le tout dernier dessin effectué avec PolyDessin et ce, même si vous fermez l'application et le navigateur!
        L'application sauvegardera automatiquement le dessin en cours au fur et à mesure que vous dessinez; aucune action n'est donc requise de votre part.
        L'option est disponible au point d'entrée de l'application, et le bouton ne sera disponible que s'il existe un dessin pouvant être continué. Une fois choisi,
        l'application chargera automatiquement le dessin sur la planche.`,
        icon: 'arrow_forward',
    },
    {
        name: 'Exporter un dessin',
        shortcutName: 'Exporter',
        shortDescription: `Permet d'exporter un dessin localement selon 3 différents formats: SVG, PNG ou JPG.
         Aussi, elle vous permet d'appliquer un choix parmi 5 filtres sur le dessin que vous voulez exporter. De plus, cette fonctionnalité vous donne la possibilité d'envoyer
         un dessin par courriel en entrant l'adresse courriel de la personne récipiendaire.`,
        description: `Pour ouvrir la fenêtre d'exportation, vous pouvez appuyer sur l'icône appropriée de la barre des options,
        comme vous pouvez l'ouvrir en faisant la touche 'ctrl+E' de votre clavier. Vous verrez ensuite une fenêtre de prévisualisation du dessin en question,
        avec des options permettant d'entrer le nom du dessin, le format d'exportation de même que 5 filtres optionnels. Une fois le bouton pressé, l'application
        lancera un téléchargement local du dessin, à moins que vous aviez choisi un envoi par courriel. Le cas échéant, le dessin ira au destinaraire entré!`,
        icon: 'cloud_download',
    },
    {
        name: 'Sauvegarder dessin',
        shortcutName: 'Sauvegarde',
        shortDescription: `Permet de sauvegarder un dessin sur la base de données de l'application. Lors de la sauvegarde, vous devez entrer un nom non vide
        à votre dessin, comme vous pouvez y mettre des étiquettes permettant d'identifier plus facilement votre dessin.`,
        description: `Pour ouvrir la fenêtre de sauvegarde, vous pouvez appuyer appuyer sur l'icône appropriée de la barre des options,
        comme vous pouvez l'ouvrir en faisant la touche 'ctrl+S' de votre clavier. Une fois le formulaire de sauvegarde ouvert, vous serez invité à rentrer un nom pour le dessin
        et, en option, des étiquettes qui vous permettront de retrouver le dessin en question sur la gallerie via l'option de filtrage.`,
        icon: 'save',
    },
    {
        name: 'Grille',
        shortcutName: 'Grille',
        shortDescription: '',
        description: '',
        icon: 'grid_on'
    }
];

export const toolsItems = [
    {
        name: 'Sélectionner',
        shortcutName: 'Sélectionner',
        shortDescription:
            "Grâce à cet outil, il vous est possible de sélectionner un objet sur l'espace de dessin et de le modifier. En effet, il vous est possible de le déplacer et de le pivoter.",
        description: `Pour choisir cette option, vous pouvez sélectionner l'outil via la barre des outils en appuyant sur l'icône approprié,
        comme vous pouvez l'utiliser en appuyant sur la touche 'S' de votre clavier. Avec l'outil en main, vous pouvez cliquer sur un seul objet sur la planche à dessin
        ou encore en sélectionner plusieurs en effectuant un clic gauche et en faisant glisser la souris pour utiliser le rectangle de sélection, puis en relâchant le bouton de la souris pour sélectionner les items. À l'inverse,
        un clic droit avec cette option crée un rectangle de sélection qui applique un traitement inverse. Il vous sera alors possible de déselectionner les objets déjà sélectionnés ou de sélectionner ceux ne l'étant pas.
        Une fois la sélection complétée, une boîte englobant tous les objets pris en compte apparaîtra. Il sera ensuite possible de déplacer cette sélection avec les flèches du clavier ou avec la souris et de faire tourner cette sélection.
        Si la touche 'shift' est pressée, chaque objet tournera autour de son propre centre.
        Enfin, appuyer sur 'ctrl+A' sélectionnera tous les objets`,
        icon: 'cursor',
    },
    {
        name: 'Crayon',
        shortcutName: 'Crayon',
        shortDescription: 'Le crayon vous permet de dessiner un trait simple sur la planche à dessin.',
        description:
            `Après sa sélection, Il vous suffit de maintenir le clic gauche en vous déplaçant dans n’importe quelle
            direction dans l’aire de dessin. Un trait simple de la couleur et grandeur choisies apparaîtra. Vous pouvez sélectionner le crayon
            via l'icône appropriée dans la boîte à outils ou encore en pressant sur la touche 'C'.`,
        icon: 'pencil',
    },
    {
        name: 'Pinceau',
        shortcutName: 'Pinceau',
        shortDescription: 'Le pinceau vous permet de tracer comme un crayon, mais avec une texture différente.',
        description: `Le pinceau permet, tout comme le crayon, de dessiner un trait à l'écran mais en offrant un choix de 5 textures différentes.
        Étant disponible via la boîte à outils, il est possible de le sélectionner avec la touche 'B' du clavier.`,
        icon: 'brush',
    },
    {
        name: 'Aérosol',
        shortcutName: 'Aérosol',
        shortDescription:
            'Cet outil vous permet de simuler un jet de peinture en aérosol en appuyant sur le clic gauche de la souris. En effet, plusieurs points de couleurs apparaissent lors du clic et le nombre de points augmente si l’on maintient le clic.',
        description: `Pour  utiliser l'aérosol, vous pouvez sélectionner l'outil en appuyant sur l'icône appropriée via la barre des outils,
        comme vous pouvez la sélectionner en appuyant sur la touche 'A' de votre clavier, et ensuite spécifier l'intensité et le diamètre du jet.`,
        icon: 'spray',
    },
    {
        name: 'Efface',
        shortcutName: 'Efface',
        shortDescription: 'L’efface supprimera tout objet auquel il sera en contact lors du clic de souris.',
        description: `Pour choisir cette option, vous pouvez sélectionner l'outil via la barre des outils en appuyant sur l'icône approprié,
        comme vous pouvez l'utiliser en appuyant sur la touche 'E' de votre clavier. Les objets entrant en contact avec l'efface se verront dotés d'un contour rouge.`,
        icon: 'eraser',
    },
    {
        name: 'Ligne',
        shortcutName: 'Ligne',
        shortDescription:
            'Cet outil vous permet de créer des lignes droites. Il suffit de cliquer à un endroit sur le canevas, puis de cliquer à un autre endroit ensuite pour voir apparaître une ligne droite entre ces deux points. En cliquant de nouveau, une ligne se créera entre les deux derniers points et ainsi de suite.',
        description:
            `L'outil est sélectionnable entres autres via la touche 'L' du clavier. Pour forcer des angles précis, la touche shift peut être appuyée afin de créer des lignes ayant des angles
            faisant des bonds de 45 degrés ; soit des angles de 0, 45, 90, 135, etc. De plus, si la touche retour arrière (Backspace) est appuyé,
            le dernier point sera supprimé. Aussi, la touche d’échappement (Escape) vous permet de supprimer la dernière ligne créée. Enfin, il est possible
            de doter la ligne de points de jonction de diamètre modifiable.`,
        icon: 'line',
    },
    {
        name: 'Rectangle',
        shortcutName: 'Rectangle',
        shortDescription:
            'En faisant un clic gauche, vous définissez un premier coin du rectangle. En vous déplaçant, un aperçu de la taille du rectangle est disponible et vous pouvez confirmer la création de l’objet en relâchant le clic de souris. De plus, en maintenant la touche Shift, il vous est possible d’uniformiser les côtés de votre rectangle afin de créer un carré.',
        description: `Le type de tracé et l’épaisseur du trait de contour sont configurable dans le panneau d’attribut. La touche '1' du clavier permet de sélectionner
        l'outil. `,
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
        ou en appuyant sur la touche 'I' de votre clavier. Une fenêtre de prévisualisation de la couleur sous le curseur apparaîtra. Un clic gauche modifiera la couleur primaire de l'outil de couleur,
        tandis qu'un clic droit changera la couleur secondaire.`,
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
        name: 'Applicateur de couleur',
        shortcutName: 'App. de couleur',
        shortDescription:
            `Cette outil vous permet de changer la couleur secondaire et primaire d'un objet déjà créé.
             Pour changer la couleur primaire, effectuez un clic gauche avec votre souris.
             Le changement de couleur secondaire, quant à lui, s'effectue avec un clic droit.`,
        description:
            `Vous pouvez utiliser cette outil via la barre des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'R' de votre clavier. Lorsque l'outil est activé, un curseur apparaîtra, ayant en son centre la couleur
            primaire et, comme contour, la couleur secondaire déterminés par l'outil de couleur.`,
        icon: 'waterDrop',
    },
    {
        name: 'Sceau de peinture',
        shortcutName: 'Sceau',
        shortDescription:
            `Cette outil vous permet de remplir une région de la surface de dessin de la couleur principale,
             vous pouvez configurer l'attribut du sceau de peinture via le panneau latéral.`,
        description:
            `Vous pouvez utiliser cette outil via la barre des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'B' de votre clavier. Il est possible de modifier un attribut de tolérance du remplissage,
            qui s'exprime par l'écart entre la couleur sous le curseur et celle des pixels contigus. Une fois le remplissage complété, l'objet
            vectoriel en résultant sera manipulable et modifiable.`,
        icon: 'paint-bucket',
    },
    {
        name: 'Annuler',
        shortcutName: 'Annuler',
        shortDescription: 'Cette fonctionnalité vous permet de revenir en arrière sur une action que vous avez fait.',
        description: `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
        ou en faisant la touche 'ctrl+Z' de votre clavier. S'il n'est pas possible d'effectuer l'action, le bouton apparaîtra comme inactif.`,
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
            ou en appuyant sur la touche 'ctrl+shift+z' de votre clavier. S'il n'est pas possible d'effectuer l'action, le bouton apparaîtra comme inactif.`,
        icon: 'redo',
    },
    {
        name: 'Copier',
        shortcutName: 'Copier',
        shortDescription:
            'Cette fonctionnalité vous permet de copier une sélection.',
        description:
            `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'ctrl+C' de votre clavier. Elle vous permettra ensuite de coller ou dupliquer l'item. Afin d'utiliser cette action,
            l'outil de sélection doit être actif au préalable et une sélection, présente.`,
        icon: 'copy',
    },
    {
        name: 'Couper',
        shortcutName: 'Couper',
        shortDescription:
            'Cette fonctionnalité vous permet de couper une sélection pour la placer ailleurs sur la surface de dessin.',
        description:
            `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'ctrl+X' de votre clavier. Un item ou des items coupés ne seront plus visibles à ce moment, mais pourront
            être mis ailleurs sur la survace de dessin à l'aide de l'option 'Coller'. Pour utiliser cette fonctionnalité, une sélection doit être présente et l'outil, activé.`,
        icon: 'cut',
    },
    {
        name: 'Coller',
        shortcutName: 'Coller',
        shortDescription:
            'Cette fonctionnalité vous permet de coller un objet qui a été copié ou coupé auparavant.',
        description:
            `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'ctrl+V' de votre clavier.`,
        icon: 'paste',
    },
    {
        name: 'Supprimer',
        shortcutName: 'Supprimer',
        shortDescription:
            'Cette fonctionnalité vous permet de supprimer une sélection de la surface de dessin.',
        description:
            `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'DELETE' de votre clavier. Pour ce faire, une sélection doit être existante.`,
        icon: 'delete',
    },
    {
        name: 'Dupliquer',
        shortcutName: 'Dupliquer',
        shortDescription:
            'Cette fonctionnalité vous permet de dupliquer une sélection dans un autre endroit sur la surface de dessin.',
        description:
            `Vous pouvez utiliser cette fonctionnalité via le panneau des outils en sélectionnant l'icône appropriée
            ou en appuyant sur la touche 'ctrl+D' de votre clavier. Pour ce faire, une sélection doit être existante.`,
        icon: 'duplicate',
    },
];
