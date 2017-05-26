import 'pixi.js';

const rangeConversion = (oldValue, oldMin, oldMax, newMin, newMax) =>
    (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

type Settings = {
    fill: number,
    viewBoxWidth: number,
    viewBoxHeight: number,
    min: number,
    max: number
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

    path: Array<string>;
    settings: Settings;
    lastCoords: Coords;
    lastControl: Coords;
    firstCoords: Coords;
    firstClose: boolean;
    graphics: Object;

    defaultSettings = {
        fill: 0x000000,
        normalize: false
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
        this.path = path.match(/[a-df-z][^a-df-z]*/ig);
        this.settings = Object.assign(this.defaultSettings, settings);
        this.lastCoords = {x: 0, y: 0};
        this.lastControl = {};
        this.firstClose = true;
        this.firstCoords = {};
        this.graphics = new PIXI.Graphics(); // eslint-disable-line no-undef
    }

    getGraphics() {

        this.graphics.beginFill(this.settings.fill);

        this.path.forEach(path => {

            const commandType = path[0];
            const args = path.slice(1).trim().split(/[\s,]+|(?=\s?[+\-])/);

            this.drawPath(commandType, args);

            if (typeof path !== 'string' || path.length === 0) {
                throw new Error('path is not a valid path', path);
            }

        });

        this.graphics.endFill();

        return this.graphics;
    }

    drawPath(commandType: string, args: Array<string>) {

        const coords = args.map((arg: string, i: number) => {
            let c = Number.parseFloat(arg);

            if (this.settings.normalize && (typeof this.settings.viewBoxWidth === 'undefined'
                    || typeof this.settings.viewBoxHeight === 'undefined'
                    || typeof this.settings.min === 'undefined'
                    || typeof this.settings.max === 'undefined')) {
                throw new Error('If you want to normalize the path, please specify the viewBoxWidth, viewBoxHeight, min and max settings.');
            }

            if (this.settings.normalize) {
                c = i % 2 === 0
                    ? Math.round(rangeConversion(c, 0, this.settings.viewBoxWidth, this.settings.min, this.settings.max))
                    : Math.round(rangeConversion(c, 0, this.settings.viewBoxHeight, this.settings.min, this.settings.max));
            }

            return c;
        });

        let offset = {
            x: 0,
            y: 0
        };
        if (commandType === commandType.toLowerCase()) {
            // Relative positions
            offset = this.lastCoords;
        }

        const params = {

            m: () => {
                coords[0] += offset.x;
                coords[1] += offset.y;

                this.graphics.moveTo(
                    coords[0],
                    coords[1]
                );

                this.lastCoords = {
                    x: coords[0],
                    y: coords[1]
                };

                // first coords
                if (!this.firstCoords.x) {
                    this.firstCoords = {
                        x: coords[0],
                        y: coords[1]
                    };
                }
            },

            l: () => {
                coords[0] += offset.x;
                coords[1] += offset.y;

                this.graphics.lineTo(
                    coords[0],
                    coords[1]
                );

                this.lastCoords = {
                    x: coords[0],
                    y: coords[1]
                };
            },

            v: () => {
                coords[0] += offset.y;

                this.graphics.lineTo(
                    this.lastCoords.x,
                    coords[0]
                );

                this.lastCoords.y = coords[0];
            },

            h: () => {
                coords[0] += offset.x;

                this.graphics.lineTo(
                    coords[0],
                    this.lastCoords.y
                );

                this.lastCoords.x = coords[0];
            },

            c: () => {
                for (let i = 0, l = coords.length; i < l; i += 2) {
                    coords[i] += offset.x;
                    coords[i + 1] += offset.y;
                }

                this.graphics.bezierCurveTo(
                    coords[0],
                    coords[1],
                    coords[2],
                    coords[3],
                    coords[4],
                    coords[5]
                );

                this.lastCoords = {
                    x: coords[4],
                    y: coords[5]
                };

                this.lastControl = {
                    x: coords[2],
                    y: coords[3]
                };
            },

            s: () => {
                for (let i = 0, l = coords.length; i < l; i += 2) {
                    coords[i] += offset.x;
                    coords[i + 1] += offset.y;
                }

                const sX = (this.lastCoords.x * 2) - this.lastControl.x;
                const sY = (this.lastCoords.y * 2) - this.lastControl.y;

                this.graphics.bezierCurveTo(
                    sX,
                    sY,
                    coords[0],
                    coords[1],
                    coords[2],
                    coords[3]
                );

                this.lastCoords = {
                    x: coords[2],
                    y: coords[3]
                };

                this.lastControl = {
                    x: coords[0],
                    y: coords[1]
                };

            },

            q: () => {
                for (let i = 0, l = coords.length; i < l; i += 2) {
                    coords[i] += offset.x;
                    coords[i + 1] += offset.y;
                }

                this.graphics.quadraticCurveTo(
                    coords[0],
                    coords[1],
                    coords[2],
                    coords[3]
                );

                this.lastCoords = {
                    x: coords[2],
                    y: coords[3]
                };

            },

            z: () => {
                this.graphics.closePath();

                if (!this.firstClose) {
                    this.graphics.addHole();
                }

                Object.assign(this.lastCoords, this.firstCoords);
                this.firstCoords = {};
                this.firstClose = false;
            }

        };

        const commandTypeLower = commandType.toLowerCase();

        if (params[commandTypeLower]) {
            params[commandTypeLower]();
        } else {
            console.log('Parameter not found!', commandTypeLower, coords);
        }

    }

}

export default PathToGraphics;