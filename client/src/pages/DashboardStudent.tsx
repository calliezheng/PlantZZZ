import React from 'react';
import { Link } from 'react-router-dom';

const DashboardStudent = () => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('user_id');

    return (
      <div>
        {username && <h1>Welcome {username}!</h1>}
        <Link to={`/dashboard/profile/${id}`} className="hover:text-green-600"> Profile </Link>
        <Link to={`/dashboard/learned plant/${id}`} className="hover:text-green-600"> Plant Learned </Link>
        <Link to={`/dashboard/store/${id}`} className="hover:text-green-600"> Store </Link>
      </div>
    );
  };

export default DashboardStudent;