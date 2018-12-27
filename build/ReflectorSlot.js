class ReflectorSlot
{
    constructor(rotorStack)
    {
        this.x = 0;
        this.y = 0;

        this.margin = 5;

        //width and height needs to be set first to get topLeftX and topLeftY
        //this.width = 65;
        //this.height = 120;
        this.width = Reflector.START_WIDTH + this.margin * 2;
        this.height = Reflector.START_HEIGHT + this.margin*2;

        this.backgroundColor = 160;
        this.slotColor = 50;

        this.distFromRotorStack = 0;
        
        if(rotorStack != null)
        {
            this.rotorStack = rotorStack;
            this.x = rotorStack.topLeftX - this.width/2 - this.distFromRotorStack;
            this.y = rotorStack.y;
        }

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        //this.reflectorSlotColor = 50;

        this.reflector = null;
    }

    draw()
    {
        this.x = this.rotorStack.topLeftX - this.width/2 - this.distFromRotorStack;

        this.drawReflectorSlot();

        if(this.reflector != null)
        {
            this.reflector.x = this.x;
            this.reflector.y = this.y;
        }
    }

    drawReflectorSlot()
    {
        push();

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        fill(this.backgroundColor);

        //draw overall rect
        rect(this.topLeftX, this.topLeftY, this.width, this.height, this.cornerRadius);

        fill(this.slotColor);
        //draw slot rect
        rect(this.topLeftX+this.margin, this.topLeftY+this.margin, this.width-this.margin*2, this.height-this.margin*2);

        stroke(255);
        fill(255);
        textSize(15);
        //text("Place\nReflector\nHere", this.x, this.y);

        fill(0);
        stroke(0);
        textSize(18);
        //text("Umkehrwalze", this.x - this.width - 25, this.y);
        //text("Umkehrwalze", this.x - 20, this.y+this.height/2+15);

        pop();
    }
}