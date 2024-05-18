import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('user_id');
    
    return (
      <div>
        {username && <h1 className="text-8xl font-amatic font-bold text-brown-light pt-10">Welcome {username}!</h1>}
        <div className="container mx-auto">
        <main className="flex flex-col justify-start items-center min-h-screen pt-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-center items-center w-100 h-72 border-4 border-brown bg-beige p-8">
              <Link to={`/dashboard/profile/${id}`} className="text-8xl text-brown hover:text-brown-dark font-amatic font-bold"> Profile </Link>
            </div>
            <div className="flex justify-center items-center w-100 h-72 border-4 border-brown bg-beige p-8">
              <Link to={`/dashboard/profile/${id}/manageplant`} className="text-8xl text-brown hover:text-brown-dark font-amatic font-bold"> Manage Plant </Link>
            </div>
            <div className="flex justify-center items-center w-100 h-72 border-4 border-brown bg-beige p-8">
              <Link to={`/dashboard/profile/${id}/managestaff`} className="text-8xl text-brown hover:text-brown-dark font-amatic font-bold"> Manage Staff </Link>
            </div>
            <div className="flex justify-center items-center w-100 h-72 border-4 border-brown bg-beige p-8">
              <Link to={`/dashboard/profile/${id}/manageproduct`} className="text-8xl text-brown hover:text-brown-dark font-amatic font-bold"> Manage Product </Link>
            </div>
        </div>
       </main>
      </div>
    </div>
    );
  };

export default DashboardAdmin;