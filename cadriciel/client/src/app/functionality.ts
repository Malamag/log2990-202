import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { GuideUtilisationComponent } from './components/guide-utilisation/guide-utilisation.component';

export const functionality = [
    //{
      //  name: "défaire",
     //   shortcutName:"défaire",
     //   shortDescription:"text goes here",
    //    description: "text goes here",
        /* Source:Icons made by <a href="https://www.flaticon.com/authors/xnimrodx" 
        title="xnimrodx">xnimrodx</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/
     //   icon: "../../../assets/images/undo.png",
   // },

   // {
    //    name: "refaire",
    //    shortcutName:"refaire",
    //    shortDescription:"text goes here",
    //    description: "text goes here",
        /* source:Icons made by <a href="https://www.flaticon.com/authors/xnimrodx" 
        title="xnimrodx">xnimrodx</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
    //    icon: "../../../assets/images/redo.png",
   // },
    {
      name: "Créer un nouveau dessin",
      shortcutName: "Créer",
      shortDescription:"text goes here",
      description: "text goes here",
      icon :"add_circle",
      calledComponent: NewDrawComponent  
    },
    {
        name: "Ouvrir la galerie de dessins disponibles sur le serveur",
        shortcutName: "Ouvrir",
        shortDescription:"gallerie",
        description: "text goes here",
        icon :"camera",  
    },
    {
        name: "Afficher le guide d'utilisation de l'application",
        shortcutName: "Afficher",
        shortDescription:"text goes here",
        description: "text goes here",
        icon :"menu_book",  
        calledComponent: GuideUtilisationComponent
    },
    {
        name: "Continuer un dessin",
        shortcutName: "Continuer",
        shortDescription:"text goes here",
        description: "text goes here",
        icon :"arrow_forward",  
    },
    {
        name: "quitter",
        shortcutName: "close",
        shortDescription:"text goes here",
        description: "text goes here",
        icon :"close",  
    },
    {
        name: "sélectionner",
        shortcutName:"sélectionner",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: <div>Icons made by <a href="https://www.flaticon.com/authors/those-icons" 
        title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/
        icon: "../../../assets/images/cursor.png",
    },
    {
        name : "crayon",
        shortcutName: "crayon",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: <div>Icons made by <a href="https://www.flaticon.com/authors/those-icons" 
        title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> */
        icon :"../../../assets/images/pencil.png",  
    },

    {
        name: "pinceau",
        shortcutName:"pinceau",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik" 
        title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/edit-tools.png",
    },
    {
        name: "plume",
        shortcutName:"plume",
        shortDescription:"text goes here",
        description: "text goes here",
        /*source: <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" 
        title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/ 
        icon: "../../../assets/images/calligraphie.png",
    },

   /* {
        name: "chemin",
        shortcutName:"chemin",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik" 
        title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
       //icon: "../../../assets/images/timeline.png",
    //},
    {
        name: "Aérosol",
        shortcutName:"Aérosol",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/spray.png",
    },
    
    {
        name: "efface",
        shortcutName:"efface",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/eraser.png",
    },
    {
        name: "ligne",
        shortcutName:"ligne",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source : Icons made by <a href="https://www.flaticon.com/authors/google"
        title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/ 
        icon: "../../../assets/images/graph.png",
    },

    {
        name: "rectangle",
        shortcutName:"rectangle",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: <div>Icons made by <a href="https://www.flaticon.com/authors/google" 
        title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/
        icon: "../../../assets/images/frame.png"
    },

    {
        name: "élipse",
        shortcutName:"élipse",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source:uIcons made by <a href="https://www.flaticon.com/authors/freepik"
        title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/oval.png",
    },

    {
        name: "polygone",
        shortcutName:"polygone",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/retinaicons"
         title="Retinaicons">Retinaicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/hexagon.png",
    },
    {
        name: "pipette",
        shortcutName:"pipette",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/lab.png",
    },
    
    {
        name: "texte",
        shortcutName:"texte",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/text.png",
    },

    {
        name: "étampe",
        shortcutName:"étampe",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 
        title="Flaticon"> www.flaticon.com</a>*/
        icon: "../../../assets/images/stamp.png",
    },
    {
        name: "choisir couleur",
        shortcutName:"outil couleur",
        shortDescription:"text goes here",
        description: "text goes here",
        /* source: <div>Icons made by <a href="https://www.flaticon.com/authors/freepik"
         title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>*/
        icon: "../../../assets/images/exclude.png",
    }

];
