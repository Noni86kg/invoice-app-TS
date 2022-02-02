import React, { useState, useEffect } from "react";
import "./Modal.css";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { ItemsArrData, singleData } from "../models/models";
import { ReactComponent as Delete } from "./../assets/icons/icon-delete.svg";
import LeftArrow from "../assets/icons/icon-arrow-left.svg";

interface propsPrince {
  control: any;
  index: number;
}

const Price: React.FC<propsPrince> = ({ control, index }) => {
  const value = useWatch({
    control,
    name: `items.${index}`,
    defaultValue: {},
  });
  return (
    <span className="item-total">
      {" "}
      <p>{(value.quantity || 0) * (value.price || 0)}</p>
    </span>
  );
};

// Make random ID
const randomIDFunc = () => {
  let randomID = "";
  for (let i = 0; i < 6; i++) {
    if (i < 2) {
      randomID += String.fromCharCode(
        0 | (Math.random() * 26 + 97)
      ).toUpperCase();
    } else {
      randomID += Math.floor(Math.random() * 10);
    }
  }
  return randomID;
};

// Date Today
const dateFunc = () => {
  let today: string | Date = new Date();
  let dd: string | number = today.getDate();

  let MM: string | number = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (MM < 10) {
    MM = "0" + MM;
  }

  return (today = yyyy + "-" + MM + "-" + dd);
};

// paymentDue Today
const paymentDueFunc = (item: Date) => {
  let today: string | Date = new Date(item);
  let dd: string | number = today.getDate();

  let MM: string | number = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (MM < 10) {
    MM = "0" + MM;
  }

  return (today = yyyy + "-" + MM + "-" + dd);
};

