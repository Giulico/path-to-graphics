// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './root.scss';

// Components
import Letter from 'components/Letter';

/**
 * My first component, the Root component!
 */
class Root extends Component {

    render() {
        return (
            <div className={styles.root}>

                <Letter />

            </div>
        );
    }

}

export default Root;