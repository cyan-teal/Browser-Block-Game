//Set up for the game.
const can = document.querySelector("canvas");
const ctx = can.getContext("2d");
//Don't mind the variable names; they make no sense.
let pX; //Placed-things: X-positions
let pY; //Placed-thigs: Y-positions
let pT; //Placed-things: Block-type
let num; //Tracks the previous array lengths
let oX; // Player X-position
//let and; //Unused
let oY; //Player Y-position
let oXv; //X-velocity
let oYv; //Y-velocity
let lastUpdate = Date.now(); //Last recorded frame
let D = 100;  //Delta-Time
let cur; //Current:
let floor; //Floor, as in the mathematical operator
let spec;
let net = 1; //Dictates which blocks the Player places
let g;
const orange = 250 //Player-range

//Buttons. e.g. W,A,S;D.
let a = 0;
let dk = 0;
let w = 0;
let s = 0;
//Mouse-positions:
let X;
let Y;

redo();
document.querySelector("h3").addEventListener("click", notify);
window.addEventListener("resize", redo);
window.addEventListener("keydown", lower);
window.addEventListener("keyup", high);
window.addEventListener("mousedown", fix)
window.addEventListener("mouseup", repair)
window.addEventListener("mousemove", shift);
requestAnimationFrame(loop);

//Tells Player controls.
function notify() {
    alert("WASD / Arrows to move, mouse to build, and Space to cycle blocks.");
}

//Handle actions following the mouse going down.
function fix() {
    s = 1;
    document.querySelector("canvas").style.cursor = "copy";
}

//Same as previous but for release and not as important.
function repair() {
    s = 0;
    document.querySelector("canvas").style.cursor = "grab";
}

//Update variables for mouse position on movement.
function shift() {
    X = Math.round((event.clientX - 25) / 50) * 50;
    Y = Math.round((event.clientY - 25) / 50) * 50;
}

//Says when a key's to be held.
function lower() {
    let it = event.key;
    if (it == "a" || it == "ArrowLeft") {
        a = 1;
    } else if (it == "q") {
        //For testing:
        alert(pX);
        alert(pY);
        alert(pT);
    } else if (it == "d" || it == "ArrowRight") {
        dk = 1;
    } else if (it == "w" || it == "ArrowUp") {
        //and = setInterval(w ++, 0);
        w = 20;
    } else if (it == " ") {
        net = (net + 1) % 5;
    } else if (it == "z") {
        alert(1000 / D);
    } else if (it == "s" || it == "ArrowDown") {
        X = Math.floor((oX + 17.5) / 50) * 50;
        Y = Math.floor((oY + 105) / 50) * 50;
        spec = "true";
        s = 1;
    }
}

//Says when a key's no longer held.
function high() {
    let it = event.key;
    if (it == "a" || it == "ArrowLeft") {
        a = 0;
    } else if (it == "d" || it == "ArrowRight") {
        dk = 0;
    } else if (it == "w" || it == "ArrowUp") {
        //clearInterval(and);
        w = 0;
    } else if (it == "s" || it == "ArrowDown") {
        spec = "false";
        s = 0;
    }
}

//Generates a new map.
function creation() {
    let ran = Math.round(((can.height - 25) / 1.5) / 50) * 50;
    for (let v = 0; v * 50 <= can.width; v++) {
        ran += Math.round((Math.random() - 0.5) * 2) * 50;
        for (let h = ran / 50; h * 50 <= can.height; h++) {
            place(v * 50, h * 50, 4);
        }
}}

//Reloads the game when called.
function redo() {
    can.width = Math.floor(visualViewport.width / 50) * 50;
    can.height = Math.floor(visualViewport.height / 50) * 50 - clamp(36, visualViewport.width / 20, 108);
    pX = [];
    pY = [];
    pT = [];
    num = 0;
    oXv = 0;
    oYv = 0;
    oX = (can.width - 35) / 2;
    oY = -80;
    creation();
}

//Mimics the CSS "clamp" feature so the canvas can fit atop other things.
function clamp(int, down, up) {
    return Math.min(Math.max(int, down), up);
}