interface props {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: singleData[];
  setData: React.Dispatch<React.SetStateAction<singleData[]>>;
  filters: boolean[];
  filteredData: singleData[];
  setFilteredData: React.Dispatch<React.SetStateAction<singleData[]>>;
  edit: boolean;
  singleCardItem: any;
  setSingleCardItem: any;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<props> = ({
  setModal,
  data,
  setData,
  filters,
  filteredData,
  setFilteredData,
  edit,
  singleCardItem,
  setSingleCardItem,
  setEdit,
}) => {
  const [itemStatus, setItemStatus] = useState<string>("");
  const [itemsArrError, setItemsArrError] = useState<boolean>(false);

  useEffect(() => {
    if (edit) {
      setItemStatus(singleCardItem.status);
    }
  }, [edit]);

  const closeModal: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as Element).classList[0] === "overlay") {
      {
        edit ? closeEditedModal() : setModal(false);
      }
    }
  };

  const closeEditedModal = () => {
    const oldSingleCardItem = filteredData.filter(
      (item) => item.id === singleCardItem.id
    );

    setSingleCardItem(...oldSingleCardItem);
    setModal(false);
    setEdit(false);
  };

  const handleDeleteItem = (e: number) => {
    remove(e);
    const itemArr = singleCardItem.items.slice(
      0,
      singleCardItem.items.length - 1
    );
    setSingleCardItem({ ...singleCardItem, items: itemArr });
  };

  const handleAddItemsInput = () => {
    setSingleCardItem({
      ...singleCardItem,
      items: [
        ...singleCardItem.items,
        {
          name: "",
          quantity: 0,
          price: 0,
        },
      ],
    });
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let { fields, append, remove } = useFieldArray<any>({
    control,
    name: "items",
  });

  function addDays(date: Date, days: number): Date {
    var futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }

  const onSubmit = (singleData: any) => {
    setItemsArrError(false);
    const newID = randomIDFunc();
    const newPaymentTerms = parseInt(singleData.paymentTerms);
    const newPaymentDue = addDays(singleData.createdAt, newPaymentTerms);
    const newPaymentDueEddited = paymentDueFunc(newPaymentDue);
    let newItems = singleData.items.map((item: ItemsArrData) => {
      return {
        ...item,
        id: Math.random(),
        total: parseInt(item.quantity) * parseInt(item.price),
      };
    });

    if (!newItems.length) {
      setItemsArrError(true);
      return;
    }
    let totalNum: number = 0;
    newItems.map((item: ItemsArrData) => {
      totalNum += parseInt(item.total);
    });
    const totalFixed = totalNum.toFixed(2);

    const newData = {
      id: newID,
      status: itemStatus,
      ...singleData,
      paymentDue: newPaymentDueEddited,
      items: newItems,
      total: totalFixed,
    };

    if (
      (filters[1] === true && itemStatus === "pending") ||
      (filters[2] === true && itemStatus === "draft")
    ) {
      {
        edit
          ? setFilteredData(
              filteredData.map((item, id) =>
                item.id === singleCardItem.id ? newData : item
              )
            )
          : setFilteredData([...filteredData, newData]);
      }
    }
    {
      edit
        ? setData(
            data.map((item, id) =>
              item.id === singleCardItem.id ? newData : item
            )
          )
        : setData([...data, newData]);
    }

    {
      edit && setSingleCardItem(newData);
    }
    setModal(false);
    setEdit(false);
  };

  return (
    <div className="overlay" id="overlay" onClick={closeModal}>
      <div className="modal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button className="btn-back" onClick={() => setModal(false)}>
            <img src={LeftArrow} alt="LeftArrow" />
            Go back
          </button>
          {edit && (
            <h2>
              Edit <span style={{ color: "#888EB0" }}>#</span>
              {singleCardItem.id}
            </h2>
          )}
          {!edit && <h2>New Invoice</h2>}
          {/* Bill From */}
          <h4>Bill From</h4>

          <label htmlFor="billToAddres">
            Street Address
            {errors?.senderAddress?.street && <span>can’t be empty</span>}
          </label>
          <br />
          <input
            id="billToAddres"
            type="text"
            defaultValue={edit ? singleCardItem.senderAddress.street : ""}
            className={errors?.senderAddress?.street ? "redBorder" : ""}
            {...register("senderAddress.street", {
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />

          <div className="city-postCode-country">
            <div className="bill-to-city">
              <label htmlFor="bill-to-city">
                City
                {errors?.senderAddress?.city && <span>can’t be empty</span>}
              </label>
              <br />
              <input
                id="bill-to-city"
                type="text"
                defaultValue={edit ? singleCardItem.senderAddress.city : ""}
                className={errors?.senderAddress?.city ? "redBorder" : ""}
                {...register("senderAddress.city", {
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </div>

            <div className="bill-to-postCode">
              <label htmlFor="bill-to-postCode">
                Post Code
                {errors?.senderAddress?.postCode && <span>can’t be empty</span>}
              </label>
              <br />
              <input
                id="bill-to-postCode"
                type="text"
                defaultValue={edit ? singleCardItem.senderAddress.postCode : ""}
                className={errors?.senderAddress?.postCode ? "redBorder" : ""}
                {...register("senderAddress.postCode", {
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </div>

            <div className="bill-to-country">
              <label htmlFor="bill-to-country">
                Country
                {errors?.senderAddress?.country && <span>can’t be empty</span>}
              </label>
              <br />
              <input
                id="bill-to-country"
                type="text"
                defaultValue={edit ? singleCardItem.senderAddress.country : ""}
                className={errors?.senderAddress?.country ? "redBorder" : ""}
                {...register("senderAddress.country", {
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </div>
          </div>

          {/* Bill To */}
          <h4>Bill To</h4>

          <label htmlFor="bill-from-name">
            Client’s Name {errors.clientName && <span>can’t be empty</span>}
          </label>
          <br />
          <input
            id="bill-from-name"
            type="text"
            defaultValue={edit ? singleCardItem.clientName : ""}
            className={errors.clientName ? "redBorder" : ""}
            {...register("clientName", {
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />

          <label htmlFor="bill-from-email">
            Client’s Email
            {errors.clientEmail && <span>{errors.clientEmail.message}</span>}
          </label>
          <br />
          <input
            id="bill-from-email"
            type="email"
            placeholder="e.g.email@example.com"
            defaultValue={edit ? singleCardItem.clientEmail : ""}
            className={errors.clientEmail ? "redBorder" : ""}
            {...register("clientEmail", {
              required: "can’t be empty",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "This input is for mail. e.g.email@example.com",
              },
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />

          <label htmlFor="bill-from-address">
            Client’s Address{" "}
            {errors?.clientAddress?.street && <span>can’t be empty</span>}
          </label>
          <br />
          <input
            id="bill-from-address"
            type="text"
            defaultValue={edit ? singleCardItem.clientAddress.street : ""}
            className={errors?.clientAddress?.street ? "redBorder" : ""}
            {...register("clientAddress.street", {
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />

          <div className="city-postCode-country">
            <div className="bill-from-city">
              <label htmlFor="bill-from-city">
                City{" "}
                {errors?.clientAddress?.city && <span>can’t be empty</span>}
              </label>
              <br />
              <input
                id="bill-from-city"
                type="text"
                defaultValue={edit ? singleCardItem.clientAddress.city : ""}
                className={errors?.clientAddress?.city ? "redBorder" : ""}
                {...register("clientAddress.city", {
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </div>

            <div className="bill-from-postCode">
              <label htmlFor="bill-from-postCode">
                Post Code{" "}
                {errors?.clientAddress?.postCode && <span>can’t be empty</span>}
              </label>
              <br />
              <input
                id="bill-from-postCode"
                type="text"
                defaultValue={edit ? singleCardItem.clientAddress.postCode : ""}
                className={errors?.clientAddress?.postCode ? "redBorder" : ""}
                {...register("clientAddress.postCode", {
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </div>

            <div className="bill-from-country">
              <label htmlFor="bill-from-country">
                Country{" "}
                {errors?.clientAddress?.country && <span>can’t be empty</span>}
              </label>
              <br />
              <input
                id="bill-from-country"
                type="text"
                defaultValue={edit ? singleCardItem.clientAddress.country : ""}
                className={errors?.clientAddress?.country ? "redBorder" : ""}
                {...register("clientAddress.country", {
                  required: true,
                  validate: (value) => {
                    return !!value.trim();
                  },
                })}
              />
            </div>
          </div>

          {/* Date */}
          <div className="date-payment">
            <div className="date">
              <label htmlFor="date">Issue Date</label>
              <br />
              <input
                id="date"
                type="date"
                defaultValue={
                  edit ? paymentDueFunc(singleCardItem.createdAt) : dateFunc()
                }
                className={errors.createdAt ? "redBorder" : ""}
                {...register("createdAt", {
                  required: true,
                })}
              />
            </div>

            <div className="paymentTerms">
              <label htmlFor="paymentTerms">Payment Terms</label>
              <br />
              <select
                id="paymentTerms"
                defaultValue={edit ? singleCardItem.paymentTerms : "1"}
                {...register("paymentTerms", {
                  required: true,
                })}
              >
                <option value="1">Net 1 Days</option>
                <option value="7">Net 7 Days</option>
                <option value="14">Net 14 Days</option>
                <option value="30">Net 30 Days</option>
              </select>
            </div>
          </div>

          <label htmlFor="description">
            Description
            {errors.description && <span>can’t be empty</span>}
          </label>
          <br />
          <input
            id="description"
            type="text"
            defaultValue={edit ? singleCardItem.description : ""}
            placeholder="e.g.Graphic Design Service"
            className={errors.description ? "redBorder" : ""}
            {...register("description", {
              required: true,
              validate: (value) => {
                return !!value.trim();
              },
            })}
          />

          {/* Item List */}
          <div className="item-list">
            <h3>Item List</h3>

            {/* Edit Item List */}
            {edit && (
              <div>
                {singleCardItem.items.map(
                  ({ name, quantity, price }: any, index: number) => {
                    return (
                      <div className="item-list-single" key={index}>
                        <div className="item-name">
                          {index === 0 && (
                            <label className="items-label">Item Name</label>
                          )}
                          <label className="items-label-mob">Item Name</label>
                          <br />
                          <input
                            type="text"
                            {...register(`items.${index}.name`, {
                              required: true,
                              validate: (value) => {
                                return !!value.trim();
                              },
                            })}
                            defaultValue={name}
                          />
                        </div>
                        <div className="item-Qty">
                          {index === 0 && (
                            <label className="items-label">Qty.</label>
                          )}
                          <label className="items-label-mob">Qty.</label>
                          <br />
                          <input
                            type="number"
                            {...register(`items.${index}.quantity`, {
                              required: true,
                              min: 1,
                            })}
                            defaultValue={quantity}
                          />
                        </div>
                        <div className="item-price">
                          {index === 0 && (
                            <label className="items-label">Price</label>
                          )}
                          <label className="items-label-mob">Price</label>
                          <br />
                          <input
                            type="number"
                            step="any"
                            {...register(`items.${index}.price`, {
                              required: true,
                              min: 1,
                            })}
                            defaultValue={price}
                          />
                        </div>
                        <div className="item-total">
                          {index === 0 && (
                            <label className="items-label">Total</label>
                          )}
                          <label className="items-label-mob">Total</label>
                          <br />
                          <div className="item-total-delete">
                            <Price control={control} index={index} />

                            <div
                              className="btn-delete"
                              onClick={() => handleDeleteItem(index)}
                            >
                              <Delete />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* New Item List */}
            {!edit && (
              <div>
                {fields.map(({ name, quantity, price }: any, index: number) => {
                  return (
                    <div className="item-list-single" key={index}>
                      <div className="item-name">
                        {index === 0 && (
                          <label className="items-label">Item Name</label>
                        )}
                        <label className="items-label-mob">Item Name</label>
                        <br />
                        <input
                          type="text"
                          {...register(`items.${index}.name`, {
                            required: true,
                            validate: (value) => {
                              return !!value.trim();
                            },
                          })}
                          defaultValue={name}
                        />
                      </div>
                      <div className="item-Qty">
                        {index === 0 && (
                          <label className="items-label">Qty.</label>
                        )}
                        <label className="items-label-mob">Qty.</label>
                        <br />
                        <input
                          type="number"
                          {...register(`items.${index}.quantity`, {
                            required: true,
                            min: 1,
                          })}
                          defaultValue={quantity}
                        />
                      </div>
                      <div className="item-price">
                        {index === 0 && (
                          <label className="items-label">Price</label>
                        )}
                        <label className="items-label-mob">Price</label>
                        <br />
                        <input
                          type="number"
                          step="any"
                          {...register(`items.${index}.price`, {
                            required: true,
                            min: 1,
                          })}
                          defaultValue={price}
                        />
                      </div>
                      <div className="item-total">
                        {index === 0 && (
                          <label className="items-label">Total</label>
                        )}
                        <label className="items-label-mob">Total</label>
                        <br />
                        <div className="item-total-delete">
                          <Price control={control} index={index} />

                          <button
                            className="btn-delete"
                            onClick={() => remove(index)}
                          >
                            <Delete />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {edit && (
              <div
                className="add-new-item-btn"
                onClick={() => handleAddItemsInput()}
              >
                + Add New Item
              </div>
            )}
            {!edit && (
              <div className="add-new-item-btn" onClick={() => append({})}>
                + Add New Item
              </div>
            )}
            <div className="modal-bottom-error-message">
              {(errors.items || itemsArrError) && (
                <div className="error-message items-error-message">
                  - An item must be added
                </div>
              )}

              {(errors.senderAddress ||
                errors.clientName ||
                errors.clientEmail ||
                errors.clientAddress ||
                errors.description) && (
                <div className="error-message">- All fields must be added</div>
              )}
            </div>
          </div>
          {edit ? (
            <div className="modal-bottom-edit">
              <button
                className="discard-btn"
                onClick={() => closeEditedModal()}
              >
                Cancel
              </button>
              <div>
                <button type="submit" className="submit-btn purple-submit-btn">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-bottom">
              <button className="discard-btn" onClick={() => setModal(false)}>
                Discard
              </button>
              <div>
                <button
                  type="submit"
                  onClick={() => setItemStatus("draft")}
                  className="submit-btn gray-submit-btn "
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  onClick={() => setItemStatus("pending")}
                  className="submit-btn purple-submit-btn"
                >
                  Save &amp; Send
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;
