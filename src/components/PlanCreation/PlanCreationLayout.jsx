import React from 'react';
import PropTypes from 'prop-types';

import Global from '../context/Global.jsx';
import PlanCreation from './PlanCreation.jsx';
import '../../i18n';

class PlanCreationLayout extends React.Component {
  render() {
    return (
      <Global>
        <PlanCreation locale={this.props.locale} />
      </Global>
    );
  }
}

PlanCreationLayout.propTypes = {
  locale: PropTypes.string,
};
export default PlanCreationLayout;
