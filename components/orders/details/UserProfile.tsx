'use client'

import { Truck } from 'lucide-react'; 

const UserProfile = () => {
  return (
    <div className="pt-9 max-w-xs mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center text-center">
        <img
          src="/dummy-user-2.jpg"
          alt="User"
          className="w-32 h-32 rounded-xl object-cover mb-4"
        />
        <h3 className="text-xl font-semibold">James Witwicky</h3>
        <p className="text-sm text-primary mb-4 bg-primary/10 rounded-full px-4 py-1">
          Customer
        </p>
        
        <div className="w-full px-6 py-3  rounded-lg text-left">
          <h4 className="text-lg font-medium mb-2">Note Order</h4>
          <p className="text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-lg w-full text-left flex items-center justify-start space-x-4">
          <div className="bg-white text-red-600 rounded-full p-2">
            <Truck className="w-5 h-5" />
          </div>
          <p className="text-sm">6 The Avenue, London EC50 4GN</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
