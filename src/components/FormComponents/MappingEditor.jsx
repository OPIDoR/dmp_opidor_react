import React, { useRef, forwardRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import uniqueId from 'lodash.uniqueid';

import * as styles from '../assets/css/form.module.css';


/* This is a React functional component that renders a TinyMCE editor for text input. It receives several props including `label`, `name`, `changeValue`,
`tooltip` and `schemaId`. It uses the `useContext` hook to access the `form` and `temp` values from the `GlobalContext`. It also uses the
`useState` hook to set the initial state of the `text` variable to `<p></p>`. */
const MappingEditor = forwardRef(({
  label,
  defaultValue = null,
}) => {
  const tinyAreaLabelId = uniqueId('tiny_area_tooltip_id_');

  const [value, setValue] = useState(defaultValue);
  const editorRef = useRef(null);

  const handleChange = (content) => {
    setValue(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className={`form-group ticket-summernote mr-4 ml-4 ${styles.form_margin}`}>
      <div className="row">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tinyAreaLabelId}>{label}</label>
        </div>

        <Editor
          onEditorChange={handleChange}
          initialValue={defaultValue}
          value={value}
          init={{
            statusbar: true,
            menubar: false,
            toolbar: 'bold italic underline | fontsizeselect forecolor | bullist numlist | link | table',
            plugins: 'table autoresize link advlist lists autolink',
            browser_spellcheck: true,
            advlist_bullet_styles: 'circle,disc,square', // Only disc bullets display on htmltoword
            target_list: false,
            elementpath: false,
            resize: true,
            min_height: 230,
            width: '100%',
            autoresize_bottom_margin: 10,
            branding: false,
            extended_valid_elements: 'iframe[tooltip] , a[href|target=_blank]',
            paste_as_text: false,
            paste_block_drop: true,
            paste_merge_formats: true,
            paste_tab_spaces: 4,
            smart_paste: true,
            paste_data_images: true,
            paste_remove_styles_if_webkit: true,
            paste_webkit_styles: 'none',
            table_default_attributes: {
              border: 1,
            },
            // editorManager.baseURL is not resolved properly for IE since document.currentScript
            // is not supported, see issue https://github.com/tinymce/tinymce/issues/358
            skin_url: '/tinymce/skins/oxide',
            content_css: [],
          }}
          onInit={(_evt, editor) => editorRef.current = editor}
        />
      </div>
    </div>
  );
});

export default MappingEditor;
