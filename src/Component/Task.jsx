import React, { useState, useEffect, useCallback } from "react";

const Task = () => {
  const [data, setData] = useState([]);
  const [cachedData, setCachedData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [checkboxState, setCheckboxState] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = useCallback(
    async (page = 0) => {
      const start = page * 10;
      const url = `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=10`;

      if (cachedData[page]) {
        setData(cachedData[page]);
        setFilteredData(filterData(cachedData[page]));
        return;
      }

      try {
        const response = await fetch(url);
        const result = await response.json();

        const uniqueData = Array.from(
          new Map(result.map((item) => [item.title, item])).values()
        );

        setData(uniqueData);
        setFilteredData(filterData(uniqueData));
        setCachedData((prev) => ({ ...prev, [page]: uniqueData }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [cachedData]
  );

  const filterData = (data) => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    setFilteredData(filterData(data));
  }, [data, searchQuery]);

  const handleCheckboxChange = (id) => {
    setCheckboxState((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="card-container">
        {filteredData.length === 0 ? (
          <p className="no-data">No data found</p>
        ) : (
          filteredData.map((item) => (
            <div
              className={`card ${checkboxState[item.id] ? "active" : ""}`}
              key={item.id}
            >
              <input
                type="checkbox"
                checked={!!checkboxState[item.id]}
                onClick={() => handleCheckboxChange(item.id)}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          Prev
        </button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default Task;
