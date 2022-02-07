import React, { useState } from "react";
import { singleData, ItemsArrData } from "../models/models";
import LeftArrow from "../assets/icons/icon-arrow-left.svg";
import "./SingleCards.css";

interface props {
  singleCardItem: any;
  setSingleCardModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: singleData[];
  setData: React.Dispatch<React.SetStateAction<singleData[]>>;
  filteredData: singleData[];
  setFilteredData: React.Dispatch<React.SetStateAction<singleData[]>>;
  setSingleCardItem: any;
  openEditModal: () => void;
  modal: boolean;
}

const SingleCards: React.FC<props> = ({
  singleCardItem,
  setSingleCardModal,
  data,
  setData,
  filteredData,
  setFilteredData,
  setSingleCardItem,
  openEditModal,
  modal,
}) => {
  const [singleCardDeleteModal, setSingleDeleteCardModal] =
    useState<boolean>(false);

  const closeModal: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as Element).classList[0] === "singleCardContainer-overlay") {
      setSingleDeleteCardModal(false);
    }
  };

  const deleteSingleCard = () => {
    setFilteredData(
      filteredData.filter((item) => item.id !== singleCardItem.id)
    );
    setData(data.filter((item) => item.id !== singleCardItem.id));
    setSingleDeleteCardModal(false);
    setSingleCardModal(false);
  };

  const handleStatus = (e: string) => {
    if (singleCardItem.status === "paid") {
      setSingleCardItem({ ...singleCardItem, status: "pending" });
      setFilteredData(
        filteredData.map((item: singleData) =>
          item.id === singleCardItem.id ? { ...item, status: "pending" } : item
        )
      );
      setData(
        data.map((item: singleData) =>
          item.id === singleCardItem.id ? { ...item, status: "pending" } : item
        )
      );
    } else {
      setSingleCardItem({ ...singleCardItem, status: "paid" });
      setFilteredData(
        filteredData.map((item: singleData) =>
          item.id === singleCardItem.id ? { ...item, status: "paid" } : item
        )
      );
      setData(
        data.map((item: singleData) =>
          item.id === singleCardItem.id ? { ...item, status: "paid" } : item
        )
      );
    }
  };

  return (
    <div
      className={modal ? "posTop singleCardContainer" : "singleCardContainer"}
    >
      <button
        className="single-card-btn-back"
        onClick={() => setSingleCardModal(false)}
      >
        <img src={LeftArrow} alt="LeftArrow" />
        Go back
      </button>
      <div className="singleCard">
        {/* singleCardStatus */}
        <div className="singleCardStatus">
          <p>Status</p>
          <div
            className={
              singleCardItem.status === "paid"
                ? "card-status-btn-green"
                : singleCardItem.status === "pending"
                ? "card-status-btn-orange"
                : "card-status-btn-gray"
            }
          >
            <span className="dot">&bull;</span> &nbsp;
            <span className="span"> {singleCardItem.status}</span>
          </div>
        </div>
        {/* singleCardBtns */}
        <div className="singleCardBtns">
          <button className="edit-btn" onClick={openEditModal}>
            Edit
          </button>

          <button
            className=" red-btn"
            onClick={() => setSingleDeleteCardModal(true)}
          >
            Delete
          </button>
          {singleCardItem.status === "paid" ? (
            <button
              className="submit-btn purple-submit-btn"
              onClick={() => handleStatus("paid")}
            >
              Mark as Pending
            </button>
          ) : (
            <button
              className="submit-btn purple-submit-btn"
              onClick={() => handleStatus("pending")}
            >
              Mark as Paid
            </button>
          )}
        </div>
        {/* singleCardMain */}
        <div className="singleCardMain">
          {/* singleCardMainTop */}
          <div className="singleCardMainTop">
            <div className="singleCardMainTopID">
              <div>
                <h2>
                  <span>#</span>
                  {singleCardItem.id}
                </h2>
              </div>
              <p>{singleCardItem.description}</p>
            </div>
            <div className="singleCardMainTopSenderAddress">
              <p>{singleCardItem.senderAddress.street}</p>
              <p>{singleCardItem.senderAddress.city}</p>
              <p>{singleCardItem.senderAddress.postCode}</p>
              <p>{singleCardItem.senderAddress.country}</p>
            </div>
          </div>
          {/* singleCardMainMid */}
          <div className="singleCardMainMid">
            <div className="singleCardMainMidDate">
              <p>Invoice Date</p>
              <h2>{singleCardItem.createdAt}</h2>
              <p id="payment-date">Payment Date</p>
              <h2>{singleCardItem.paymentDue}</h2>
            </div>
            <div className="singleCardMainMidBill">
              <p>Bill To</p>
              <h2>{singleCardItem.clientName}</h2>
              <p>{singleCardItem.clientAddress.street}</p>
              <p>{singleCardItem.clientAddress.city}</p>
              <p>{singleCardItem.clientAddress.postCode}</p>
              <p>{singleCardItem.clientAddress.country}</p>
            </div>
            <div className="singleCardMainMidSentTo">
              <p>Send to</p>
              <h2>{singleCardItem.clientEmail}</h2>
            </div>
          </div>
          {/* singleCardMainBottom */}
          <div className="singleCardMainBottom">
            <div className="singleCardMainBottomDiv">
              <div className="singleCardMainBottomleft">
                <p id="singleCardMainBottomleftFirst">Item Name</p>
                <div>
                  <p>QTY.</p>
                  <p>Price</p>
                </div>
              </div>
              <div className="singleCardMainBottomright">
                <p>Total</p>
              </div>
            </div>
            {singleCardItem.items.map((item: ItemsArrData, id: number) => {
              return (
                <div className="singleCardMainBottomDiv" key={id}>
                  <div className="singleCardMainBottomleft">
                    <h2 id="singleCardMainBottomleftFirst">{item.name}</h2>
                    <div>
                      <h2>
                        {item.quantity} <span>&nbsp;x&nbsp;</span>
                      </h2>
                      <h2>&pound; {item.price}</h2>
                    </div>
                  </div>
                  <div className="singleCardMainBottomright">
                    <h2>&pound; {item.total}</h2>
                  </div>
                </div>
              );
            })}
            <div className="singleCardMainBottomTotal">
              <p>total</p>
              <h2>&pound; {singleCardItem.total}</h2>
            </div>
          </div>
        </div>
      </div>
      {singleCardDeleteModal && (
        <div className="singleCardContainer-overlay" onClick={closeModal}>
          <div className="singleCardContainer-modal">
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete invoice #{singleCardItem.id}? This
              action cannot be undone.
            </p>
            <div className="singleCardContainer-modal-btns">
              <button
                className="edit-btn"
                onClick={() => setSingleDeleteCardModal(false)}
              >
                Cancel
              </button>
              <button className=" red-btn" onClick={deleteSingleCard}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCards;