//Main-game-loop; calls all other functions to do stuff.
function loop() {
    let now = Date.now();
    D = now - lastUpdate; //Important: Delta.
    lastUpdate = now;

    //document.querySelector("label").textContent = 1000 / D;
    /*^^ FPS displayer; found out the game works considerably worse below 45-60fps(notably jumping and collisions).
    The game is difficult to play while battery-saver's on, as battery saver caps refresh rate of JS canvas to 30fps
    And the "requestAnimationFrame()"(see below.) in the main game loop's linked to the refresh rate. 
    
    I also can't switch to an alternative like "set- Interval/Timeout -()",
    as them being unsynced with the display rate messes with Delta*/

    //^^ Yapping(Unimportant).
    
    con(); //- Controls
    col(); //- Collisions
    pos(); //- Positioning
    make(); //- Making
    let abc
    if (net == 0) {
        abc = "Air";
    } else if (net == 1) {
        abc = "Planks";
    } else if (net == 2) {
        abc = "Glass";
    } else if (net == 3) {
        abc = "Sand";
    } else {
        abc = "Grass"
    }
    document.getElementById("block").textContent = abc;
    requestAnimationFrame(loop);
}

//Interprets controls
function con() {
    if (a == 1) {
        oXv -= .1 * D;
    }
    if (dk == 1) {
        oXv += .1 * D;
    }
    if (s == 1 && dist() <= orange) {
            place(X, Y, net);
    }
    if (w >= 10 && floor >= 1) {
        oYv = -1.25 * D;
        //w = 0;
}}

//Return the current distance between player and cursor.
function dist() {
    return Math.sqrt(Math.pow(X - oX, 2) + Math.pow(Y - oY, 2));//- Complicated maths; I searched up the formula
}

//Following 2 functions used for positioning blocks based off mouse position(variables X and Y).

//This 1
function checkB() {
    if (Y >= oY + 65) {
        return 65;
    } else if (Y >= oY + 40) {
        return 25;
    } else if (Y <= oY - 65) {
        return -65;
    } else if (Y <= oY - 40) {
        return -25;
    } else {
        return 0;
}}

//This 1, 2
function checkA() {
    if (X >= oX + 17.5) {
        return 42.5;
    } else if (X <= oX - 17.5) {
        return -42.5;
    } else {
        return 0;
}}

//Used for adding new blocks.
function place(X, Y, T) {
    let skip = "no";
    for (let i = 0; i <= pT.length; i++) { /*The For loops just repeat 1 for each thing in something. This cases thing is: "pT.lenght".
                                            e.g. if the array "pT" has N things in it, this will loop N times.*/
            if (pX[i] == Math.floor(X) && pY[i] == Math.floor(Y)) {
                if (pT[i] != 0 && T != 0) {
                    skip = "stillno" //I actually have no idea how this works; I just made it.
                } else {
                    skip = i; //Decides to skip placements if theirs already something there(except air).
            }}
        }
        if (skip == "no") {
            pX[num] = Math.floor(X);
            pY[num] = Math.floor(Y);
            pT[num] = Math.floor(T);
            num ++;
        } else if (skip != "stillno") {
            pX[skip] = Math.floor(X);
            pY[skip] = Math.floor(Y);
            pT[skip] = Math.floor(T);
            /*pX.splice(skip, 1);
            pY.splice(skip, 1);
            pT.splice(skip, 1);*/
            //num = skip;
            //^^.
    }}


