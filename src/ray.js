class Ray {
    constructor(posX, posY, angle, isFromMirror, originWall) {
        this.pos = createVector(posX, posY);
        this.dir = p5.Vector.fromAngle(radians(angle));
        this.scale = 30;
        this.isFromMirror = isFromMirror;
        this.originWall = originWall;
    }

    getEnd = () => {
        return this.pos.copy().add(this.dir.copy().mult(this.scale));
    }

    draw = () => {
        if (this.isFromMirror)
            stroke(0, 0, 255)
        else
            stroke(255);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.getEnd().x, this.getEnd().y);
    }

    trace = (wall) => {
        // see Wikipedia: line intersection
        let x1 = this.pos.x;
        let y1 = this.pos.y;
        let x2 = this.getEnd().x;
        let y2 = this.getEnd().y;

        let x3 = wall.start.x;
        let y3 = wall.start.y;
        let x4 = wall.end.x;
        let y4 = wall.end.y;

        let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (denom === 0) {
            // ray and wall are parallel
            return;
        }

        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

        if (u < 0 | u > 1) {
            // the intersection point lies outside of the wall segment
            return;
        }

        if (t < 0) {
            // the intersection points lies in the opposite direction of the ray
            return;
        }

        let intersecPoint = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
        return intersecPoint;
    }

    setStart = vec => {
        this.pos.x = vec.x;
        this.pos.y = vec.y;
    }

    setEnd = vec => {
        // scale the direction such that the end point is equal to the desired point
        const dist = this.distTo(vec);
        if (dist == Infinity)
            return
        this.scale = this.distTo(vec);
    }

    distTo = vec => {
        return dist(this.pos.x, this.pos.y, vec.x, vec.y);
    }
}
