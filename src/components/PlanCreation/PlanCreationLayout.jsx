import React from 'react';
import PropTypes from 'prop-types';

import Global from '../context/Global.jsx';
import PlanCreation from './PlanCreation.jsx';
import '../../i18n';

class PlanCreationLayout extends React.Component {
  render() {
    return (
      <Global>
        <PlanCreation 
          locale={this.props.locale}
          currentOrgId={this.props.currentOrgId} 
          currentOrgName={this.props.currentOrgName}  />
      </Global>
    );
  }
}

PlanCreationLayout.propTypes = {
  locale: PropTypes.string,
  currentOrgId: PropTypes.number,
  currentOrgName: PropTypes.string,
};
export default PlanCreationLayout;
