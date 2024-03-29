import React from 'react';
import { Link } from 'react-router-dom';

const DashboardStudent = () => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('user_id');

    return (
      <div>
        {username && <h1>Welcome {username}!</h1>}
        <Link to={`/profile/${id}`} className="hover:text-green-600"> Profile </Link>
      </div>
    );
  };

export default DashboardStudent;