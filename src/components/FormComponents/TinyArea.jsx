import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import uniqueId from 'lodash.uniqueid';
import styles from '../assets/css/form.module.css';
import DOMPurify from 'dompurify';
import styled from 'styled-components';

const ReadDiv = styled.div`
  border: solid;
  border-color: var(--primary);
  border-width: 1px;
  padding: 20px;
  margin-bottom: 10px;
  color: var(--primary);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f2f2;
`;

/* This is a React functional component that renders a TinyMCE editor for text input. It receives several props including `label`, `name`, `changeValue`,
`tooltip`, `level`, and `schemaId`. It uses the `useContext` hook to access the `form` and `temp` values from the `GlobalContext`. It also uses the
`useState` hook to set the initial state of the `text` variable to `<p></p>`. */
function TinyArea({
  value,
  handleChangeValue,
  label,
  propName,
  tooltip,
  readonly,
}) {
  const tinyAreaLabelId = uniqueId('tiny_area_tooltip_id_');

  const handleChange = (newText) => {
    handleChangeValue(propName, newText)
  };

  return (
    <div className={`form-group ticket-summernote mr-4 ml-4 ${styles.form_margin}`}>
      <div className="row">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tinyAreaLabelId}>{label}</label>
          {
            tooltip && (
              <ReactTooltip
                id={tinyAreaLabelId}
                place="bottom"
                effect="solid"
                variant="info"style={{ width: '300px', textAlign: 'center' }}
                content={tooltip}
              />
            )
          }
        </div>

        <div style={{ marginTop: "10px" }}>
          {!readonly && (
            <Editor
              onEditorChange={(newText) => handleChange(newText)}
              // onInit={(evt, editor) => (editorRef.current = editor)}
              value={value}
              name={propName}
              init={{
                branding: false,
                height: 200,
                menubar: false,
                plugins: "table autoresize link advlist lists",
                toolbar: "bold italic underline | fontsizeselect forecolor | bullist numlist | link | table",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                skin_url: '/tinymce/skins/oxide',
                forced_root_block: '\r',
                content_css: [],
              }}
            />
          )}
          {readonly && (
            <ReadDiv
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize([value]),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TinyArea;
