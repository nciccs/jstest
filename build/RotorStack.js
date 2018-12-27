class RotorStack
{
    constructor(x = width/2, y = 100)
    {
        this.x = x;
        this.y = y;
        
        this.rotorWidth = Rotor.START_WIDTH;
        this.rotorHeight = Rotor.START_HEIGHT;

        this.margin = 5;
        
        //start out with 1 rotor width
        this.startWidth = Rotor.START_WIDTH + this.margin*2;
        this.width = this.startWidth;
        this.height = Rotor.START_HEIGHT + this.margin*2;

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        this.backgroundColor = 160;

        this.slotColor = 50;

        this.red = color(255, 0, 0);

        //holds multiple rotors
        this.rotors = [];

        //affects draw
        this.cursor = -1;
        //this.cursorColor = this.red;
        this.cursorColor = this.red;
    }


    //add to specific element depending on where the imported rotor's coordinate is
    add(inRotor)
    {
        let success = false;
        //add only if rotor doesn't exist
        let found = this.findIndexByRotor(inRotor);
        if(found == null)
        {
            let addAt = this.findAddAt(inRotor)

            this.rotors.splice(addAt, 0, inRotor);

            success = true;
        }
        return success;
    }

    findAddAt(inRotor)
    {
        let addAt = -1;
        for(let i = 0; i < this.rotors.length; i++)
        {
            if(inRotor.x <= this.rotors[i].x)
            {
                addAt = i;
                i = this.rotors.length;
            }
        }

        if(addAt == -1)
        {
            addAt = this.rotors.length;
        }

        return addAt;
    }

    remove(inRotor)
    {
        let found = this.findIndexByRotor(inRotor);
        if(found != null)
        {
            this.rotors.splice(found, 1);
        }
    }

    findIndexByRotor(inRotor)
    {
        let found;
        for(let i = 0; i < this.rotors.length; i++)
        {
            if(this.rotors[i] === inRotor)
            {
                found = i;
                i = this.rotors.length;
            }
        }
        return found;
    }

    //so far into the project and only just learnt push and pop...
    //basically can draw what ever style i want inside push, but pop restores everything back
    //
    //work out based on how many rotors, the width of this whole thang
    draw()
    {
        //number of slots to draw
        //let numSlots = this.numSlots;
        let numSlots = this.rotors.length == 0 ? 1 : this.rotors.length;

        //need to deal with margin
        this.width = (this.startWidth-this.margin)*(numSlots) + this.margin;

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        //draw background rect
        fill(this.backgroundColor);
        rect(this.topLeftX, this.topLeftY, this.width, this.height);

        let leftoverSpace = this.width - Rotor.START_WIDTH * numSlots;
        let gap = leftoverSpace / (1+numSlots);

        for(let i = 0; i < numSlots; i++)
        {
            //add in a gap and add in to middle of rotor, offset by multiple of gap + rotor width
            let rotorX = this.topLeftX + (gap+Rotor.START_WIDTH/2) + i*(gap+Rotor.START_WIDTH);

            //draw a shadow/silhouette of rotor representing rotor slot          
            Rotor.drawRotor(rotorX, this.y, this.slotColor, this.slotColor);

            //this teleports rotor inside rotors into position every draw call
            if(this.rotors.length > 0)
            {
                this.rotors[i].x = rotorX;
                this.rotors[i].y = this.y;
            }
        }

        /*
        fill(255);
        stroke(255);
        textSize(18);
        //text("Place\nRotors\nHere", this.x, this.y);
        
        fill(0);
        stroke(0);
        //text("Walzen", this.x+this.width/2+35, this.y);
        */
       this.drawCursor(gap);
    }

    drawCursor(gap)
    {
        push();
        
        fill(this.cursorColor);
        stroke(this.cursorColor);

        if(this.cursor > -1)
        {
            //let cursorX = this.topLeftX + (gap+Rotor.START_WIDTH/2) + this.cursor*(gap+Rotor.START_WIDTH);
            let cursorX = this.topLeftX + this.cursor*(gap+Rotor.START_WIDTH);

            rect(cursorX+1, this.topLeftY+1, gap-2, this.height-2);

        }
        pop();
    }
}