import React from 'react';

const AuthLayout = ({ title, titleIcon, description, children}) => (
  <div className="max-w-[480px] mx-auto min-h-screen grid items-start md:items-center text-white py-10 px-5 md:px-0">
    <div className="w-full">
      <div className="border-b border-gray pb-8 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl md:text-5xl font-medium md:font-semibold whitespace-nowrap">
            {title}
          </h1>
          <img src={titleIcon} alt={title} />
        </div>
        <p className="text-sm md:text-base text-gray">
          {description}
        </p>  
      </div>
      {children}
    </div>
  </div>
);


export default AuthLayout