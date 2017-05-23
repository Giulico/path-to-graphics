import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

// First child component
import Root from './containers/Root';

// @see https://github.com/gaearon/react-hot-boilerplate/pull/61#issuecomment-254467020
ReactDOM.render(
    <AppContainer>
        <Root />
    </AppContainer>,
    document.getElementById('app-root')
);

if (__PRODUCTION__ === false) {

    if (module.hot) {

        module.hot.accept('./containers/Root', () => {

            const RootContainer = require('./containers/Root').default; //eslint-disable-line global-require

            ReactDOM.render(
                <AppContainer>
                    <RootContainer />
                </AppContainer>,
                document.getElementById('app-root')
            );
        });

    }

}


