//main role of engine is to handle the mechanics of the rotors
class Engine
{
    constructor(plugboard=null, x=width/2, y=100)
    {
        this.plugboard = plugboard;

        this.red = color(255, 0, 0);

        //0 is right most rotor
        //start as empty stack
        this.rotorStack = new RotorStack();

        //location of slot should be relative to left most rotor
        this.reflectorSlot = new ReflectorSlot(this.rotorStack);

        //create reflectors
        this.reflectors = [new Reflector(this.reflectorSlot), new Reflector(this.reflectorSlot)];
        this.reflectors[0].setToC();
        this.reflectors[1].setToB();

        //create rotors
        this.rotors = [new Rotor(this.rotorStack), new Rotor(this.rotorStack), new Rotor(this.rotorStack), new Rotor(this.rotorStack), new Rotor(this.rotorStack)];
        this.rotors[0].setToV();
        this.rotors[1].setToIV();
        this.rotors[2].setToIII();
        this.rotors[3].setToII();
        this.rotors[4].setToI();

        this.reflectorSlot.reflector = this.reflectors[1];
        this.rotorStack.rotors.push(this.rotors[4], this.rotors[3], this.rotors[2]);

        this.savedRotors = [];
        this.savedRings = [];

        this.saveRotors();
    }

    saveRotors()
    {
        this.savedRotors = [];
        this.savedRings = [];

        for(let i = 0; i < this.rotorStack.rotors.length; i++)
        {
            this.savedRotors[i] = this.rotorStack.rotors[i].translate;
            this.savedRings[i] = this.rotorStack.rotors[i].ring.ringSetting;
        }
    }

    loadRotors()
    {
        for(let i = 0; i < this.rotorStack.rotors.length; i++)
        {
            this.rotorStack.rotors[i].translate = this.savedRotors[i];
            this.rotorStack.rotors[i].ring.ringSetting = this.savedRings[i];
        }
    }

    cipher(inChar)
    {
        let out;

        if(inChar && this.rotorStack.rotors.length > 0 && this.reflectorSlot.reflector)
        {
            //let rotateNext = false;
            let notched = false;

            //has to be done from right to left
            for(let i = this.rotorStack.rotors.length-1; i > -1; i--)
            {
                let current = this.rotorStack.rotors[i].getPosition(this.rotorStack.rotors[i].translate);
                let notch = this.rotorStack.rotors[i].getPosition(this.rotorStack.rotors[i].notch);

                //right most motor always rotates or rotates when current rotor is at notch position or driven by previous rotor
                if(i == this.rotorStack.rotors.length-1 || current == notch || notched)
                {
                    this.rotorStack.rotors[i].rotateDown();
                }

                if(current ==  notch)
                {
                    notched = true;
                }
                else
                {
                    notched = false;
                }

            }

            //swaps 2 characters
            out = plugboard.cipher(inChar);

            //convert character into index
            let charCodeA = 'A'.charCodeAt();
            out = out.charCodeAt() - charCodeA;

            //cipher through rotors from right to left of the machine
            for(let i = this.rotorStack.rotors.length-1; i > -1; i--)
            {
                out = this.rotorStack.rotors[i].cipher(out);
            }

            //cipher through reflector
            out = this.reflectorSlot.reflector.cipher(out);

            //cipher through rotors from left to right of the machine
            for(let i = 0; i < this.rotorStack.rotors.length; i++)
            {
                out = this.rotorStack.rotors[i].cipher(out, false);
            }

            out = plugboard.cipher(String.fromCharCode(charCodeA + out));

            //outputText = "cipher " + inChar + " > " + out;
        }

        return out;
    }

    draw()
    {
        this.rotorStack.draw();
        this.reflectorSlot.draw();
    }
}