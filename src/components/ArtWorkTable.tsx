import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

const ArtWorkTable = () => {
  const [artWorkData, setArtWorkData] = useState<any[]>([]);
  const [totalRecordsData, setTotalRecordsData] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [selectedAtWork, setSelectedAtWork] = useState([]);
  const op = useRef<OverlayPanel>(null);
  const [numberValue, setNumberValue] = useState<number | null>(null);

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

  const isOverlayPanelOpen = (e: React.MouseEvent) => {
    op.current?.toggle(e); // open the panel
    console.log("on clicked", op);
  };

  const downArrowIcon = (
    <div className="flex items-center">
      <i
        className="pi pi-chevron-down"
        onClick={(e) => isOverlayPanelOpen(e)}
        style={{ cursor: "pointer" }}
      />
    </div>
  );

  const getSelectedRowsData = async (targetValue: any) => {
    try {
      const targetPageCount = Math.ceil(targetValue / 12); //calculated targeted page count
      let targetedRowsData: any[] = [];
      for (let currentPage = 1; currentPage <= targetPageCount; currentPage++) {
        const res = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage}`
        );
        const rowsData = res.data.data;
        const pendingrows = targetValue - targetedRowsData.length; // getting pending row count
        targetedRowsData.push(...rowsData.slice(0, pendingrows)); // pushing required rows data from current page
        console.log("targetedRowsData", targetedRowsData);

        if (targetedRowsData.length >= targetValue) break; // breaking the loop when we have target rows data
      }

      console.log("targetedRowsData---------", targetedRowsData);
      return setSelectedAtWork(targetedRowsData); // Finally updating state of selected artWork data
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const selectedRows = async () => {
    console.log("getSelectedRowsData:", numberValue);
    await getSelectedRowsData(numberValue);
    op.current?.hide(); // hide the panel after submit
    setNumberValue(null);  // after submit updating value to null
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
          headerClassName="ml-2"
        />
        <Column
          header={downArrowIcon}
          headerStyle={{ width: "2rem" }}
        />
        {TableColumns.map((col) => (
          <Column field={col.field} header={col.header} />
        ))}
      </DataTable>
      <OverlayPanel
        ref={op}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          padding: "16px",
          margin: "8px",
        }}
      >
        <div className="flex flex-col gap-3 w-64">
          <InputNumber
            value={numberValue}
            onValueChange={(e) => setNumberValue(e.value)}
            useGrouping={false}
            placeholder="Select Rows"
          />

          <div>
            <Button
              label="Submit"
              onClick={selectedRows}
            />
          </div>
        </div>
      </OverlayPanel>

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
