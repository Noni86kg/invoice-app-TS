import React from "react";
import "./CardsMain.css";
import { singleData } from "../models/models";
import ArrowRight from "../assets/icons/icon-arrow-right.svg";

interface props {
  filteredData: singleData[];
  handleSingleCardModal: (e: string) => void;
  modal: boolean;
}

const CardsMain: React.FC<props> = ({
  filteredData,
  handleSingleCardModal,
  modal,
}) => {
  return (
    <main className={modal ? "posTop" : ""}>
      {filteredData.map((card, id) => {
        return (
          <div
            className="card"
            key={card.id}
            onClick={() => handleSingleCardModal(card.id)}
          >
            <div className="card-id">
              <span>#</span>
              {card.id}
            </div>
            <div className="card-paymentDue">{card.paymentDue}</div>
            <div className="card-clientName">{card.clientName}</div>
            <div className="card-total">&pound; {card.total}</div>
            <div className="card-right">
              <div
                className={
                  card.status === "paid"
                    ? "card-status-btn-green"
                    : card.status === "pending"
                    ? "card-status-btn-orange"
                    : "card-status-btn-gray"
                }
              >
                <span className="dot">&bull;</span> &nbsp;
                <span className="span"> {card.status}</span>
              </div>
              <div className="card-arrow">
                <img src={ArrowRight} alt="ArrowRight" />
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
};

export default CardsMain;
