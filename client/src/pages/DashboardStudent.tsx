import React from 'react';

const DashboardStudent = () => {
    const username = localStorage.getItem('username');
    
    return (
      <div>
        {username && <h1>Welcome {username}!</h1>}
        {/* Rest of your dashboard content */}
      </div>
    );
  };

export default DashboardStudent;