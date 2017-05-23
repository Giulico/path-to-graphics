import 'pixi.js';
import parse from 'parse-svg-path';
import normalize from 'normalize-svg-path';

class PathToGraphics {

    constructor(path) {
        this.path = normalize(parse(path));
        this.lastCoord = {
            x: 0,
            y: 0
        };
    }

    getGraphics() {
        console.log(this.path);
        this.path.forEach((path, pIndex) => {
            const [command, ...args] = path;

        });
    }

}

export default PathToGraphics;