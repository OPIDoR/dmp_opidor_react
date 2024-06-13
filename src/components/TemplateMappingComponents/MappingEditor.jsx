import React, { forwardRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import uniqueId from "lodash.uniqueid";
import * as styles from "../assets/css/form.module.css";
import useSectionsMapping from "../../hooks/useSectionsMapping";

/**
 * This is a React functional component that renders a TinyMCE editor for mapping text input. It receives several props including `label`, `defaultValue`.
 */
const MappingEditor = forwardRef(({
  label, defaultValue = null, questionId,
}, ref) => {
  const tinyAreaLabelId = uniqueId('tiny_area_tooltip_id_');

  const [value, setValue] = useState(defaultValue);

  const {
    editorRef,
    setHandleInsert,
    insertInMappingSchema,
    mappingSchema
  } = useSectionsMapping();

  // --- MappingButton logic ---
  const handleInsert = ({ path }) => {
    const editor = editorRef.current;
    if (editor) {
      const formattedLabel = path.replace(/^\$./, '').split('.').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' > ');
      const content = `<samp json-path="${path}" data-label="${formattedLabel}" contenteditable="false"></samp>`;
      editor.execCommand('mceInsertContent', false, content);
      insertInMappingSchema(editor.getContent());
    }
    console.log("JSON PATH:", path)
  };

  useEffect(() => {
    setHandleInsert(() => handleInsert);
  }, [editorRef]);
  // --- End MappingButton logic ---

  // --- Mapping schema logic ---
  useEffect(() => {
    const editor = editorRef.current;

    const handleChange = () => {
      insertInMappingSchema(editor.getContent());
    };

    const handleKeyDown = (e) => {
      
      if ((e.keyCode === 8 || e.keyCode === 46) && editor.selection) {
        const node = editor.selection.getNode();
        if (node.nodeName === 'SAMP' && node.getAttribute('json-path')) {
          e.preventDefault();
          editor.dom.remove(node);
          editor.fire('ContentChanged');
        }
      }
      insertInMappingSchema(editor.getContent());
    };

    if (editor && editor.on) {
      editor.on('change', handleChange);
      editor.on('keydown', handleKeyDown);
    }

    return () => {
      if (editor && editor.off) {
        editor.off('change', handleChange);
        editor.off('keydown', handleKeyDown);
      }
    };
  }, [editorRef]);

  useEffect(() => {
    setValue(mappingSchema.mapping[questionId] || '');
  }, [mappingSchema.mapping[questionId]]);
  // --- End Mapping schema logic ---

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
            extended_valid_elements: 'iframe[tooltip], a[href|target=_blank], samp[json-path|style|contenteditable|data-label]',
            valid_elements: 'samp[json-path|style|contenteditable|data-label]',
            paste_preprocess: function (plugin, args) {
              args.content = args.content.replace(/<samp([^>]+)>/g, function (match) {
                return match.replace(/json-path="([^"]+)"/g, 'data-path="$1"');
              });
            },
            content_style: `
            samp[json-path] {
              background-color: #b4d7ff; 
              padding: 3px 5px; 
              border-radius: 5px; 
              font-size: 16px; 
              font-family: monospace;
            }

            samp[json-path]::before {
              content: attr(data-label);
              white-space: pre;
            }
            `,

            // onInit: (_evt, editor) => {
            //   ref.current = editor;
            //   editor.on('GetContent', function(e) {
            //     var content = e.content;
            //     e.content = content.replace(/<samp([^>]+)>/g, function(match, content) {
            //       var jsonPath = match.match(/json-path="([^"]+)"/);
            //       if (jsonPath) {
            //         var displayPath = jsonPath[1].replace(/\$\./, '').replace(/\./g, ' > ');
            //         return match.replace(/<samp/, `<samp data-display-path="${displayPath}"`);
            //       }
            //       return match;
            //     });
            //   });
            // },
            // content_style: `
            // samp[json-path] { 
            //   background-color: #b4d7ff; 
            //   padding: 3px 5px; 
            //   border-radius: 5px; 
            //   font-size: 16px; 
            //   font-family: monospace; 
            // }

            // samp[data-display-path]::before {
            //   content: attr(data-display-path) ' ';
            //   white-space: pre;
            // }
            // `,

            // content_style: `
            // samp[json-path] { 
            //   background-color:#b4d7ff; 
            //   padding: 3px 5px; 
            //   border-radius: 5px; 
            //   font-size: 16px; 
            //   font: monospace; 
            // }

            // samp[json-path]::before {
            //   content: attr(json-path);
            //   content: replace(replace(attr(json-path), /\\$\\./, ''), /\\./g, ' > ');
            //   white-space: pre;
            // }
            // `,

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
