import React from 'react';
import PropTypes from 'prop-types';

import Global from '../context/Global.jsx';
import Plan from './Plan.jsx';
import '../../i18n';

class PlanCreationLayout extends React.Component {
  render() {
    return (
      <Global>
        <Plan locale={this.props.locale} />
      </Global>
    );
  }
}

PlanCreationLayout.propTypes = {
  locale: PropTypes.string,
};
export default PlanCreationLayout;
