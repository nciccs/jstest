class Ring
{
    constructor(rotor)
    {
        this.rotor = rotor;

        this.red = color(255, 0, 0);

        //this.displayColor = color(0, 0, 128);
        this.displayColor = this.red;
        //this.displayColor = 0;

        this.x;
        this.y;

        this.width = Ring.START_WIDTH;
        this.height = Ring.START_HEIGHT;

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        this.ringSetting = 0;
        
        this.length = 26;

        this.speed = 10;
        this.direction = 0;

        this.previousTime = Date.now() / 1000;
        this.startTime = this.previousTime;
        this.textY = 0;
        this.currentTime = 0;
    }

    get deltaTime()
    {
        return Date.now() / 1000 - this.previousTime;
    }

    get time()
    {
        return Date.now() / 1000 - this.startTime;
    }

    //static class variables   
    static get START_WIDTH()
    {
        return (this._START_WIDTH) ? this._START_WIDTH : 40;
    }

    static get START_HEIGHT()
    {
        return (this._START_HEIGHT) ? this._START_HEIGHT : 140;
    }
    
    static get deltaTime()
    {

    }

    getPosition(inOffset)
    {
        let position = inOffset % this.length;

        if(position < 0)
        {
            position = this.length + position;
        }

        return position;
    }

    setPosition(inPosition)
    {
        let rotate = false;

        if(typeof inPosition == "number")
        {
            this.ringSetting = this.getPosition(inPosition-1 );
            rotate = true;
        }
        else if(typeof inPosition == "string")
        {
            this.ringSetting = this.getPosition(inPosition.toUpperCase().charCodeAt() - 'A'.charCodeAt());
            rotate = true;
        }
        
        if(rotate)
        {
            this.rotor.translate = this.rotor.translate - this.ringSetting;
        }
    }

    rotateUp()
    {
        this.ringSetting--;

        this.direction = -1;
    }

    rotateDown()
    {
        this.ringSetting++;

        this.direction = 1;
    }

    draw()
    {
        push();

        this.topLeftX = this.x-this.width/2;
        this.topLeftY = this.y-this.height/2;

        //draw boundary rectangle
        stroke(0);
        fill(255);
        rect(this.topLeftX, this.topLeftY, this.width, this.height);

        //this.drawText();
        //this.drawText2();
        this.drawTextScaled();

        pop();

        this.previousTime = Date.now() / 1000;
    }

    //50.4 rpm
    drawText2()
    {
        push();

        fill(0);
//outputText = "delta time: " + this.deltaTime;
        let charCodeA ='A'.charCodeAt(0);
        let pos = this.getPosition(0);
        let letter = String.fromCharCode(charCodeA + pos);
        let formattedText = letter + String("0"+(pos+1)).slice(-2);

        let startY = this.topLeftY + this.height/2;
        let toY = startY + 1000;

        //this.currentTime += this.deltaTime / 100;

        //this.textY =  lerp(this.textY, height, constrain(this.currentTime, 0, 1));
        this.textY =  lerp(this.textY, height, constrain(this.time , 0, 1));

        text(formattedText, this.x, this.textY);

        pop();
    }

    drawTextScaled()
    {
        push();
        stroke(0);
        fill(0);

        let sizeText = 18;
        textAlign(CENTER, CENTER);
        textSize(sizeText);


        let totalChars = 26;
        let numLetters = totalChars / 2;
        let radius = this.height / 2;
        let angleBetween = 360 / totalChars;
        let angleAt = 90 - 360 / totalChars * 7;

        let relativeToOffset = this.rotor.translate + this.ringSetting + Math.floor(numLetters/2);
        let charCodeA ='A'.charCodeAt(0);

        for(let i = 0; i < numLetters; i++)
        {
            push();
            let cosRatioY = Math.cos(angleAt * Math.PI/180);
            let translateY = radius * cosRatioY;

            let pos = this.getPosition(relativeToOffset);
            let letter = String.fromCharCode(charCodeA + pos);
            let formattedText = letter + String("0"+(pos+1)).slice(-2);

            let y = this.y - translateY;

            // //translate origin
            translate(this.x, y);

            scale(1, 1.2-(Math.abs(translateY) / radius));
            //scale(1, 1-Math.abs(cosRatioY));
            translate(-this.x, -y);

            push();
            if(i == Math.floor(numLetters/2))
            {
                stroke(this.displayColor);
                fill(this.displayColor);
            }
            text(formattedText, this.x, y);
            pop();

            relativeToOffset--;
            angleAt -= angleBetween;
            pop();
        }



        pop();
    }

    drawText()
    {
        push();

        //fill(0);
        stroke(this.displayColor);
        fill(this.displayColor);

        let sizeText = 18;
        textSize(sizeText);
        //draw text
        let numLetters = 7;
        let relativeToOffset = this.rotor.translate + this.ringSetting + Math.floor(numLetters/2);
        let charCodeA ='A'.charCodeAt(0);

        let totalSpace = this.height - sizeText * numLetters;
        let spacing = totalSpace / (numLetters + 1);

        let startY = this.topLeftY + sizeText / 2 + spacing;

        for(let i = 0; i < numLetters; i++)
        {
            let pos = this.getPosition(relativeToOffset);
            let letter = String.fromCharCode(charCodeA + pos);

            let formattedText = letter + String("0"+(pos+1)).slice(-2);
            
            if(i == Math.floor(numLetters/2))
            {
                stroke(this.displayColor);
                fill(this.displayColor);
            }
            /*
            else
            {
                stroke(200);
                fill(200);
            }*/

            //text(formattedText, this.x, this.topLeftY + this.height / (numLetters+1) * (i+1));
            text(formattedText, this.x, startY + (sizeText+spacing)*i);
            relativeToOffset--;
        }

        pop();
    }
}