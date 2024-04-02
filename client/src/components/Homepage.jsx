  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import "bootstrap/dist/css/bootstrap.min.css";
  import Select from 'react-select';
  import { useNavigate } from 'react-router-dom';



  const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [available, setAvailable] = useState('');
    const [searchName, setSearchName] = useState('');
    const [domainOptions, setDomainOptions] = useState([]);
    const [genderOptions, setGenderOptions] = useState([]);
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedDomainOptions, setSelectedDomainOptions] = useState([]);
    const [selectedGenderOptions, setSelectedGenderOptions] = useState([]);
  


    const navigate = useNavigate();

    useEffect(() => {
      const fetchFilterOptions = async () => {
        try {
          const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/options`);
          const domainOptions = data.domains.map(domain => ({ value: domain, label: domain }));
          const genderOptions = data.genders.map(gender => ({ value: gender, label: gender }));
          setDomainOptions(domainOptions);
          setGenderOptions(genderOptions);
        } catch (error) {
          console.error('Error fetching filter options:', error);
        }
      };
  
      fetchFilterOptions();
    }, []);
    
    
    useEffect(() => {
      const fetchUsers = async () => {
        const params = new URLSearchParams({
          page: currentPage,
          domains: selectedDomainOptions.map(option => option.value).join(","),
          genders: selectedGenderOptions.map(option => option.value).join(","),
          available: available,
          name: searchName
        }).toString();
  
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users?${params}`);
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      fetchUsers();
    }, [currentPage, selectedDomainOptions, selectedGenderOptions, available, searchName]);
      const resetFilters = () => {
        setSelectedDomainOptions([]);
        setSelectedGenderOptions([]);

      setAvailable('');
      setSearchName('');
      setCurrentPage(1);
    };

    const renderPagination = () => {
      const startPage = Math.max(currentPage - 2, 1);
      const endPage = Math.min(startPage + 4, totalPages);

      let pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(i)}>
              {i}
            </button>
          </li>
        );
      }
      return pages;
    };

    const handleCreateTeamClick = () => {
      setCreatingTeam(!creatingTeam);
      if (!creatingTeam) {
        setSelectedUserIds([]);
      }
    };


    
    const handleUserCheck = (userId) => {
      setSelectedUserIds(prevSelectedUserIds =>
        prevSelectedUserIds.includes(userId)
          ? prevSelectedUserIds.filter(id => id !== userId)
          : [...prevSelectedUserIds, userId]
      );
    };
    const createTeam = async () => {
      if (selectedUserIds.length === 0) {
        alert("Please select at least one user to create a team.");
        return;
      }


      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/team`, { userIds: selectedUserIds });
        alert(`Team created! Team ID: ${response.data._id}`);
        setCreatingTeam(false);
        setSelectedUserIds([]);
        navigate(`/team/${response.data._id}`);

      } catch (error) {
        alert(`Failed to create team. Reason: ${error.response.data.message}`);
      }

      setCreatingTeam(false);
      setSelectedUserIds([]);
    };

    return (
      <div className="container mt-5">
        <h1>Users</h1>
        <div className="filters mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Select
            isMulti
            name='domains'
            options={domainOptions}
            
            className='basic-multi-select mb-2'
            classNamePrefix='select'
            placeholder='Select Domains...'
            value={selectedDomainOptions}
          onChange={setSelectedDomainOptions}

          />

          <Select
            isMulti
            name='genders'
            options={genderOptions}
            className='basic-multi-select mb-2'
            classNamePrefix='select'
            placeholder='Select Genders...'
            value={selectedGenderOptions} 
          onChange={setSelectedGenderOptions}
          />        <div>
            <label>Availability</label>
            <select className="form-control" value={available} onChange={(e) => setAvailable(e.target.value)}>
              <option value="">Select</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
          <button onClick={resetFilters} className="btn btn-primary mb-3 mt-3 mx-2">Reset Filters</button>
          {creatingTeam && (
          <button
            className="btn btn-success mb-3 mt-3 mx-2"
            onClick={createTeam}
            disabled={selectedUserIds.length === 0}
          >
            Create Team
          </button>
        )}
          <button
          className={`btn btn-${creatingTeam ? "danger" : "primary"} mb-3 mt-3`}
          onClick={handleCreateTeamClick}
        >
          {creatingTeam ? "Cancel Team Creation" : "Create Team"}
        </button>

        <div className="row">
          {users.map(user => (
            <div key={user.id} className="col-md-4 mb-4">
              <div className="card">
                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="card-img-top" style={{ width: "50px", height: "50px" }} />
                <div className="card-body">
                  <h5 className="card-title">{`${user.id} - ${user.first_name} ${user.last_name}`}</h5>
                  {creatingTeam && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`checkbox-${user.id}`}
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleUserCheck(user.id)}
                        disabled={!user.available}

                      />
                      <label className="form-check-label" htmlFor={`checkbox-${user.id}`}>
                        {user.available ? "Select for team" : "Not available"}
                      </label>
                    </div>
                  )}
                  <p className="card-text">{user.email}</p>
                  <p className="card-text">Domain: {user.domain}</p>
                  <p className="card-text">Gender: {user.gender}</p>
                  <p className="card-text">Available: {user.available ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  </div>
  <nav aria-label="Page navigation" className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                Previous
              </button>
            </li>
            {renderPagination()}
            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  export default HomePage;
