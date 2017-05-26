# SVG Path to PIXI.Graphics
Converts a path "d" to a PIXI.Graphics object (PIXI v4).
It also normalize the path coords based on the settings.

## Getting started
This repo is build on the top of [Ambrogio boilerplate](https://github.com/Giulico/ambrogio).

### Start
Run the project.

```
yarn
npm start
```
then point the browser to [http://localhost:10100/][localhost]

### Example
```
const graphicsFromPath = new PathToGraphics(this.B, {
    viewBoxWidth: 110,
    viewBoxHeight: 100,
    min: 0,
    max: 500,
    fill: 0xFFFFFF
});
const graphics = graphicsFromPath.getGraphics();

...

this.app.stage.addChild(graphics);
```
