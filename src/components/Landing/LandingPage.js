import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing the useNavigate hook for navigation
import Navbar from '../Navbar/Navbar'; // Importing Navbar component
import './LandingPage.css'; // Importing styles

const LandingPage = () => {
  const navigate = useNavigate(); // Initializing navigate function for navigation
  const username = localStorage.getItem('username'); // Retrieving username from local storage

  // Function to handle the click event on the discovery button
  const handleDiscoveryClick = () => {
    navigate('/discovery'); // Navigate to the discovery page
  };

  return (
    <div className="landing-container"> {/* Main container for the landing page */}
      <Navbar username={username} /> {/* Rendering Navbar with the username */}
      <div className="content-card-landing"> {/* Container for the main content */}
        <button className="discovery-button" onClick={handleDiscoveryClick}> {/* Button to navigate to the discovery page */}
          <img src="/images/start-assesment.png" alt="Go to Discovery" /> {/* Button image */}
        </button>
      </div>
    </div>
  );
};

export default LandingPage; // Exporting the LandingPage component as default
