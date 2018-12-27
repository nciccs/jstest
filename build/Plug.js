class Plug
{
    constructor(plugboard, x, y, inColor=255)
    {
        this.plugboard = plugboard;

        //rect is drawn top left corner
        this.x = x;
        this.y = y;

        this.width = 25;
        this.height = 55;
        this.cornerRadius = 15;
        
        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        this.textColor = color(0, 0, 0);
        this.color = inColor;

        this.slot = null;
        this.toPlug = null;

        WidgetHandler.add(this);
    }

    draw()
    {
        push();

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        //draw cable
        push();
        stroke(this.color);
        let thickness = 2;
        strokeWeight(thickness);
        line(this.x, this.y + this.height/2+thickness, this.toPlug.x, this.toPlug.y + this.toPlug.height/2+thickness);
        pop();

        //draw plugged
        fill(this.color);
        rect(this.topLeftX, this.topLeftY, this.width, this.height, this.cornerRadius);
        ellipse(this.x, this.y, this.width*0.5, this.width*0.5);

        if(this.slot != null)
        {
            stroke(this.textColor);
            //draw text
            fill(this.textColor);
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.slot.c, this.x, this.y-this.height / 3.6);

            let charNum = this.slot.c.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
            text(charNum, this.x, this.y + this.height / 3.5);

        }

        pop();
    }

    mouseDragged()
    {
        if(WidgetHandler.isDragging)
        {
            //if plug is in a slot
            if(this.slot != null)
            {
                //slot is not occupied by plug
                this.slot.plug = null;

                //indicate plug isn't connected to slot
                this.slot = null;
            }
        }
    }
    /*
        find slot that collided with plug

        if found slot then
            if slot is not plugged then
                teleport plug to slot's xy by
                    set plug's x to slot's x
                    set plug's y to slot's y

                so that we know which slot plug is connected to
                    set plug's slot to found slot
                
                so that we know slot is taken by plug
                    set slot's plug to plug

            else slot is not empty
                teleport plug outside of slot area by
                    if plug's x is left of slot's x
                        set plug's x to left side by
                            set plug's x to slot's x - half of space between slots
                    else plug's x is right of slot's x
                        else plug's x to right side by
                            set plug's x to slot's x + half of space between slots
                    do nothing to y? or set plug's y to slot's y?
            end if
        end if
    */
    mouseReleased()
    {
        //can't have shape collision here, got to use centre of plug vs inner circular area of slot
        let slot = this.plugboard.findSlot(this.x, this.y);

        //if found slot
        if(slot != null)
        {
            //if slot is not plugged
            if(slot.plug == null)
            {
                //teleport plug to slot xy
                this.x = slot.x;
                this.y = slot.y;

                this.slot = slot;
                slot.plug = this;

                WidgetHandler.moveWidgetToBottom();
            }
            else
            {
                //teleport outside of slot area, so that this doesn't cover up slot
                this.x = this.x <= slot.x ? slot.x-this.plugboard.spaceX/2 : slot.x+this.plugboard.spaceX/2;
                //this.y = slot.y;
            }
        }
    }
}