import React from "react";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default FeatureCard;
