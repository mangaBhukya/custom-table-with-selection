import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";

const ArtWorkTable = () => {
  const [artWorkData, setArtWorkData] = useState<any[]>([]);
  const [totalRecordsData, setTotalRecordsData] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [selectedAtWork, setSelectedAtWork] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${1 + pageCount}`
        );
        setArtWorkData(res.data.data);
        setTotalRecordsData(res.data.pagination.total);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, [pageCount]);

  const TableColumns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place Of Origin" },
    { field: "artist_display", header: "Artist Display" },
    { field: "inscriptions", header: "Inscription" },
    { field: "date_start", header: "Date Start" },
    { field: "date_end", header: "Date End" },
  ];

  const handleSelectedAtWork = (e) => {
    let updatedSelectedAtWork = [...selectedAtWork]; //copy of previously selected rows data

    const artWorkIds = artWorkData.map((row) => row.id); // current page row ids

    updatedSelectedAtWork = updatedSelectedAtWork.filter(
      (row) => !artWorkIds.includes(row.id) // Removing previously selected rows from current page data, because they might be deselected
    );
    e.value.forEach((obj) => {
      updatedSelectedAtWork.push(obj); // adding current page selected rows
    });
    setSelectedAtWork(updatedSelectedAtWork); // Finally updating  state with the selectedArtWork data
  };

  return (
    <div className="card">
      <DataTable
        value={artWorkData}
        selectionMode="checkbox"
        selection={selectedAtWork}
        onSelectionChange={(e) => handleSelectedAtWork(e)}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        {TableColumns.map((col) => (
          <Column field={col.field} header={col.header}></Column>
        ))}
      </DataTable>
      <Paginator
        first={pageCount * 12}
        rows={12}
        totalRecords={totalRecordsData}
        onPageChange={(e) => setPageCount(e.page)}
      />
    </div>
  );
};

export default ArtWorkTable;
