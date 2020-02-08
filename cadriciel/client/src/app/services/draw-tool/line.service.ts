import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { LineAttributes } from '../attributes/line-attributes';
import { ColorPickingService } from '../colorPicker/color-picking.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawingTool {
  showJunctions:boolean;
  forcedAngle:boolean;
  currentPos:Point;
  attr: LineAttributes
  
  constructor(inProgess:HTMLElement, drawing:HTMLElement, selected:boolean, width:number, primary_color:string, showJunctions:boolean, junctionWidth:number,shortcut:number, interaction: InteractionService, colorPick: ColorPickingService){
    console.log("yeet")
    super(inProgess,drawing, selected,width,primary_color,shortcut, interaction, colorPick);
    //this.attr = new LineAttributes(this.defaultValues.DEFAULTJUNCTION, this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTJUNCTIONRADIUS)
    this.showJunctions = showJunctions;
    this.forcedAngle = false;
    this.currentPos = new Point(0,0);
    this.updateAttributes()
    this.updateColors();
     
  }

  updateAttributes(){
    console.log("here");
    this.interaction.$lineAttributes.subscribe(obj=>{
      if(obj)
        this.attr = new LineAttributes(obj.junction, obj.lineThickness, obj.junctionDiameter)
    })

  }
  //updating on key change
  update(keyboard:KeyboardHandlerService){

    //only if the lineTool is currently affecting the canvas
    if(this.isDown){

      //lines are fixed at 45 degrees angle when shift is pressed
      this.forcedAngle = keyboard.shiftDown;

      //update progress, it is not a double click
      this.updateProgress(false);
      this.updateColors()
    }

    //backspace -- WE SHOULD PROBABLY USE A MAP INSTEAD --
    if(keyboard.keyCode == 8){

      //always keep 2 points
      if(this.currentPath.length > 2){

        //remove second last point
        this.currentPath[this.currentPath.length-2] = this.currentPath[this.currentPath.length-1];
        this.currentPath.pop();

        //update progress, it is not a double click
        this.updateProgress(false);
      }
    }

    //escape -- WE SHOULD PROBABLY USE A MAP INSTEAD --
    if(keyboard.keyCode == 27){

      //cancel progress
      this.cancel();
    }
  }

  //mouse down with lineTool in hand
  down(position:Point, mouseInsideWorkspace:boolean){

    //in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    //the lineTool should affect the canvas
    this.isDown = true;

    //save currentPosition for real time update when we go from forced to loose angle
    this.currentPos = position;

    //add the same point twice in case the mouse doesnt move on first point
    if(this.currentPath.length == 0){
      this.currentPath.push(position);
    }
    this.currentPath.push(position);
    
    //update progress, it is not a double click
    this.updateProgress(false);
  }

  //mouse up with line in hand
  up(position:Point){
    //nothing happens
  }

  //mouse move with line in hand
  move(position:Point){

    //only if the lineTool is currently affecting the canvas
    if(this.isDown){

      //save currentPosition for real time update when we go from forced to loose angle
      this.currentPos = position;

      //we only have one point, add a new one
      if(this.currentPath.length == 1){
        this.currentPath.push(position);
      }
      //we have more than one point, last one needs to follow the mouse
      else{
        this.currentPath[this.currentPath.length-1] = position;
      }
       
      //update progress, it is not a double click
      this.updateProgress(false);
    }
  }

  //mouse doubleClick with line in hand
  doubleClick(position:Point, mouseInsideWorkspace:boolean){

    //we can only end a line inside the canvas
    if(mouseInsideWorkspace){
      //we need 4 or more points in path because origin (1) + current (1) + double click (2) = 4 is the minimum
      if(this.currentPath.length >= 4){

        //only if double click is valid
        if(mouseInsideWorkspace){

          //the pencil should not affect the canvas
          this.isDown = false;
  
          if(this.currentPath.length >= 2){
            //Down is called twice before we get here -> remove the excess 2 points
            this.currentPath.pop();
            this.currentPath.pop();
          }
  

          //add everything to the canvas, it is a double click
          this.updateDrawing(true);

          //reset angle mode to default (loose)
          this.forcedAngle = false;
        }
      }else{
        //we have no points -> can't start a line with a double click
        this.cancel();
      }
    }
  }

  //when we go from inside to outside the canvas
  goingOutsideCanvas(position:Point){
    //nothing happens since we don't want to end the preview
  }

  //when we go from outside to inside the canvas
  goingInsideCanvas(position:Point){
    //nothing happens since we keep updating the preview
  }

  //Creates an svg path that connects every points of currentPath
  //and adds svg circles on junctions if needed with the line attributes
  createPath(p:Point[], wasDoubleClick:boolean){
    
    //if we need to force an angle
    if(this.forcedAngle){
      p[p.length-1] = this.pointAtForcedAngle(p[p.length-2],p[p.length-1]);
    }
    //or stay at current position
    else{
      p[p.length-1] = this.currentPos;
    }

    //if the path closes on itself
    let closeIt : boolean = false;

    //if double click, the path is done
    if(wasDoubleClick){

      //distance between first and last point
      let dist : number = Point.distance(p[p.length-1],p[0]);

      //threshold in pixels to close the path on itself
      let pixelThreshold : number = 3;
      let distanceToConnect : number = Math.sqrt(Math.pow(pixelThreshold,2) + Math.pow(pixelThreshold,2));

      //connect first and last if they meet distance threshold
      closeIt = dist <= distanceToConnect;
    }

    //create a divider
    let s = '<g name = "line-segments">';

    //start the path
    s += '<path d="';
    //move to first point
    s+= `M ${p[0].x} ${p[0].y} `;
    //for each succeding point, connect it with a line, ignore last one if we're closing it on itself
    for(let i = 1; i < p.length - (closeIt? 1 : 0);i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }
    //close the path
    if(closeIt){
      s+= "Z";
    }

    //set render attributes
    s+= `"stroke="${this.chosenColor.primColor}"`;
    s+= `stroke-width="${this.attr.lineThickness}"`;
    s+= 'fill="none"';
    s+= 'stroke-linecap="round"';
    s+= 'stroke-linejoin="round" />';
    //close the path

    //if we need to show the line junctions
    if(this.attr.junction){
      //for each point, add a circle on it (ignore the last one if the path is closed)
      for(let i = 0; i < p.length - (closeIt? 1 : 0);i++){
        //set render attributes for the svg circle
        s += `<circle cx="${p[i].x}" cy="${p[i].y}"`;
        s += `r="${this.attr.junctionDiameter/2}"`; // to get the radius
        s += 'stroke="none"';
        s += `fill="#${this.primary_color}"/>`;
      }
    }
  
    return s;
  }

  pointAtForcedAngle(firstPoint:Point, secondPoint:Point){

    //x and y variation
    let xDelta = secondPoint.x-firstPoint.x;
    let yDelta= secondPoint.y-firstPoint.y;

    //calculate angle (radians) from x axis (counterclockwise) in first quadrant
    let angle = Math.atan(Math.abs(yDelta)/Math.abs(xDelta));
    //convert in degrees
    angle = 360 * angle/(2*Math.PI);

    //adjust for 2nd, 3rd and 4th quadrants
    if(xDelta<0){
      angle = 180-angle;
    }
    if(yDelta>0){
      angle =360-angle;
    }

    //get closest multiple of 45
    angle = 45*(Math.round(angle/45));

    //360 degrees is the same as 0
    if(angle == 360){
      angle = 0;
    }

    //new point will be at same y
    if(angle == 180 || angle == 0){
      yDelta = 0;
    }

    //new point will be at same x
    if(angle == 90 || angle == 270){
      xDelta = 0;
    }

    //same distance in y as in x
    if(angle == 45 || angle == 135){
      yDelta = -Math.abs(xDelta);
    }
    if(angle == 225 || angle == 315){
      yDelta = Math.abs(xDelta);
    }

    //add fixed variations to the first point
    let fixed : Point = new Point(firstPoint.x + xDelta, firstPoint.y + yDelta);

    return fixed;
  }
}
