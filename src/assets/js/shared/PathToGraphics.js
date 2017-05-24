import 'pixi.js';
import parse from 'svg-path-parser';
// import normalize from 'normalize-svg-path';

type Settings = {
    fill: number
};

type Coords = {
    x?: number,
    y?: number,
    x1?: number,
    x2?: number,
    y1?: number,
    y2?: number,
};

class PathToGraphics {

    path: Array<Object>;
    settings: Settings;
    lastCoords: Coords;
    firstCoords: Coords;
    firstClose: boolean;
    graphics: Object;

    defaultSettings = {
        fill: 0x000000
    }

    static getCommandAPI(commandType: string): string {

        const commandAPI = {
            m: 'moveTo',
            l: 'lineTo',
            v: 'lineTo',
            h: 'lineTo',
            c: 'bezierCurveTo',
            s: 'bezierCurveTo',
            z: 'moveTo'
        };

        const lowerCommandType = commandType.toLowerCase();
        return commandAPI[lowerCommandType] ? commandAPI[lowerCommandType] : '';

    }

    constructor(path: string, settings: Object) {
        this.path = parse(path);
        this.settings = Object.assign(this.defaultSettings, settings);
        this.lastCoords = {
            x: 0,
            y: 0
        };
        this.lastControl = {
            x: 0,
            y: 0
        };
        this.firstClose = true;
        this.firstCoords = {};
        this.graphics = new PIXI.Graphics(); // eslint-disable-line no-undef
    }

    getGraphics() {

        this.graphics.beginFill(this.settings.fill);

        this.path.forEach(path => {
            const {code, command, relative, ...args} = path;
            const commandAPI = PathToGraphics.getCommandAPI(code);

            this.drawPath(code, relative, args);

            if (commandAPI.length === 0) {
                throw new Error('commandAPI is empty', command);
            }
        });

        this.graphics.endFill();

        return this.graphics;
    }

    drawPath(commandType: string, relative: boolean, args: Coords) {

        const params = {

            m: () => {
                const coords = {
                    x: relative ? args.x + this.lastCoords.x : args.x,
                    y: relative ? args.y + this.lastCoords.y : args.y
                };

                this.graphics.moveTo(
                    coords.x,
                    coords.y
                );

                Object.assign(this.lastCoords, coords);

                // first coords
                if (typeof this.firstCoords.x === 'undefined') {
                    Object.assign(this.firstCoords, coords);
                }
            },

            l: () => {
                const coords = {
                    x: relative ? args.x + this.lastCoords.x : args.x,
                    y: relative ? args.y + this.lastCoords.y : args.y
                };

                this.graphics.lineTo(
                    coords.x,
                    coords.y
                );

                Object.assign(this.lastCoords, coords);
            },

            v: () => {
                const coords = {
                    x: this.lastCoords.x,
                    y: args.y
                };

                this.graphics.lineTo(
                    coords.x,
                    coords.y
                );

                Object.assign(this.lastCoords, coords);
            },

            h: () => {
                const coords = {
                    x: args.x,
                    y: this.lastCoords.y
                };

                this.graphics.lineTo(
                    coords.x,
                    coords.y
                );

                Object.assign(this.lastCoords, coords);
            },

            c: () => {
                const coords = {
                    x1: relative ? args.x1 + this.lastCoords.x : args.x1,
                    y1: relative ? args.y1 + this.lastCoords.y : args.y1,
                    x2: relative ? args.x2 + this.lastCoords.x : args.x2,
                    y2: relative ? args.y2 + this.lastCoords.y : args.y2,
                    x: relative ? args.x + this.lastCoords.x : args.x, // destination point
                    y: relative ? args.y + this.lastCoords.y : args.y // destination point
                };

                this.graphics.bezierCurveTo(
                    coords.x1,
                    coords.y1,
                    coords.x2,
                    coords.y2,
                    coords.x,
                    coords.y
                );

                Object.assign(this.lastCoords, {
                    x: coords.x,
                    y: coords.y
                });

                Object.assign(this.lastControl, {
                    x: coords.x2,
                    y: coords.y2
                });
            },

            s: () => {
                const coords = {
                    x1: (this.lastCoords.x * 2) - this.lastControl.x,
                    y1: (this.lastCoords.y * 2) - this.lastControl.y,
                    x2: relative ? args.x2 + this.lastCoords.x : args.x2,
                    y2: relative ? args.y2 + this.lastCoords.y : args.y2,
                    x: relative ? args.x + this.lastCoords.x : args.x, // destination point
                    y: relative ? args.y + this.lastCoords.y : args.y // destination point
                };

                this.graphics.bezierCurveTo(
                    coords.x1,
                    coords.y1,
                    coords.x2,
                    coords.y2,
                    coords.x,
                    coords.y
                );

                Object.assign(this.lastCoords, {
                    x: coords.x,
                    y: coords.y
                });

                Object.assign(this.lastControl, {
                    x: coords.x2,
                    y: coords.y2
                });

            },

            z: () => {
                const coords = Object.assign({}, this.firstCoords);

                this.graphics
                    .closePath();

                if (!this.firstClose) {
                    console.log('its not the first close');
                    this.graphics.addHole();
                }

                Object.assign(this.lastCoords, coords);
                this.firstClose = false;
            }

        };

        const commandTypeLower = commandType.toLowerCase();

        if (params[commandTypeLower]) {
            params[commandTypeLower]();
        } else {
            console.log('Parameter not found!');
        }

    }

}

export default PathToGraphics;