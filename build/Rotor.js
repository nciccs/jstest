class Rotor
{
    constructor(rotorStack)
    {
        this.rotorStack = rotorStack;

        this.red = color(255, 0, 0);
        this.color = 255;

        //this.x = width * 0.85;
        this.x = width - Rotor.START_WIDTH / 2 - 1;
        this.y = 100;

        this.width = Rotor.START_WIDTH;
        this.height = Rotor.START_HEIGHT;

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        this.I  = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
        this.II = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
        this.III = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
        this.IV = "ESOVPZJAYQUIRHXLNFTGKDCMWB";
        this.V = "VZBRGITYUPSDNHLXAWMJQOFECK";

        //extra navy extra groovy
        this.VI = "JPGVOUMFYQBENHZRDKASXLICTW";
        this.VII = "NZJHGRCXMYSWBOUFAIVLPEKQDT";
        this.VIII = "FKQHTLXOCBJSPDZRAMEWNIUYGV";

        //default  to I
        this.name = "I";
        this.map;
        this.setCipher(this.I);

        //the notch engages for ring setting A and when rotor I goes from Q to R
        //when Q goes to R, ratchet (pusher) will be allowed to be dropped into notch (unblocked and goes into engage the gear)
        //
        //notch is between rotor I and rotor II, the ratchet is wide to cover bit of rotor I
        //the ratchet pushes up on rotor1 as well as rotor2
        //so this means, the ratchet between rotor 1 and rotor2, pushes both rotors together mechanically
        //
        //double stepping example: Ring setting A for all 3 rotor. rotor I is at Q Q->R, and rotor II is at D
        //press once, Q->R exposes notch, ratchet falls and pushes both rotor 1 and rotor 2 up....D->E
        //press again, R->S, E->F moves, E exposes notch, ratchet falls and push both rotor 2 and 3 up
        //so all 3 rotor moves at the same time, middle basically moved twice, double stepping occurs
        this.notch = 'Q'.charCodeAt() - 'A'.charCodeAt();

        this.ring = new Ring(this);

        //offset from the start, translates original position to map position
        this.translate = 0;

        this.displayText = false;

        WidgetHandler.add(this);
    }

    //static variables
    static get START_WIDTH()
    {
        return (this._START_WIDTH) ? this._START_WIDTH : 100;
    }

    static get START_HEIGHT()
    {
        return (this._START_HEIGHT) ? this._START_HEIGHT : 130 * 1.4;
    }

    static get GEAR_WIDTH_SCALE()
    {
        return (this._GEAR_WIDTH_SCALE) ? this._GEAR_WIDTH_SCALE : 0.3;
    }
    
    static get GEAR_HEIGHT_SCALE()
    {
        return (this._GEAR_HEIGHT_SCALE) ? this._GEAR_HEIGHT_SCALE : 1.4;
    }

    cipher(inIndex, rightToLeft=true)
    {
        let result;

        //default direction
        if(rightToLeft)
        {
            result = this.getPosition(this.map[this.getPosition(inIndex+this.translate)]-this.translate);

        }
        //totally different direction
        else
        {
            result = this.getPosition(this.findIndex(this.getPosition(inIndex+this.translate))-this.translate);
        }

        return result;
    }

    findIndex(inScrambledIndex)
    {
        let result;
        let map = this.map;

        for(let i = 0; i < map.length; i++)
        {
            if(map[i] == inScrambledIndex )
            {
                //we want i
                result = i;
                i = map.length;
            }
        }

        return result;
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

    setToI()
    {
        this.name = "I";
        this.setCipher(this.I);
        this.notch = 'Q'.charCodeAt() - 'A'.charCodeAt();
    }
    
    setToII()
    {
        this.name = "II";
        this.setCipher(this.II);
        this.notch = 'E'.charCodeAt() - 'A'.charCodeAt();
    }

    setToIII()
    {
        this.name = "III";
        this.setCipher(this.III);
        this.notch = 'V'.charCodeAt() - 'A'.charCodeAt();
    }

    setToIV()
    {
        this.name = "IV";
        this.setCipher(this.IV);
        this.notch = 'J'.charCodeAt() - 'A'.charCodeAt();
    }

    setToV()
    {
        this.name = "V";
        this.setCipher(this.V);
        this.notch = 'Z'.charCodeAt() - 'A'.charCodeAt();
    }

    getPosition(inOffset)
    {
        let position = inOffset % this.map.length;

        if(position < 0)
        {
            position = this.map.length + position;
        }
        
        return position;
    }

    setPosition(inPosition)
    {
        if(typeof inPosition == "number")
        {
            this.translate = this.getPosition(inPosition-1);
        }
        else if(typeof inPosition == "string")
        {
            this.translate = this.getPosition(inPosition.toUpperCase().charCodeAt() - 'A'.charCodeAt());
        }
    }

    rotateUp()
    {
        this.translate--;
    }

    rotateDown()
    {
        this.translate++;
    }

    draw()
    {
        push();

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        //rect();
        
        //draw rotor
        Rotor.drawRotor(this.x, this.y);
        
        //draw name
        textAlign(CENTER, CENTER);
        textSize(18);

        let gearWidthRatio = Rotor.GEAR_WIDTH_SCALE;
        stroke(0);
        fill(0);
        //text(this.name, this.x + this.width*0.1, this.y-this.height / 3.6);
        text(this.name, this.topLeftX + this.width * (1-gearWidthRatio) + this.width * gearWidthRatio / 2, this.y);

        //draw letter
        let numLetters = 7;

        //the very top letter
        let offsetFromTranslate  = this.translate + Math.floor(numLetters/2);
        let charCodeA ='A'.charCodeAt(0);

        textSize(15);
        
        for(let i = 0; i < numLetters; i++)
        {
            let pos = this.getPosition(offsetFromTranslate);
            let letter = String.fromCharCode(charCodeA + pos);
            let formattedText = letter;
            //let formattedText = letter + String("0"+(pos+1)).slice(-2);

            //if character A is found
            if(charCodeA + pos == charCodeA)
            {
                stroke(this.red);
                fill(this.red);
                if(!this.displayText)
                {
                    formattedText = '<';
                }
            }
            else
            {
                stroke(200);
                fill(200);
                if(!this.displayText)
                {
                    formattedText = '';
                }
            }

            let rotorInnerTopLeftY = this.y - Rotor.START_HEIGHT / 2 / Rotor.GEAR_HEIGHT_SCALE;
            let rotorInnerHeight = Rotor.START_HEIGHT / Rotor.GEAR_HEIGHT_SCALE;
            text(formattedText, this.x - 3, (rotorInnerTopLeftY + rotorInnerHeight / (numLetters+1) * (i+1)));
            
            offsetFromTranslate--;
        }

        pop();

        //draw ring
        this.ring.x = this.topLeftX + this.ring.width / 2;
        this.ring.y = this.y;
        this.ring.draw();
    }

    //entire bound of entire rotor including gear
    static drawRotor(rotorX, rotorY, fillColor=255, strokeColor=0)
    {
        push();

        fill(fillColor);
        stroke(strokeColor);

        let rotorTopLeftX = rotorX - Rotor.START_WIDTH / 2;
        let rotorTopLeftY = rotorY - Rotor.START_HEIGHT / 2;

        let rotorInnerTopLeftY = rotorY - Rotor.START_HEIGHT / 2 / Rotor.GEAR_HEIGHT_SCALE;
        let rotorInnerHeight = Rotor.START_HEIGHT / Rotor.GEAR_HEIGHT_SCALE;

// //draw outline of rotor
// push();
// fill(color(200, 200, 200, 0));
// rect(rotorTopLeftX, rotorTopLeftY, Rotor.START_WIDTH, Rotor.START_HEIGHT);
// pop();

        //body of rotor
        rect(rotorTopLeftX, rotorInnerTopLeftY, Rotor.START_WIDTH, rotorInnerHeight);

        //gear
        rect(rotorTopLeftX+Rotor.START_WIDTH-Rotor.START_WIDTH * Rotor.GEAR_WIDTH_SCALE,
        rotorY - Rotor.START_HEIGHT / 2,
        Rotor.START_WIDTH * Rotor.GEAR_WIDTH_SCALE,
        Rotor.START_HEIGHT);
        
        //ring
        rect(rotorTopLeftX, rotorTopLeftY-(Ring.START_HEIGHT-Rotor.START_HEIGHT)/2, Ring.START_WIDTH, Ring.START_HEIGHT);

        pop();
    }

    mouseDragged()
    {

        if(WidgetHandler.isDragging && this.collideRotorStack())
        {
            //remove this rotor from rotor stack
            this.rotorStack.remove(this);

            this.rotorStack.cursor = this.rotorStack.findAddAt(this);
        }
        else
        {
            this.rotorStack.cursor = -1;
        }
    }

    mouseReleased()
    {
        //mouse drag happened
        if(WidgetHandler.isDragging)
        {
            if(this.collideRotorStack())
            {
                //add to stack
                if(this.rotorStack.add(this))
                {
                    WidgetHandler.moveWidgetToBottom();

                }
            }
            this.rotorStack.cursor = -1;
        }
        //no mouse drag happened
        else
        {
            this.rotate(mouseX, mouseY);
        }
    }

    rotate(inMouseX, inMouseY)
    {
        if(inMouseX >= this.topLeftX+this.ring.width)
        {
            //if mouseY is below mid
            if(inMouseY >= this.y)
            {
                this.rotateDown();
            }
            else
            {
                this.rotateUp();
            }
        }
        else
        {
            //if mouseY is below mid
            if(inMouseY >= this.y)
            {
                this.ring.rotateDown();
            }
            else
            {
                this.ring.rotateUp();
            }
        }
    }

    collideRotorStack()
    {
        let collided = false;
        //collideRectCentre(x1, y1, width1, height1, x2, y2, width2, height2)
        let rotorStackX = this.rotorStack.x;
        let rotorStackY = this.rotorStack.y;
        let rotorStackWidth = this.rotorStack.width;
        let rotorStackHeight = this.rotorStack.height;

        //inner rotor
        let rotorInnerHeight = Rotor.START_HEIGHT / Rotor.GEAR_HEIGHT_SCALE;

        //gear
        let gearWidth = Rotor.START_WIDTH * Rotor.GEAR_WIDTH_SCALE;
        let gearX = this.x + this.width / 2 - gearWidth / 2;

        //ring
        let ringX = this.ring.x;
        let ringWidth = this.ring.width;
        let rightHeight = this.ring.height;

        if(
        Collision.collideRectCentre(rotorStackX, rotorStackY, rotorStackWidth, rotorStackHeight, this.x, this.y, this.width, rotorInnerHeight) ||
        Collision.collideRectCentre(rotorStackX, rotorStackY, rotorStackWidth, rotorStackHeight, gearX, this.y, gearWidth, this.height) ||
        Collision.collideRectCentre(rotorStackX, rotorStackY, rotorStackWidth, rotorStackHeight, ringX, this.y, ringWidth, rightHeight)
        )
        {
            collided = true;   
        }

        return collided;
    }
}