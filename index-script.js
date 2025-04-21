
const canvas = document.getElementById("top");
const ctx = canvas.getContext("2d");
OGX = 0;
X = 0;
loop()

function shade() {
    if (scrollY == 0) {
        document.getElementById("grass").classList.remove("shaded");
    } else {
        document.getElementById("grass").classList.add("shaded");
    }
    if (scrollY >= 0 && document.querySelector("body").classList.contains("shaded") != true) {
        document.querySelector("body").classList.add("shaded");
        document.querySelector("body").classList.add("over");
        scrollTo(0, 0);
        setTimeout(remove, 1000);
    }
}

function remove() {
    document.querySelector("body").classList.remove("over");
}

function loop() {
    ctx.clearRect(0, 0, 9999, 9999);
    ctx.fillStyle = "brown";
    spikes();
    ctx.fillStyle = "brown";
    ctx.fillRect(0, 0, canvas.width, canvas.height - 50);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, 96);
    OGX += 2;
    if (OGX >= 100) {
        OGX -= 100;
    }
    setTimeout(loop, 1000 / 30);
}

function spikes() {
    X = OGX;
    var increase = 0;
    ctx.beginPath();
    while (increase <= visualViewport.width + 150) { 
        ctx.moveTo(X - 50, canvas.height - 50);
        ctx.lineTo(X + 50, canvas.height - 50);
        ctx.lineTo(X, canvas.height);
        increase += 100;
        X += 100;
        if (X >= visualViewport.width + 150) {
            X -= (visualViewport.width + 150);
            OGX -= 100;
        }
    }
    ctx.fill();
}