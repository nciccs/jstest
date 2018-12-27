//https://en.wikipedia.org/wiki/Enigma_machine#Reflector
//"In the Abwehr Enigma, the reflector stepped during encryption in a manner similar to the other wheels."
//"In the German Army and Air Force Enigma, the reflector was fixed and did not rotate;"
//So this maybe a problem later on if want historically accurate options...
//
//go from A to Z, map key value pair to each character from import/argument
//for example:
//Contacts    = ABCDEFGHIJKLMNOPQRSTUVWXYZ                
//              ||||||||||||||||||||||||||
//Reflector B = YRUHQSLDPXNGOKMIEBFZCWVJAT
class Reflector
{
    constructor(reflectorSlot)
    {
        //data structure responsible for finding this same class objects
        this.reflectorSlot = reflectorSlot;
    
        this.name = "B";

        this.color = 255;

        //this.x = width * 0.12;
        this.x = Reflector.START_WIDTH / 2;
        this.y = 100;

        this.width = Reflector.START_WIDTH;
        this.height = Reflector.START_HEIGHT;

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        this.B = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
        this.C = "FVPJIAOYEDRZXWGCTKUQSBNMHL";

        //map stores output as index number
        this.map = [];

        this.setCipher(this.B);

        WidgetHandler.add(this);
    }

    //static variables
    static get START_WIDTH()
    {
        return (this._START_WIDTH) ? this._START_WIDTH : 65;
    }

    static get START_HEIGHT()
    {
        return (this._START_HEIGHT) ? this._START_HEIGHT : 120;
    }

    cipher(inIndex)
    {
        return this.map[inIndex];
    }

    set cipherString(inCipherString)
    {
        this.setCipherString(inCipherString);
    }

    setToB()
    {
        this.name = "B";
        this.setCipher(this.B);
    }

    setToC()
    {
        this.name = "C";
        this.setCipher(this.C);
    }

    setCipher(inCipherString)
    {
        inCipherString = inCipherString.toUpperCase();

        this.map = [];
        for (let i = 0; i < inCipherString.length; i++)
        {
            this.map.push(inCipherString.charCodeAt(i) - 'A'.charCodeAt(0));
        }
    }

    draw()
    {
        push();

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        fill(255);
        rect(this.topLeftX, this.topLeftY, this.width, this.height, this.cornerRadius);
        
        stroke(0);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(18);

        //text(this.name, this.x, this.y-this.height / 3.6);
        text(this.name, this.x, this.y);

        pop();
    }

    mouseDragged()
    {
        if(WidgetHandler.isDragging)
        {
            if(this.reflectorSlot.reflector === this)
            {
                this.reflectorSlot.reflector = null;
            }

            //WidgetHandler._holding.x = constrain(WidgetHandler._holding.x, halfWidth, width - halfWidth);
            //this.x = constrain(this.x, this.width/2, this.reflectorSlot.topLeftX+this.reflectorSlot.width-this.width/2);
        }
    }

    mouseReleased()
    {
        //if this object is dropped on reflector slot
        if(Collision.collideRectObject(this, this.reflectorSlot))
        {
            //if slot is empty, lock it in, add to reflectorSlot
            if(this.reflectorSlot.reflector == null)
            {
                this.x = this.reflectorSlot.x;
                this.y = this.reflectorSlot.y;

                this.reflectorSlot.reflector = this;
                
                WidgetHandler.moveWidgetToBottom();
            }
            else
            {
                //teleport outside of slot area, so that this doesn't cover up slot
                //this.x = this.reflectorSlot.topLeftX - Reflector.START_WIDTH / 2 - this.reflectorSlot.margin;
                //this.y = this.reflectorSlot.y;
            }
        }
    }
}