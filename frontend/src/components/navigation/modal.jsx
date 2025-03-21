import { useState } from 'react';

const ModalForm = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState('public');

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission logic here
  };

  return (
    <div className="modal fade" id="modalForm" tabIndex="-1" aria-labelledby="modalFormLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalFormLabel">Create Post</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} className="form-container">
              <input
                className="form-control mb-3"
                style={{ border: '1px solid #111', width: '100%', borderRadius: '5px', padding: '10px' }}
                type="search"
                placeholder="Search or Start a New Post"
                data-bs-toggle="collapse"
                data-bs-target="#mychannel"
                aria-expanded="false"
                aria-controls="mychannel"
              />
              <div className="collapse" id="mychannel">
                <div className="mb-3">
                  <textarea
                    id="content"
                    placeholder="Tell us your story!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="form-control"
                    style={{ border: '1px solid #111', width: '100%', borderRadius: '5px', padding: '10px' }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="form-control"
                    style={{ border: '1px solid #111', width: '100%', borderRadius: '5px', padding: '10px' }}
                  />
                </div>
                <div className="mb-3">
                  <select
                    id="visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="form-control"
                    style={{ border: '1px solid #111', width: '100%', borderRadius: '5px', padding: '10px' }}
                  >
                    <option value="circles">Circles</option>
                    <option value="intercircles">InterCircles</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" type="submit">Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
