var outputText = '';

var keyboardDisplay; 
var plugboard;

//var topDrawObject;

var input;
var output;

function setup()
{
    frameRate(30);
    // put setup code here
    //createCanvas(800, 600);
    //createCanvas(960, 720);
    createCanvas(1152, 648);
    //createCanvas(windowWidth, windowHeight);

    keyboardDisplay = new KeyboardDisplay();
    plugboard = new Plugboard();
    engine = new Engine(plugboard);

    createForm();
}

function createForm()
{
    input = createInput();
    input.id('plaintext');
    input.size(width/1.7, input.height);
    input.style('font-size', '20px');
    input.style('text-transform', 'uppercase');
    input.position(width/2-input.width/2, plugboard.y+plugboard.spaceY*2+PlugSlot.START_HEIGHT/2 + 16);
    input.attribute('placeholder', 'Plaintext');
    input.attribute('type', 'text');
    input.style('background','rgba(255, 255, 255, 0.75)');
    input.style('font-family', 'monospace');
    input.attribute('value', '')
    //input.style('background','rgba(255, 255, 255, 128)');
    //input.attribute('autofocus','');
    //input.attribute('onblur','this.focus()');

    input.input(inputEvent);
    //input.attribute('onkeypress', 'inputEvent()');
    //input.attribute('onkeydown', 'inputEvent()');
    //input.attribute('onpaste', 'pasteEvent()');
    //input.attribute('oninput', 'inputEvent()');

    //input.changed(inputEvent);
    // let inputLabel = createElement('label', 'Plaintext');
    // inputLabel.style('font-size', '23px');
    // inputLabel.position(input.x-inputLabel.width-30, input.y);


    //input.attribute('onpaste', 'pasteEvent()');


    output = createInput();
    output.id('ciphertext');
    output.size(width/1.7, output.height);
    output.style('font-size', '20px');
    output.style('text-transform', 'uppercase');
    output.position(input.x, input.y+input.height + 10);
    output.attribute('placeholder', 'Ciphertext');
    input.attribute('type', 'text');

    output.attribute('disabled', 'disabled');
    output.style('background', 'rgba(221, 221, 221, 0.75)');

    output.style('font-family', 'monospace');
    //output.attribute('readonly', 'readonly');
    //output.style('background', '#dddddd');
    //output.value('testing testing');

    // let outputLabel = createElement('label', 'Ciphertext');
    // outputLabel.style('font-size', '23px');
    // outputLabel.position(output.x-outputLabel.width-35, output.y);
}

function pasteEvent()
{
    alert("paste");
}

function inputEvent()
{
    engine.loadRotors();

    let outputValue = '';

    for(let i = 0; i < input.value().length; i++)
    {
        if(/^[a-zA-Z]+$/.test(input.value()[i]))
        {
            let result = engine.cipher(input.value()[i])
            if(result)
            {
                if(i == input.value().length-1)
                {
                    keyboardDisplay.lightKey = result;
                }

                outputValue += result;
            }
        }
    }

    output.value(outputValue);
}

function windowResized()
{
    //resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
    push();

    background(200);

    keyboardDisplay.draw();
   
    plugboard.draw();

    engine.draw();

    WidgetHandler.draw();

    if(outputText && outputText.length > 0)
    {
        //debug only
        textAlign(LEFT, BASELINE);
        fill(0);
        stroke(0);
        text("debug: " + outputText, 5 , 20);
    }

    pop();
}

function keyPressed()
{
    keyboardDisplay.keyPressed();

    if(document.activeElement.tagName != "INPUT" && !keyIsDown(CONTROL))
    {
        let result = engine.cipher(keyboardDisplay.pressedKey)
        if(result)
        {
if(document.getElementById('plaintext').value)
{
    alert("document.getElementById('plaintext') != null");
}
else
{
    alert("document.getElementById('plaintext') == null");
}

            document.getElementById('plaintext').value = document.getElementById('plaintext').value + keyboardDisplay.pressedKey;

            //document.getElementsByTagName('INPUT')[0].value = document.getElementsByTagName('INPUT')[0].value + keyboardDisplay.pressedKey;
            //input.attribute('value', input.attribute('value')+keyboardDisplay.pressedKey);
            //input.attribute('value',  input.attribute('value') + keyboardDisplay.pressedKey);

            //input.value(input.value()+keyboardDisplay.pressedKey);
            inputEvent();
            keyboardDisplay.lightKey = result;
        }
    }

    keyboardDisplay.pressedKey = '';
}


function keyReleased()
{
    keyboardDisplay.lightKey = '';
    keyboardDisplay.pressedKey = '';
}


function mousePressed()
{
    keyboardDisplay.mousePressed();

    if(keyboardDisplay.pressedKey)
    {
        let result = engine.cipher(keyboardDisplay.pressedKey)
        if(result != null)
        {
            keyboardDisplay.lightKey = result;
        }

        keyboardDisplay.pressedKey = '';
    }

    WidgetHandler.mousePressed();
}

function mouseReleased()
{
    keyboardDisplay.lightKey = '';
    keyboardDisplay.pressedKey = '';   
 
    let toSave = false;
    if(!WidgetHandler.isDragging && WidgetHandler.holding instanceof Rotor && WidgetHandler.holding.collideRotorStack())
    {
        toSave = true;
    }

    WidgetHandler.mouseReleased();

    if(toSave)
    {
        engine.saveRotors();
    }
}

function mouseDragged()
{
    WidgetHandler.mouseDragged();
}
