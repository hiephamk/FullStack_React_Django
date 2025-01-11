import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useAccessToken from "../../features/auth/token";
import ProfileImg from "../ProfileImg";
import useCircle from "../../features/Hooks/useCircle";

// eslint-disable-next-line react/prop-types
const CreateStatus = ({ onPostCreated }) => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const circle = useCircle();  // This gives the user's circle

    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [visibility, setVisibility] = useState("public");
    const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://127.0.0.1:8000/api/posts/`;
        const formData = new FormData();
        formData.append("content", content);
        formData.append("author", userInfo.id);
    
        //console.log("Circle ID:", circle.id);  // Log circle ID to verify
    
        if (visibility === "circles") {
            const circleId = circle?.Circle?.[0]?.id;  // Access the circle ID from the array
            if (circleId) {
                formData.append("circle", circleId); // Append the correct circle ID
            } else {
                //console.error("Circle is not valid:", circle);
                //alert("Circle is not valid. Please check your circle information.");
                return; // Stop submission if circle is invalid
            }
        }
    
        if (file) {
            formData.append("file", file);
        }
        formData.append("visibility", visibility);
    
        // Log formData to inspect
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
    
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            onPostCreated(response.data);
            setContent("");
            setFile(null);
            setVisibility("public");  // Reset visibility to 'public' after successful post
            setIsModalOpen(false);  // Close the modal after successful post
        } catch (error) {
            console.error("Error creating post:", error.response?.data || error.message);
            alert("Failed to create post.");
        }
    };
    return (
        <div>
            <div className="d-flex">
                <ProfileImg />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: '5px', width: '80%', borderRadius: '30px', margin: 'auto' }}
                >
                    <input 
                        type="text"
                        placeholder="Tell us your stories"
                        style={{ padding: '10px 20px', width: '100%', borderRadius: '20px' }}
                    />
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal show" tabIndex="-1" style={{ display: "block" }} aria-labelledby="staticBackdropLabel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="d-flex">
                                    <ProfileImg />
                                    <div className="px-3">
                                        <h5 className="modal-title" id="staticBackdropLabel">
                                            Create Post
                                        </h5>
                                        <div className="d-flex flex-column">
                                            <select
                                                id="visibility"
                                                value={visibility}
                                                onChange={(e) => setVisibility(e.target.value)}
                                            >
                                                <option value="public">Public</option>
                                                <option value="onlyme">Only Me</option>
                                                <option value="circles">Circles</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <textarea
                                        id="content"
                                        placeholder="Tell us your story!"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        style={{
                                            border: "1px solid #111",
                                            width: "100%",
                                            borderRadius: "5px",
                                            padding: "10px",
                                        }}
                                    />
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{
                                            border: "1px solid #111",
                                            width: "100%",
                                            borderRadius: "5px",
                                            padding: "10px",
                                            marginTop: "10px",
                                        }}
                                    />
                                    <button className="btn btn-primary" type="submit" style={{ marginTop: "10px" }}>
                                        Post
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateStatus;
