var gridScale = 50;

var bounds   = [ [-5, 5], [-5, 5] ]
var fx       = '2 - x/2';
var fxBounds = [ 0, 4 ];
var subdivs  = 20;

var font = null;

function preload()
{
    font = loadFont("font/Roboto-Regular.ttf");
}


function setup() 
{
    background(100)
    createCanvas(
        (Math.abs(bounds[0][0]) + Math.abs(bounds[0][1])) * gridScale,
        (Math.abs(bounds[1][0]) + Math.abs(bounds[1][1])) * gridScale,
        WEBGL
    )
}

function draw()
{
    rotateY((PI/180) * 50);
    drawGrid();
    
    
    drawFunction(fx, 'rgba(255, 0, 0, 1)'); 

    rotateX(millis() / 2000);

    drawFunctionStrips(fx);
}

function updateFunc()
{
    fx = document.getElementById('fx_input').value;
    fxBounds[0] = parseInt(document.getElementById('lowBound_input').value);
    fxBounds[1] = parseInt(document.getElementById('highBound_input').value);
    background(255);
}

function mouseDragged()
{
    background(255)
    orbitControl();
}

///

function evalFunc(fx, x)
{
    return eval(fx.replace('x', x))
}

function drawGrid()
{

    fill('rgb(0,0,0)');
    textFont(font, 14);
    stroke('rgba(0, 0, 0, 0.15');
    
    for (let x = bounds[0][0]; x <= bounds[0][1]; x += 1)
    {
        let screenX = gridScale * x;
        
        // line(screenX, -height/2, screenX, height/2);
        text(x, screenX+2, 14);
    }
    for (let y = bounds[1][0]; y < bounds[1][1]; y += 1)
    {
        let screenY = gridScale * y;
        
        // line(-height/2, screenY, width/2, screenY);
        text(y, 2, screenY+14);
    }

    stroke('rgba(0, 0, 0, 0.5)');
    line(width/2, 0, width/2, height);
    line(0, height/2, width, height/2);
}

function drawFunction(func, color, subdiv=4)
{
    stroke(color);

    let lastPoint;
    for (let x = bounds[0][0]; x <= bounds[0][1]; x += 1/subdiv)
    {
        let y           = evalFunc(func, x);
        let screenPoint = [x * gridScale, -y * gridScale];

        if (lastPoint)
        {
            line(lastPoint[0], lastPoint[1], screenPoint[0], screenPoint[1]);
        }
        
        lastPoint = screenPoint;
    }
}

function drawFunctionStrips(func, dxSize=1, color='rgba(0, 0, 115, 1)')
{
    stroke(color);
    fill(color);

    let end = false;
    for(let x = fxBounds[0]; x <= fxBounds[1]; x += dxSize)
    {
        let y = evalFunc(func, x);

        let functionPoint  = [x *gridScale, -y * gridScale];
        let axisPoint      = [x *gridScale, -0 * gridScale];

        if (end)
        {
            vertex(functionPoint[0], functionPoint[1]);
            vertex(axisPoint[0],     axisPoint[1]);

            endShape();
            end=false;
        }
        
        beginShape();
        vertex(axisPoint[0],     axisPoint[1]);
        vertex(functionPoint[0], functionPoint[1]);

        end = true;
    }
}