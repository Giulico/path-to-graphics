import React, {Component} from 'react';
import 'pixi.js';
import PathToGraphics from 'shared/PathToGraphics';

// Styles
import letter from './letter.scss';

class Letter extends Component {

    B = 'M57.5,27c-0.9,2.5-2.1,4.7-3.7,6.7c-1.6,2-3.4,3.7-5.4,5.2c-2,1.5-4.2,2.6-6.5,3.4c2.2,0.5,4.2,1.2,6.1,2.2 c1.9,1,3.6,2.3,5,3.8c1.4,1.6,2.6,3.4,3.4,5.5c0.8,2.1,1.3,4.4,1.3,7.1c0,4-0.8,7.7-2.5,11c-1.7,3.3-4,6.1-6.9,8.5 c-2.9,2.3-6.4,4.1-10.3,5.4c-4,1.3-8.2,1.9-12.8,1.9H0L15.5,0h20.4c3.9,0,7.3,0.5,10.2,1.4s5.3,2.3,7.1,4c1.9,1.7,3.3,3.7,4.2,6 c0.9,2.3,1.4,4.8,1.4,7.6C58.8,21.8,58.4,24.5,57.5,27z M44.1,50.5c-3.5-2.6-8.2-3.8-14.1-3.8H15.5L9.7,80.2h16.4 c3.4,0,6.5-0.4,9.3-1.3c2.8-0.8,5.3-2.1,7.3-3.7c2-1.6,3.6-3.6,4.8-5.9c1.2-2.3,1.7-5,1.7-8C49.3,56.7,47.6,53.1,44.1,50.5z M46.3,10.8c-2.7-2.2-6.9-3.4-12.5-3.4H22.4l-5.6,31.8h11.5c3.4,0,6.5-0.5,9.3-1.5c2.8-1,5.1-2.4,7-4.1c1.9-1.8,3.3-3.8,4.3-6 c1-2.2,1.5-4.6,1.5-7.2C50.4,16.2,49,13,46.3,10.8z';

    A = 'M61.2,88.4l-5.6-31.2h-30L8.6,88.4H0L48,0h5.2l16.9,88.4H61.2z M48.1,14.3L29.6,49.8h24.6L48.1,14.3z'

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