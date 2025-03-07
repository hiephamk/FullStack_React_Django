import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAccessToken from '../../features/auth/token';
import axios from 'axios';
import formatDate from '../../features/formatDate';

const Feedback = () => {
    const { user, userInfo } = useSelector((state) => state.auth);
    const accessToken = useAccessToken(user);
    const [feedbacks, setFeedbacks] = useState([]);
    const [airquality, setAirquality] = useState('');
    const [suggestion, setSuggestion] = useState('');

    const fetchFeedbacks = async () => {
        if (!accessToken) {
            return;
        }
        const url = `http://127.0.0.1:8000/api/feedback/`;
        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        try {
            const resp = await axios.get(url, config);
            console.log('Feedbacks:', resp.data);
            // Ensure we set an array even if the response structure is different
            setFeedbacks(Array.isArray(resp.data) ? resp.data : []);
        } catch (error) {
            console.error('Error fetching feedback:', error.response || error.message);
            setFeedbacks([]); // Set empty array on error
        }
    };

    useEffect(() => {
        if (user?.access) {
            fetchFeedbacks();
        }
    }, [accessToken, userInfo?.id]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        const url = `http://127.0.0.1:8000/api/feedback/`;
        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        try {
            const resp = await axios.post(url, {
                user: userInfo.id,
                airquality,
                suggestion
            }, config);
            console.log('New Feedback:', resp.data);
            // Add new feedback to existing array instead of replacing it
            setFeedbacks(prevFeedbacks => [...prevFeedbacks, resp.data]);
            setAirquality('');
            setSuggestion('');
        } catch (error) {
            console.error('Error submitting feedback:', error.response || error.message);
        }
    };

    return (
        <div className='text-dark'>
            <div>
                <table border="1" className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Air quality</th>
                            <th>Suggestion</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <tr key={feedback.id}>
                                    <td>{feedback.user_Fulname}</td>
                                    <td>{feedback.airquality}</td>
                                    <td>{feedback.suggestion}</td>
                                    <td>{formatDate(feedback.created)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No feedback available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Feedback</h2>
                <form onSubmit={submitFeedback}>
                    <div className="form-group">
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            value={airquality}
                            onChange={(e) => setAirquality(e.target.value)}
                        >
                            <option value="">Select air quality</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Acceptable">Acceptable</option>
                            <option value="Polluted">Polluted</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="Enter your suggestion"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;