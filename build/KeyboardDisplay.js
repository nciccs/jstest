class KeyboardDisplay
{
    constructor()
    {
        this.keyRadius = 25;
        this.textSizeNum = 30;

        //this.y = 280;
        this.y = 230;
        this.spaceX = 70;
        this.spaceY = 55;

        this.lightColor = color(255, 204, 0);
        this.lightKey = '';
        
        this.pressedColor = color(0, 255, 255);
        this.pressedKey = '';

        this.keys = KeyboardDisplay.layoutToKeys(["qwertyuiop",  "asdfghjkl", "zxcvbnm"], this.y, this.spaceX, this.spaceY);
    }

    setY(y)
    {
        this.y = y;
        this.keys = KeyboardDisplay.layoutToKeys(["qwertyuiop",  "asdfghjkl", "zxcvbnm"], this.y, this.spaceX, this.spaceY);
    }

    static layoutToKeys(keyLayout, inY, SpaceX, spaceY)
    {
        let keys = [];

        let yAt = inY;
        for(let row = 0; row < keyLayout.length; row++)
        {
            let xAt = (width - SpaceX * (keyLayout[row].length - 1)) / 2;

            for(let i = 0; i < keyLayout[row].length; i++)
            {
                keys.push(new EniKey(keyLayout[row].charAt(i).toUpperCase() , xAt, yAt));

                xAt += SpaceX; 
            }

            yAt += spaceY;
        }

        return keys;
    }

    keyPressed()
    {
        if(key.length == 1 && key.match(/^[a-zA-Z]+$/))
        {
            //keyboardDisplay.lightKey = key;
            keyboardDisplay.pressedKey = key;
            //keyboardDisplay.lightKey = key;
        }
        else
        {
            //alert("not valid");
        }
    }
    
    mousePressed()
    {
        let key = this.getKey(mouseX, mouseY);

        if(key.length == 1 && key.match(/^[a-zA-Z]+$/))
        {

            this.pressedKey = key;
        }
        return key;
    }

    getKey(inMouseX, inMouseY)
    {
        let key = '';

        let widget = WidgetHandler.findByMouse(inMouseX, inMouseY);

        for(let i = 0; i < this.keys.length; i++)
        {
            if(dist(this.keys[i].x, this.keys[i].y, inMouseX, inMouseY) <= this.keyRadius && widget == null)
            {
                key = this.keys[i].c;
            }
        }

        return key;
    }

    draw()
    {        
        for(let i = 0; i < this.keys.length; i++)
        {
            this.drawKey(this.keys[i].c, this.keys[i].x, this.keys[i].y);
        }
    }

    drawKey(character, centerX, centerY)
    {
        fill(255);

        if(character == this.pressedKey.toUpperCase())
        {
            fill(this.pressedColor);
        }

        if(character == this.lightKey.toUpperCase())
        {
            fill(this.lightColor);
        }

        ellipse(centerX, centerY , this.keyRadius*2, this.keyRadius*2);

        fill(0);
        textAlign(CENTER, CENTER);
        textSize(this.textSizeNum);
        text(character, centerX, centerY);
    }
}