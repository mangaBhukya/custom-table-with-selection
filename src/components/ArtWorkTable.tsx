import React, { useEffect, useState } from "react";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

const ArtWorkTable = () => {
  const [artWorkData, setArtWorkData] = useState<any[]>([]);
  const [totalRecordsData, setTotalRecordsData] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [selectedAtWork, setSelectedAtWork] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${1 + pageCount}`
        );
        setArtWorkData(res.data.data);
        setTotalRecordsData(res.data.pagination.total);
        console.log("res.data---", res.data);
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
  console.log("artWorkData", artWorkData, pageCount);

  const handleSelectedAtWork = (e) => {
    console.log(e, "selectedAtWork");
    setSelectedAtWork(e.value);
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
