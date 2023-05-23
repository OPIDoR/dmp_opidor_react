import React from 'react';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

import DynamicForm from './Builder/DynamicForm.jsx';
import Global from './context/Global.jsx';
import '../i18n';

class FormRoot extends React.Component {
  render() {
    return (
      <Global>
        <DynamicForm
          // schemaId={this.props.schemaId}
          dmpId={this.props.dmpId}
          fragmentId={this.props.fragmentId}
          locale={this.props.locale} />
        <Toaster position="top-center" reverseOrder={false} />
      </Global>
    );
  }
}

FormRoot.propTypes = {
  fragmentId: PropTypes.number,
  dmpId: PropTypes.number,
  schemaId: PropTypes.number,
  locale: PropTypes.string,
};

export default FormRoot;
