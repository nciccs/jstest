class Plugboard
{
    constructor()
    {
        this.y = 400;
        this.spaceX = Plugboard.START_SPACE_X;
        this.spaceY = Plugboard.START_SPACE_Y;

        this.slots = [];
        let keys = KeyboardDisplay.layoutToKeys(["qwertyuiop",  "asdfghjkl", "zxcvbnm"], this.y, this.spaceX, this.spaceY);
        for(let i = 0; i < keys.length; i++)
        {
            this.slots.push(new PlugSlot(keys[i].c, keys[i].x, keys[i].y));
        }

        this.charSlotMap = {};
        this.initCharSlotMap();

        let cableColors = 
        [
            //apricot
            color(255, 215, 180),
            //magenta
            color(240, 50, 230),
            //purple
            color(145, 30, 180),
            //blue
            color(0, 130, 200),
            //cyan
            color(70, 240, 240),
            //teal
            color(0, 128, 128),
            //green
            color(60, 180, 75),
            //mint
            color(170, 255, 195),
            //lime
            color(210, 245, 60),
            //yellow
            color(255, 255, 25),
            //orange
            color(245, 130, 48),
            //brown
            color(170, 110, 40),
            //red
            color(230, 25, 75),
        ];

        this.plugs = [];

        for(let i = 0; i < 13; i++)
        {
            let y = this.y+2*Plugboard.START_SPACE_Y;
            let plug1 = new Plug(this, 75-13, y, cableColors[i]);
            let plug2  = new Plug(this, 125-13, y, cableColors[i]);
            //let plug1 = new Plug(this, 75+i-13, 550, cableColors[i]);
            //let plug2  = new Plug(this, 125+i-13, 550, cableColors[i]);
            //let plug1 = new Plug(this, 75-13, 550, cableColors[i]);
            //let plug2  = new Plug(this, 125-13, 550, cableColors[i]);

            plug1.toPlug = plug2;
            plug2.toPlug = plug1;

            this.plugs.push(plug1);
            this.plugs.push(plug2);
        }

        //plug that gets dragged by mouse
        this.plug;
    }

    static get START_SPACE_X()
    {
        return (this._START_SPACE_X) ? this._START_SPACE_X : 70;
    }

    static get START_SPACE_Y()
    {
        return (this._START_SPACE_Y) ? this._START_SPACE_Y : 60;
    }

    initCharSlotMap()
    {
        let charAt = 'A'.charCodeAt(0);

        for(let i = charAt; i < charAt+26; i++)
        {
            for(let j = 0; j < this.slots.length; j++)
            {
                if(this.slots[j].c == String.fromCharCode(i))
                {
                    this.charSlotMap[String.fromCharCode(i)] = this.slots[j];
                }
            }
        }
    }

    cipher(inChar)
    {
        let toChar;
        if(inChar != null)
        {
            let slot = this.charSlotMap[inChar.toUpperCase()];

            if(slot != null)
            {
                toChar = slot.c;

                //if there is plug
                if(slot.plug != null)
                {
                    let toSlot = slot.plug.toPlug.slot;
                    if(toSlot != null)
                    {
                        toChar = toSlot.c;
                    }
                }
            }
        }

        return toChar;
    }

    draw()
    {
        //draw the slots
        for(let i = 0; i < this.slots.length; i++)
        {
            this.slots[i].draw();
        }
    }

    findSlot(inX, inY)
    {
        let slot = null;
        let foundIndex = this.findSlotIndex(inX, inY);
        if(foundIndex > -1)
        {
            slot = this.slots[foundIndex];
        }
        return slot;
    }

    findSlotIndex(inX, inY)
    {
        let foundIndex = -1;
        let slots = this.slots;
        for(let i = 0; i < slots.length; i++)
        {
            if(dist(slots[i].x, slots[i].y, inX, inY) <= (slots[i].height/2))
            {
                foundIndex = i;
                i = slots.length;
            }
        }
        return foundIndex;
    }
}