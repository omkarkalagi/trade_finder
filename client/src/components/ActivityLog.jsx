import React from 'react';

const ActivityLog = ({ data }) => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
    <div className="space-y-2">
      {data && data.length > 0 ? data.map((item, idx) => (
        <div key={idx} className="text-sm text-gray-700">
          {item}
        </div>
      )) : <div className="text-gray-400">No activity</div>}
    </div>
  </div>
);

export default ActivityLog; 