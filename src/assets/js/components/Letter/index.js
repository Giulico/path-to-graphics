import React, {Component} from 'react';
import 'pixi.js';
import PathToGraphics from 'shared/PathToGraphics';

// Styles
import letter from './letter.scss';

class Letter extends Component {

    B = 'M65.6,30.8c-1,2.8-2.4,5.4-4.2,7.6c-1.8,2.2-3.8,4.2-6.2,5.9c-2.3,1.7-4.8,3-7.5,3.9c2.5,0.5,4.8,1.4,7,2.5c2.2,1.1,4.1,2.6,5.8,4.4c1.6,1.8,2.9,3.9,3.9,6.2c1,2.4,1.4,5.1,1.4,8.1c0,4.6-1,8.7-2.9,12.5c-1.9,3.8-4.5,7-7.9,9.7s-7.3,4.7-11.8,6.2c-4.5,1.5-9.4,2.2-14.6,2.2H0L17.7,0H41c4.5,0,8.4,0.5,11.6,1.6c3.3,1.1,6,2.6,8.2,4.5c2.1,1.9,3.7,4.2,4.8,6.8c1,2.7,1.6,5.5,1.6,8.6C67.1,24.9,66.6,28,65.6,30.8z M50.3,57.7c-4-2.9-9.3-4.4-16.1-4.4H17.7l-6.6,38.2h18.8c3.8,0,7.4-0.5,10.6-1.4c3.2-1,6-2.4,8.4-4.2c2.3-1.8,4.2-4.1,5.5-6.7c1.3-2.6,2-5.7,2-9.2C56.3,64.7,54.3,60.6,50.3,57.7zM52.9,12.3C49.8,9.8,45,8.5,38.6,8.5h-13l-6.4,36.3h13.2c3.9,0,7.5-0.6,10.6-1.7c3.1-1.1,5.8-2.7,7.9-4.7c2.1-2,3.8-4.3,4.9-6.8c1.1-2.6,1.7-5.3,1.7-8.2C57.5,18.5,56,14.9,52.9,12.3z'

    componentDidMount() {
        // Setup things
        this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { // eslint-disable-line no-undef
            antialias: true,
            transparent: true,
            resolution: 1
        });
        this.canvas = this.app.view;
        this.canvasContainer.appendChild(this.canvas);

        const graphicsFromPath = new PathToGraphics(this.B, {
            fill: 0xFFFFFF
        });
        const graphics = graphicsFromPath.getGraphics();

        this.app.stage.addChild(graphics);
    }

    render() {
        return (
            <div
                ref={c => this.canvasContainer = c}
                className={letter.root}
            />
        );
    }

}

export default Letter;