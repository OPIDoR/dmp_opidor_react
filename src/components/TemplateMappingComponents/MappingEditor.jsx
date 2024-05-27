import React, { forwardRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import uniqueId from "lodash.uniqueid";
import * as styles from "../assets/css/form.module.css";
import useSectionsMapping from "../../hooks/useSectionsMapping";

/**
 * This is a React functional component that renders a TinyMCE editor for mapping text input. It receives several props including `label`, `defaultValue`.
 */
const MappingEditor = forwardRef(({
  label, defaultValue = null,
}, ref) => {
  const tinyAreaLabelId = uniqueId('tiny_area_tooltip_id_');

  const [value, setValue] = useState(defaultValue);

  const {
    editorRef, setHandleInsert,
  } = useSectionsMapping();


  const handleInsert = (path) => {
    // console.log(editorRef.current);
    const editor = editorRef.current;
    if (editor) {
      editor.execCommand('mceInsertContent', false, path);
      // console.log("entered!!!!!");
    }
    console.log("JSON PATH:", path)
  };

  useEffect(() => {
    setHandleInsert(() => handleInsert);
  }, [editorRef]);

  return (
    <div className={`form-group ticket-summernote mr-4 ml-4 ${styles.form_margin}`}>
      <div className="row">
        <div className={styles.label_form}>
          <strong className={styles.dot_label}></strong>
          <label data-tooltip-id={tinyAreaLabelId}>{label}</label>
        </div>

        <Editor
          onEditorChange={setValue}
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
          onInit={(_evt, editor) => ref.current = editor} />
      </div>
    </div>
  );
});

export default MappingEditor;