import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';

    export const welcomeItem = [
        {
            name: "Bienvenue",
            shortcutName: "Bienvenue",
            shortDescription: "Message de bienvenue",
            description: "text goes here",
            icon: "nothing",
        },
    ];

    
    export const menuItems = [
        {
            name: "Créer un nouveau dessin",
            shortcutName: "Créer",
            shortDescription: "pour creer des dessins",
            description: "text goes here",
            icon: "add_circle",
            calledComponent: NewDrawComponent
        },
        {
            name: "Ouvrir la galerie de dessins",
            shortcutName: "Ouvrir",
            shortDescription: "pour aller chercher des dessins sur le serveur",
            description: "text goes here",
            icon: "camera",
        },
        {
            name: "Afficher le guide d'utilisation",
            shortcutName: "Guide",
            shortDescription: "text goes here",
            description: "text goes here",
            icon: "menu_book",
            calledComponent: UserManualComponent
        },
        {
            name: "Continuer un dessin",
            shortcutName: "Continuer",
            shortDescription: "pour continuer un dessin",
            description: "text goes here",
            icon: "arrow_forward",
        },

    ];
    export const toolsItems = [
        {
            name: "Sélectionner",
            shortcutName: "Sélectionner",
            shortDescription: "text goes here",
            description: "text goes here1",
            icon: "../../../assets/images/cursor.png",

        },
        {
            name: "Crayon",
            shortcutName: "Crayon",
            shortDescription: "text goes here",
            description: "text goes here2",
            icon: "../../../assets/images/pencil.png",
        },
        {
            name: "Rectangle",
            shortcutName: "Rectangle",
            shortDescription: "text goes here",
            description: "text goes here3",
            icon: "../../../assets/images/frame.png",

        },
        {
            type: "Outils",
            name: "Plume",
            shortcutName: "Plume",
            shortDescription: "text goes here",
            description: "text goes here4",
            icon: "../../../assets/images/calligraphie.png",
        },
       
        {
            name: "Élipse",
            shortcutName: "Élipse",
            shortDescription: "text goes here",
            description: "text goes here6",
            icon: "../../../assets/images/oval.png",
        },
        {
            name: "Ligne",
            shortcutName: "Ligne",
            shortDescription: "text goes here",
            description: "text goes here7",
            icon: "../../../assets/images/graph.png",
        },
        {
            name: "Chemin",
            shortcutName: "Chemin",
            shortDescription: "text goes here",
            description: "text goes here8",
            icon: "../../../assets/images/timeline.png",
        },
        {
            name: "Pinceau",
            shortcutName: "Pinceau",
            shortDescription: "text goes here",
            description: "text goes here9",
            icon: "../../../assets/images/edit-tools.png",
        },
        {
            name: "Efface",
            shortcutName: "Efface",
            shortDescription: "text goes here",
            description: "text goes here10",
            icon: "../../../assets/images/eraser.png",
        },
        {
            name: "Polygone",
            shortcutName: "Polygone",
            shortDescription: "text goes here",
            description: "text goes here",
            icon: "../../../assets/images/hexagon.png",
        },
        {
            name: "Pipette",
            shortcutName: "Pipette",
            shortDescription: "text goes here",
            description: "text goes here",
            icon: "../../../assets/images/lab.png",
        },
        {
            name: "Aérosol",
            shortcutName: "Aérosol",
            shortDescription: "text goes here",
            description: "text goes here",
            icon: "../../../assets/images/spray.png",
        },

        {
            name: "Choisir couleur",
            shortcutName: "Outil couleur",
            shortDescription: "text goes here",
            description: "text goes here5",
            icon: "../../../assets/images/exclude.png",
        },

    ];





