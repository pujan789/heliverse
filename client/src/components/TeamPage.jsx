import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const TeamPage = () => {
  const [teamDetails, setTeamDetails] = useState(null);
  const { teamId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/team/${teamId}`);
        setTeamDetails(response.data);
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  if (!teamDetails) {
    return <div>Loading team details...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Team Details</h2>
      <p>Total Members: {teamDetails.userCount}</p>
      <button className="btn btn-primary mb-4" onClick={() => navigate('/')}>
        Go Back to Home
      </button>

      
      <div className="row">
        {teamDetails.users.map(user => (
          <div key={user._id} className="col-md-4 mb-4">
            <div className="card">
            <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="card-img-top" style={{ width: "50px", height: "50px" }} />
              <div className="card-body">
                <h5 className="card-title">{`${user.id} - ${user.first_name} ${user.last_name}`}</h5>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">Gender: {user.gender}</p>
                <p className="card-text">Domain: {user.domain}</p>
                <p className="card-text">Available: {user.available ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
    </div>
  );
};

export default TeamPage;