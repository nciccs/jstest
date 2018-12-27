class WidgetHandler
{
    static init()
    {
        WidgetHandler._widgets = [];

        //object being dragged
        WidgetHandler._holding = null;
        WidgetHandler._holdingDistX;
        WidgetHandler._holdingDistY;

        WidgetHandler._holdingStartX;
        WidgetHandler._holdingStartY;
        //if drag happened
        WidgetHandler._isDragging = false;
    }

    static get holding()
    {
        return WidgetHandler._holding;
    }

    static get isDragging()
    {
        return WidgetHandler._isDragging;
    }

    static add(inObject)
    {
        //create static storage if doesn't exist
        if(!WidgetHandler._widgets)
        {
            WidgetHandler.init();
        }
        
        if(inObject instanceof Array)
        {
            WidgetHandler._widgets.push.apply(WidgetHandler._widgets, inObject);
        }
        else
        {
            WidgetHandler._widgets.push(inObject);
        }
    }

    static toString()
    {
        let string = 'length: '+WidgetHandler._widgets.length+'\n';

        for(let i = WidgetHandler._widgets.length-1; i > -1; i--)
        {
            for (var field in WidgetHandler._widgets[i])
            {
                string += field + '=' + WidgetHandler._widgets[i][field] + ', ';
            }
            
            string += '\n\n';
        }
        
        return string;
    }

    //find widget with mouse coordinate
    static findByMouse(inMouseX, inMouseY)
    {

        let found;
        for(let i = WidgetHandler._widgets.length-1; i > -1; i--)
        {
            let obj = WidgetHandler._widgets[i];

            if(typeof obj.contains === "function")
            {
                if(obj.contains(inMouseX, inMouseY))
                {
                    found = obj;
                    i = -1;
                }
            }
            else
            {
                //check default bound
                if(obj.topLeftX <= inMouseX && inMouseX <= obj.topLeftX + obj.width &&
                obj.topLeftY <= inMouseY && inMouseY <= obj.topLeftY + obj.height
                )
                {
                    found = obj;
                    i = -1;
                }
            }
        }

        return found;
    }

    static mousePressed()
    {
        let foundObject = WidgetHandler.findByMouse(mouseX, mouseY);
        if(foundObject)
        {
            //disable scrolling
            document.ontouchmove = function(e){e.preventDefault();}

            if(typeof foundObject.mousePressed === "function")
            {
                foundObject.mousePressed();
            }

            //hold the found object
            WidgetHandler._holding = foundObject;

            //set the distance between object and mouse
            WidgetHandler._holdingDistX = WidgetHandler._holding.x - mouseX;
            WidgetHandler._holdingDistY = WidgetHandler._holding.y - mouseY;

            WidgetHandler._holdingStartX = mouseX;
            WidgetHandler._holdingStartY = mouseY;

            WidgetHandler._isDragging = false;
        }
    }

    static mouseDragged()
    {
        if(WidgetHandler._holding)
        {
            if(typeof WidgetHandler._holding.mouseDragged === "function")
            {
                WidgetHandler._holding.mouseDragged();
            }

            WidgetHandler.limitHoldingInCanvas();

            //if has moved then is dragging
            if(!(WidgetHandler._holdingStartX == mouseX && WidgetHandler._holdingStartY == mouseY))
            {
                WidgetHandler._isDragging = true;
                WidgetHandler.moveWidgetToTop();
            }
        }
    }

    static limitHoldingInCanvas()
    {
        //Code to prevent objects from leaving the canvas boundary
        WidgetHandler._holding.x = mouseX + WidgetHandler._holdingDistX;
        WidgetHandler._holding.y = mouseY + WidgetHandler._holdingDistY;

        let halfWidth = WidgetHandler._holding.width/2;
        let halfHeight = WidgetHandler._holding.height/2;

        WidgetHandler._holding.x = constrain(WidgetHandler._holding.x, halfWidth, width - halfWidth);
        WidgetHandler._holding.y = constrain(WidgetHandler._holding.y, halfHeight, height - halfHeight);
    }

    static mouseReleased()
    {
        if(WidgetHandler._holding)
        {
            //enable scrolling
            document.ontouchmove = function(e){return true;}

            if(typeof WidgetHandler._holding.mouseReleased === "function")
            {
                WidgetHandler._holding.mouseReleased();
            }

            //drop the holding object
            WidgetHandler._holding = null;
        }
    } 

    static moveWidgetToTop()
    {
        let widgets = WidgetHandler._widgets;

        if(WidgetHandler._holding != null)
        {
            //if object is not on top of stack ...which is last element of data structure
            if(WidgetHandler._holding !== widgets[widgets.length-1])
            {
                //move object to top of stack by:

                //find the object in stack
                let foundIndex = WidgetHandler.findByWidget(WidgetHandler._holding);

                //remove from widgets the current position into a variable then
                //add to last position of widgets
                widgets.push(widgets.splice(foundIndex, 1)[0]);
            }
        }
    }

    static moveWidgetToBottom()
    {
        let widgets = WidgetHandler._widgets;

        if(WidgetHandler._holding != null)
        {
            //if object is not on bottom of stack
            if(WidgetHandler._holding !== widgets[0])
            {
                //move object to bottom of stack by:

                //find the object in stack
                let foundIndex = WidgetHandler.findByWidget(WidgetHandler._holding);

                //remove widget
                let widget = widgets.splice(foundIndex, 1)[0];

                //plant it into bottom of stack which is 1st element, index 0
                widgets.splice(0, 0, widget);
            }
        }
    }

    static findByWidget(inWidget)
    {
        let found;

        let widgets = WidgetHandler._widgets;
        for(let i = 0; i < widgets.length; i++)
        {
            if(widgets[i] === inWidget)
            {
                found = i;
                i = widgets.length;
            }
        }

        return found;
    }


    //deal with draw stack
    //so the way Scratch works is which ever sprite being dragged is rendered on top
    //must actually be dragged, clicking without any dragging will not move it to the top
    static draw()
    {
        let widgets = WidgetHandler._widgets;
        for(let i = 0; i < widgets.length; i++)
        {
            widgets[i].draw();
        }
    }
}