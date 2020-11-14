class Wall {
    constructor(startX, startY, endX, endY, isMirror) {
        this.start = createVector(startX, startY);
        this.end = createVector(endX, endY);
        this.isMirror = isMirror;
    }

    getDir = () => {
        return this.end.copy().sub(this.start).normalize();
    }

    draw = () => {
        if (this.isMirror)
            stroke(112);
        else
            stroke(0);
        strokeWeight(5);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    getMirroredRay = (ray, intersecPoint) => {
        if (!this.isMirror)
            return;

        let dir = this.end.copy().sub(this.start);
        let ortToDir = createVector(dir.y, -dir.x).normalize();
        let angle = degrees(ray.dir.copy().reflect(ortToDir).heading());
        return new Ray(intersecPoint.x, intersecPoint.y, angle, true, this);
    }
}
