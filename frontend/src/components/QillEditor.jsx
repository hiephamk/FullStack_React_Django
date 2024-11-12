import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, placeholder, onSubmit }) => {
  const [editorValue, setEditorValue] = useState(value || "");

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': ['small', 'normal', 'large', 'huge'] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }],
      [{ 'background': [] }],
      ['link', 'blockquote'],
      ['image'],
      ['clean'],
    ],
  };

  const formats = [
    'font', 'size', 'align', 'list', 'bullet', 
    'bold', 'italic', 'underline', 'strike', 
    'color', 'background', 'link', 'blockquote', 'image'
  ];

  const handleEditorChange = (value) => {
    setEditorValue(value);
    onChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(editorValue);
    }
  };

  return (
    <div className="quill-editor-container">
      <form onSubmit={handleSubmit}>
        <ReactQuill
          value={editorValue}
          onChange={handleEditorChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
        <div className="createList-content">
          <button type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

QuillEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default QuillEditor;
