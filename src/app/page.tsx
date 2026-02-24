import React from "react";
import HomeContainer from "./_components/home-container";
import DashboardHeader from "./(participants)/_components/dashboard-header";

const HomePage = () => {
  return (
    <div>
      <DashboardHeader />
      <HomeContainer />
    </div>
  );
};

export default HomePage;
