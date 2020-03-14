import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('brush', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/brush.svg'));
    iconRegistry.addSvgIcon('calligraphie', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/calligraphie.svg'));
    iconRegistry.addSvgIcon('color', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/color.svg'));
    iconRegistry.addSvgIcon('cursor', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/cursor.svg'));
    iconRegistry.addSvgIcon('ellipse', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/ellipse.svg'));
    iconRegistry.addSvgIcon('eraser', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/eraser.svg'));
    iconRegistry.addSvgIcon('hexagon', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/hexagon.svg'));
    iconRegistry.addSvgIcon('line', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/line.svg'));
    iconRegistry.addSvgIcon('pencil', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/pencil.svg'));
    iconRegistry.addSvgIcon('pipette', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/pipette.svg'));
    iconRegistry.addSvgIcon('rectangle', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/rectangle.svg'));
    iconRegistry.addSvgIcon('spray', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/spray.svg'));
    iconRegistry.addSvgIcon('stamp', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/stamp.svg'));
    iconRegistry.addSvgIcon('text', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/text.svg'));
    iconRegistry.addSvgIcon('redo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/redo.svg'));
    iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/undo.svg'));
    iconRegistry.addSvgIcon('paint-bucket', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/paint-bucket.svg'));
}
}
