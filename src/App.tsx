import React, { useState } from "react";
import Header from "./components/Header";
import Modal from "./components/Modal";
import Nav from "./components/Nav";
import invoices from "./assets/data/Data";
import { singleData } from "./models/models";
import CardsMain from "./components/CardsMain";
import EmptyCardList from "./components/EmptyCardList";
import SingleCards from "./components/SingleCards";

const App: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [singleCardModal, setSingleCardModal] = useState<boolean>(false);
  const [data, setData] = useState<singleData[]>(invoices);
  const [filteredData, setFilteredData] = useState<singleData[]>(invoices);
  const [invocesMesage, setInvocesMesage] = useState<string>("total");
  const [singleCardItem, setSingleCardItem] = useState<singleData>();
  const [edit, setEdit] = useState<boolean>(false);

  const [filters, setFilters] = useState<boolean[]>([true, true, true]);
  const FilterArray = (a: number) => (v: boolean, i: number) =>
    i === a ? !v : v;

  const handleFilters = (e: number) => {
    setFilters(filters.map(FilterArray(e)));
    const filterArr = filters.map(FilterArray(e));

    if (
      filterArr[0] === true &&
      filterArr[1] === true &&
      filterArr[2] === true
    ) {
      setFilteredData(data);
      setInvocesMesage("total");
    } else if (
      filterArr[0] === false &&
      filterArr[1] === true &&
      filterArr[2] === true
    ) {
      setFilteredData(data.filter((item) => item.status !== "paid"));
      setInvocesMesage("pending and draft");
    } else if (
      filterArr[0] === true &&
      filterArr[1] === false &&
      filterArr[2] === true
    ) {
      setFilteredData(data.filter((item) => item.status !== "pending"));
      setInvocesMesage("paid and draft");
    } else if (
      filterArr[0] === true &&
      filterArr[1] === true &&
      filterArr[2] === false
    ) {
      setFilteredData(data.filter((item) => item.status !== "draft"));
      setInvocesMesage("paid and pending");
    } else if (
      filterArr[0] === true &&
      filterArr[1] === false &&
      filterArr[2] === false
    ) {
      setFilteredData(data.filter((item) => item.status === "paid"));
      setInvocesMesage("paid");
    } else if (
      filterArr[0] === false &&
      filterArr[1] === true &&
      filterArr[2] === false
    ) {
      setFilteredData(data.filter((item) => item.status === "pending"));
      setInvocesMesage("pending");
    } else if (
      filterArr[0] === false &&
      filterArr[1] === false &&
      filterArr[2] === true
    ) {
      setFilteredData(data.filter((item) => item.status === "draft"));
      setInvocesMesage("draft");
    } else {
      setFilteredData([]);
    }
  };

  const handleSingleCardModal = (e: string) => {
    filteredData.map((item) => {
      if (item.id === e) {
        setSingleCardItem(item);
        setSingleCardModal(true);
      }
    });
  };

  const openEditModal = () => {
    setEdit(true);
    setModal(true);
  };

  return (
    <>
      <Nav modal={modal} />
      {!singleCardModal && (
        <Header
          filteredData={filteredData}
          setModal={setModal}
          modal={modal}
          handleFilters={handleFilters}
          invocesMesage={invocesMesage}
          filters={filters}
        />
      )}
      {filteredData.length > 0 && !singleCardModal && (
        <CardsMain
          filteredData={filteredData}
          handleSingleCardModal={handleSingleCardModal}
          modal={modal}
        />
      )}
      {singleCardModal && (
        <SingleCards
          singleCardItem={singleCardItem}
          setSingleCardModal={setSingleCardModal}
          data={data}
          setData={setData}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          setSingleCardItem={setSingleCardItem}
          openEditModal={openEditModal}
          modal={modal}
        />
      )}
      {filteredData.length == 0 && <EmptyCardList />}
      {modal && (
        <Modal
          setModal={setModal}
          data={data}
          setData={setData}
          filters={filters}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          edit={edit}
          singleCardItem={singleCardItem}
          setSingleCardItem={setSingleCardItem}
          setEdit={setEdit}
        />
      )}
    </>
  );
};

export default App;
