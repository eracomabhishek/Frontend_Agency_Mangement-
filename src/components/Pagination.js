import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const Pagination = () => {
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    agencyName: "",
    vehicleName: "",
    vehicleType: "",
  });
  const [options, setOptions] = useState({
    agencyNames: [],
    vehicleTypes: [],
    vehicleNames: [],
  });
  const limit = 10;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles when currentPage or filters change
  }, [currentPage, filters]);

  useEffect(() => {
    fetchVehicleOptions(); // Fetch options once when component mounts
  }, []);

  useEffect(() => {
    // Update URL with the current page and filters
    const params = new URLSearchParams(location.search);
    params.set("page", currentPage);
    params.set("limit", limit);
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.set(key, filters[key]);
      }
    });
    navigate({ search: params.toString() });
  }, [currentPage, filters, navigate, location.search]);

  // Fetch vehicles data
  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/pagination", {
        params: {
          page: currentPage,
          limit: limit,
          ...filters,
        },
      });
      const { data, pagination } = response.data;
      setVehicles(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Fetch vehicle options (for filters)
  const fetchVehicleOptions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/vehicle/options");
      const { agencyNames, vehicleTypes, vehicleNames } = response.data;
      setOptions({ agencyNames, vehicleTypes, vehicleNames });
    } catch (error) {
      console.error("Error fetching vehicle options:", error);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      agencyName: "",
      vehicleName: "",
      vehicleType: "",
    });
    setCurrentPage(1); // Reset to first page after clearing filters
  };

  return (
    <div className="container">
      <h1 className="title">Vehicle Pagination</h1>

      {/* Filters Section */}
      <div className="filters">
        {/* Dropdown for Agency Name */}
        <select
          name="agencyName"
          onChange={handleFilterChange}
          className="filter-select"
          value={filters.agencyName}
        >
          <option value="">All Agencies</option>
          {options.agencyNames.map((agency) => (
            <option key={agency} value={agency}>
              {agency}
            </option>
          ))}
        </select>

        {/* Dropdown for Vehicle Name */}
        <select
          name="vehicleName"
          onChange={handleFilterChange}
          className="filter-select"
          value={filters.vehicleName}
        >
          <option value="">All Vehicle Names</option>
          {options.vehicleNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Dropdown for Vehicle Type */}
        <select
          name="vehicleType"
          onChange={handleFilterChange}
          className="filter-select"
          value={filters.vehicleType}
        >
          <option value="">All Vehicle Types</option>
          {options.vehicleTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        <button onClick={handleClearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      {/* Vehicle List */}
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Vehicle Name</th>
            <th>Vehicle Type</th>
            <th>Capacity</th>
            <th>Agency Name</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={index}>
              <td>{vehicle.vehicleName}</td>
              <td>{vehicle.vehicleType}</td>
              <td>{vehicle.capacity}</td>
              <td>{vehicle.agencyName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
