import React, { useEffect } from 'react';

export const UserHome = () => {
  useEffect(() => {
    // Clear session storage on component mount
    sessionStorage.clear();
  }, []);

  return (
    <div>hi</div>
  );
};
