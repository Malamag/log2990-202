import{Point} from'./point'
import{ MouseEventsHandlerService} from'./mouse-events-handler.service'

export abstract class DrawingObject {
    mouseService: MouseEventsHandlerService
    path: Point[];
    abstract draw(): string;
    
}