//Draws what's happening onto the "canvas" element.
function make() {
    ctx.clearRect(0, 0, can.width, can.height);

    /*ctx.fillStyle = "red";
    ctx.fillRect(oX, oY, 35, 80);*/
    //^^ Player hit-box(used for testing).

    ctx.fillStyle = "#0eaeae";
    ctx.fillRect(oX - 8.75, oY + 10, 52.5, 40);
    ctx.fillStyle = "#a97d64";
    ctx.fillRect(oX + 5, oY - 15, 25, 25);
    ctx.fillRect(oX - 8.75, oY + 20, 12.5, 30);
    ctx.fillRect(oX + 30, oY + 20, 12.5, 30);
    ctx.fillStyle = "#5C4033";
    ctx.fillRect(oX + 5, oY - 15, 25, 10);
    ctx.fillStyle = "#494697";
    ctx.fillRect(oX + 5, oY + 50, 25, 30);

    for (let i = 0; i < num; i++) {
        if (pT[i] == 4) { //Grass blocks
            ctx.fillStyle = "rgb(158, 32, 21)";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "rgb(31, 184, 58)";
            ctx.fillRect(pX[i], pY[i], 50, 15);
        } else if (pT[i] == 1) { //Oak planks
            ctx.fillStyle = "sandybrown";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "saddlebrown";
            ctx.fillRect(pX[i], pY[i] + 7.5, 50, 5);
            ctx.fillRect(pX[i], pY[i] + 22.5, 50, 5);
            ctx.fillRect(pX[i], pY[i] + 37.5, 50, 5);
        } else if (pT[i] == 2) { //Glass blocks
            ctx.fillStyle = "rgba(205, 200, 220, 0.55)";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "white";
            ctx.fillRect(pX[i], pY[i] + 7.5, 50, 0.75);
            ctx.fillRect(pX[i], pY[i] + 22.5, 50, 0.75);
            ctx.fillRect(pX[i], pY[i] + 37.5, 50, 0.75);
        } else if (pT[i] == 3) { //Sand
            if (fall(pX[i], pY[i]) == "good") {

                pY[i] += 50; 
            }
            ctx.fillStyle = "#fae8b4";
            ctx.fillRect(pX[i], pY[i], 50, 50);
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.fillRect(pX[i], pY[i] + 5, 50, 2.75);
            ctx.fillRect(pX[i], pY[i] + 17.5, 50, 7.5);
            ctx.fillRect(pX[i], pY[i] + 35, 50, 15);
        }
        if (pT[i] != 0 && pT[i] != 2) {
            ctx.strokeStyle = "black"; //Outline
            ctx.lineWidth = "1";
            ctx.strokeRect(pX[i], pY[i], 50, 50);

            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            ctx.fillRect(pX[i], pY[i], 50, can.height);
            ctx.globalCompositeOperation = "source-over";
}}

    let a = checkA() + 17.5;
    let b = checkB() + 40;
    ctx.lineWidth = "2";
    ctx.strokeStyle = "white";
    if (net != 0) {
        if (dist() <= orange) {

            for (let i = 0; i < num; i++) {
                if (pX[i] == Math.floor(X) && pY[i] == Math.floor(Y) && pT[i] != 0) {
                    ctx.strokeStyle = "red";
                    break;
                }
            }
        } else {
            ctx.strokeStyle = "red";
    }} else {
        if (dist() >= orange) {ctx.strokeStyle = "red";}
    }
    ctx.strokeRect(X, Y, 50, 50);
}

//Checks then triggers falling-sand.
function fall(C, U) {
    for (let x = 0; x < num; x ++) {
        if (C == pX[x] && U == pY[x] - 50 && pT[x] != 0) {
            return "no";
    }}
    let p = Math.round(Math.random() - 0.00033 * D)
    if (p == 1) {
    return "good";
}}

//Positioning/Movement for the player.
function pos() {
    if (oYv != 0) {
        oYv *= 0.85;
    }
    if (oXv != 0) {
        oXv *= 0.85;
    }
    if (floor == 1) {
        oY -= 1;
        if (oYv >= 0) {
            oYv = 0;
        }
    } else {
        oYv += .075 * D;
    }
    oX += oXv;
    oY += oYv;
    if (oY >= can.height) {
        redo();
    }
}

//Standardises positions onto the grid for checking(C stands for correct).
function C(method, offput) {
    return Math.floor((method + offput) / 50) * 50;
}


//Defines collisions for the player.
function col() {
    let hey = "k";
    //Translates Player positions onto the grid too, To match.
    let okX = Math.floor((oX) / 50) * 50;
    let okX2 = Math.floor((oX + 35) / 50) * 50;
    let okY = Math.floor((oY + 105) / 50) * 50;
    let okY2 = Math.floor((oY + 80) / 50) * 50;
    for (let i = 0; i <= pT.length; i++) {
        if (pT[i] != 0) {
            //Floor and ceiling collisions.
            if (pY[i] <= C(oY, 80) && pY[i] >= C(oY, 105) && pX[i] >= C(oX, 10) && pX[i] <= C(oX, 25)) {
                hey = "nok";
                floor = 1;
            } else if (hey == "k") {
                floor -= 1 * D;
            }
            if (pY[i] >= C(oY, -10) && pY[i] <= C(oY, 25) && pX[i] >= C(oX, 10) && pX[i] <= C(oX, 25)) {
                oYv = 0;
                oY ++;
            }

            //Wall collisions.
            if (pY[i] <= C(oY, 75) && pY[i] >= C(oY, 15) && floor != 10 && pX[i] >= C(oX, 35) && pX[i] <= C(oX, 35)) {
                    oXv = 0;
                    oX --;
            }
            if (pY[i] <= C(oY, 75) && pY[i] >= C(oY, 15) && floor != 10 && pX[i] >= C(oX, 0) && pX[i] <= C(oX, -35)) {
                oXv = 0;
                oX ++;
}}}}