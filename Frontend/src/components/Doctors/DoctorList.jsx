// In DoctorList.jsx
import React from "react";
import { doctors } from "./../../assets/data/doctors";
import DoctorCard from "./DoctorCard";
import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const DoctorList = () => {
  const { data: doctors, loading, error } = useFetchData(`${BASE_URL}/doctors`);

  console.log("doctors:", doctors); // Add this line to check the fetched data

  return (
    <>
      {loading && <Loader />}
      {error && <Error />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] lg:mt-[55px]">
        {doctors?.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </>
  );
};
export default DoctorList; // Ensure the component is exported as default
