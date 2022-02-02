import React from "react";

const EmptyCardList = () => {
  return (
    <>
      <div className="empty-card-list">
        <div className="empty-card-list-bg"></div>
        <h2>There is nothing here</h2>
        <p>
          Create a new invoice by clicking the <b>New Invoice</b> button and get
          started
        </p>
      </div>
    </>
  );
};

export default EmptyCardList;
