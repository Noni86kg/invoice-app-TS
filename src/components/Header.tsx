import React, { useState } from "react";
import "./Header.css";
import ArrowDown from "../assets/icons/icon-arrow-down.svg";
import ArrowUp from "../assets/icons/icon-arrow-up.svg";
import Plus from "../assets/icons/icon-plus.svg";
import { singleData } from "../models/models";

interface props {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  modal: boolean;
  handleFilters: (e: number) => void;
  filteredData: singleData[];
  invocesMesage: string;
  filters: boolean[];
}

const Header: React.FC<props> = ({
  setModal,
  modal,
  handleFilters,
  filteredData,
  invocesMesage,
  filters,
}) => {
  const [showDrop, setShowDrop] = useState<boolean>(false);

  return (
    <header className={modal ? "posTop" : ""}>
      <div className="left-side">
        <h1>Invoices</h1>
        {filteredData.length > 0 && (
          <p>
            <span className="text-display-none">There are</span>
            &nbsp;{filteredData.length}&nbsp;
            <span className="text-display-none">{invocesMesage}</span> invoices.
          </p>
        )}
        {!filteredData.length && <p>No invoices</p>}
      </div>
      <div className="fillter-toggle">
        <button
          className="fillter-by-status"
          onClick={() => setShowDrop(!showDrop)}
        >
          Filter<span className="fillter-by-status-span">&nbsp;by status</span>
          <span>
            {showDrop ? (
              <img src={ArrowUp} alt="ArrowUp" />
            ) : (
              <img src={ArrowDown} alt="ArrowDown" />
            )}
          </span>
        </button>
        <div className="fillter-drop-down-div">
          {showDrop && (
            <div className="fillter-drop-down">
              <label htmlFor="paid">
                <input
                  name="paid"
                  id="paid"
                  type="checkbox"
                  defaultChecked={filters[0] ? true : false}
                  onChange={() => handleFilters(0)}
                />
                <span>Paid</span>
              </label>
              <label htmlFor="pending">
                <input
                  name="pending"
                  id="pending"
                  type="checkbox"
                  defaultChecked={filters[1] ? true : false}
                  onChange={() => handleFilters(1)}
                />
                <span>Pending</span>
              </label>
              <label htmlFor="draft">
                <input
                  name="draft"
                  id="draft"
                  type="checkbox"
                  defaultChecked={filters[2] ? true : false}
                  onChange={() => handleFilters(2)}
                />
                <span>Draft</span>
              </label>
            </div>
          )}
        </div>
        <button className="toggle-btn" onClick={() => setModal(!modal)}>
          <img src={Plus} alt="Plus" />
          <span>
            New<span className="text-display-none">&nbsp;Invoice</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
