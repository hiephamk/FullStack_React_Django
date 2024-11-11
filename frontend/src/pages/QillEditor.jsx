import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importing default styling for Quill

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
      ['clean'], // For clearing the content
    ],
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
    onChange(value); // Optional: You can send the content up to parent component
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
          placeholder={placeholder}
        />
        <div className="createList-content">
          <button type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

export default QuillEditor;
