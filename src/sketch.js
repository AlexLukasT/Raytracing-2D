const angleDif = 5;  // degree
const numWalls = 3;
const noiseStrength = 0;
const maxNumMirroredRays = 100;  // prevent infinite creation of rays
let rays = [];
let mirroredRays = [];
let walls = [];
let source;

function setup() {
    createCanvas(1400, 700);
    frameRate(10);

    source = createVector(width / 2, height / 2);

    for (let angle = 0; angle < 360; angle += angleDif) {
        rays.push(new Ray(source.x, source.y, angle, false, null));
    }

    for (let i = 0; i < numWalls; i++) {
        const x1 = random(width);
        const x2 = random(width);
        const y1 = random(height);
        const y2 = random(height);
        walls.push(new Wall(x1, y1, x2, y2, random(0, 1) < 0.5));
    }

    walls.push(new Wall(0, 0, width, 0, false));  // top
    walls.push(new Wall(0, height, width, height, false));  // bottom
    walls.push(new Wall(0, 0, 0, height, false));  // left
    walls.push(new Wall(width, 0, width, height, false));  // right
}

function draw() {
    // set origin to bottom left
    translate(0, height);
    // make y increase instead of decrease
    scale(1, -1);
    
    background(80);

    for (let ray of rays.concat(mirroredRays)) {
        if (!ray.isFromMirror)
            ray.setStart(source);
        let closestPoint = createVector(Infinity, Infinity);
        let closesWallIndex = 0;
        for (let i = 0; i < walls.length; i++) {

            if (ray.originWall === walls[i])
                // dont let a ray originating from a mirror wall interact
                // with this wall
                continue

            const intersecPoint = ray.trace(walls[i]);
            if (intersecPoint && ray.distTo(intersecPoint) < ray.distTo(closestPoint)) {
                closestPoint = intersecPoint;
                closesWallIndex = i;
            }
        }
        if (walls[closesWallIndex].isMirror && rays.length < maxNumMirroredRays) {
            // wall is a mirror -> spawn a new ray
            mirroredRays.push(walls[closesWallIndex].getMirroredRay(ray, closestPoint));
        }
        ray.setEnd(closestPoint);
        ray.draw();
    }

    for (let wall of walls) {
        wall.draw();
    }
}

function mouseClicked() {
    source.x = mouseX;
    source.y = height - mouseY;
    mirroredRays = [];
}

