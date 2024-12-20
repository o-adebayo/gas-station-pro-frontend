import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import "./ReportForm.scss";
import Card from "../../card/Card";
import { v4 as uuidv4 } from "uuid";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa"; // Import FaTimes for the "X" icon

const ReportForm = ({
  report,
  notes,
  setNotes,
  handleInputChange,
  handleImageChange,
  saveReport,
  setReport,
  imagePreviews,
  setImagePreviews, // Make sure this is passed as a prop
  newImages, // Add newImages for uploaded images
  setNewImages, // Add setter for newImages
  existingImages,
  setExistingImages,
  isEditMode,
  user, // Add user prop to check if the user is Admin
  stores, // Pass stores as prop for the Admin to select
}) => {
  const [validationError, setValidationError] = useState("");
  const [dateMismatch, setDateMismatch] = useState(false);
  const [selectedStore, setSelectedStore] = useState(""); // State for store selection

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (isEditMode) {
      // If editing an existing report, set the selected store (if any)
      setSelectedStore(report.storeId || "");
    }
  }, [isEditMode, report]);

  // Function to remove an image from the imagePreviews array
  const handleRemoveImage = (indexToRemove) => {
    // Ensure the array exists and is not undefined
    if (imagePreviews?.length > 0) {
      // Filter out the image at the index to remove
      setImagePreviews((prevPreviews) =>
        prevPreviews.filter((_, index) => index !== indexToRemove)
      );

      // Also update the newImages array accordingly if you want to remove it from there
      setNewImages((prevImages) =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  // Remove new image
  // Remove new image safely
  const handleRemoveNewImage = (index) => {
    if (imagePreviews?.length > 0) {
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(updatedPreviews); // Update previews
    }

    if (newImages?.length > 0) {
      const updatedNewImages = newImages.filter((_, i) => i !== index); // Remove from newImages
      setNewImages(updatedNewImages); // Update newImages state
    }
  };

  // Remove existing image
  // Remove existing image safely
  const handleRemoveExistingImage = (index) => {
    if (existingImages?.length > 0) {
      const updatedExistingImages = existingImages.filter(
        (_, i) => i !== index
      );
      setExistingImages(updatedExistingImages); // Update existing images
    }

    if (imagePreviews?.length > 0) {
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(updatedPreviews); // Update imagePreviews
    }
  };

  const handleStoreSelect = (e) => {
    setSelectedStore(e.target.value);
    setReport({ ...report, storeId: e.target.value }); // Update report with selected store ID
  };

  const handleAddField = (product, type) => {
    if (type === "pumps") {
      const newPump = { id: uuidv4(), nozzles: [] };

      // Create two nozzles by default
      const nozzle1 = { id: uuidv4(), opening: "", closing: "" };
      const nozzle2 = { id: uuidv4(), opening: "", closing: "" };

      // Add the new pump with two nozzles to the report state
      setReport((prevState) => ({
        ...prevState,
        products: {
          ...prevState.products,
          [product]: {
            ...prevState.products[product],
            [type]: [
              ...(prevState.products[product][type] || []),
              {
                ...newPump,
                nozzles: [nozzle1, nozzle2], // Add two nozzles by default
              },
            ],
          },
        },
      }));
    } else {
      const newField = { id: uuidv4(), opening: "", closing: "" };
      setReport((prevState) => ({
        ...prevState,
        products: {
          ...prevState.products,
          [product]: {
            ...prevState.products[product],
            [type]: [...(prevState.products[product][type] || []), newField],
          },
        },
      }));
    }
  };

  /*   const handleAddField = (product, type) => {
    const newId = uuidv4();

    if (type === "pumps") {
      const newPump = { id: newId, nozzles: [] };
      setReport((prevState) => ({
        ...prevState,
        products: {
          ...prevState.products,
          [product]: {
            ...prevState.products[product],
            [type]: [...(prevState.products[product][type] || []), newPump],
          },
        },
      }));
      handleAddNozzle(product, newPump.id);
    } else {
      const newField = { id: newId, opening: "", closing: "" };
      setReport((prevState) => ({
        ...prevState,
        products: {
          ...prevState.products,
          [product]: {
            ...prevState.products[product],
            [type]: [...(prevState.products[product][type] || []), newField],
          },
        },
      }));
    }
  }; */

  const handleAddNozzle = (product, pumpId) => {
    const newNozzle = { id: uuidv4(), opening: "", closing: "" };
    setReport((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        [product]: {
          ...prevState.products[product],
          pumps: prevState.products[product].pumps?.map((pump) =>
            pump.id === pumpId
              ? { ...pump, nozzles: [...(pump.nozzles || []), newNozzle] }
              : pump
          ),
        },
      },
    }));
  };

  const handleRemoveField = (product, type, id) => {
    setReport((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        [product]: {
          ...prevState.products[product],
          [type]: prevState.products[product][type]?.filter(
            (field) => field.id !== id
          ),
        },
      },
    }));
  };

  const handleRemoveNozzle = (product, pumpId, nozzleId) => {
    setReport((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        [product]: {
          ...prevState.products[product],
          pumps: prevState.products[product].pumps?.map((pump) =>
            pump.id === pumpId
              ? {
                  ...pump,
                  nozzles: pump.nozzles?.filter(
                    (nozzle) => nozzle.id !== nozzleId
                  ),
                }
              : pump
          ),
        },
      },
    }));
  };

  const handleFieldChange = (product, type, id, field, value) => {
    setReport((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        [product]: {
          ...prevState.products[product],
          [type]: prevState.products[product][type]?.map((fieldItem) =>
            fieldItem.id === id ? { ...fieldItem, [field]: value } : fieldItem
          ),
        },
      },
    }));
  };

  const handleNozzleChange = (product, pumpId, nozzleId, field, value) => {
    setReport((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        [product]: {
          ...prevState.products[product],
          pumps: prevState.products[product].pumps?.map((pump) =>
            pump.id === pumpId
              ? {
                  ...pump,
                  nozzles: pump.nozzles?.map((nozzle) =>
                    nozzle.id === nozzleId
                      ? { ...nozzle, [field]: value }
                      : nozzle
                  ),
                }
              : pump
          ),
        },
      },
    }));
  };

  // Function to show confirmation dialog for date mismatch or incomplete products
  const confirmSubmit = (message) => {
    confirmAlert({
      title: "Confirmation Required",
      message,
      buttons: [
        {
          label: "Yes, Save",
          onClick: () => saveReport(),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  /*   const validateDate = () => {
    const today = new Date().toISOString().split("T")[0];
    console.log("todays date is", today);
    console.log("report date is", report.date);

    if (report.date && report.date !== today) {
      setDateMismatch(true);
      return false;
    }
    setDateMismatch(false);
    return true;
  }; */

  // this is better as it uses UTC
  const validateDate = () => {
    // Get today's date in UTC without time information
    let date = Date();
    const today = dayjs(date).format("YYYY-MM-DD");

    //console.log("🚀 ~ validateDate ~ today:", today);

    // Convert report.date to UTC and extract date part (YYYY-MM-DD)
    const reportDate = dayjs(report.date).format("YYYY-MM-DD");
    //console.log("🚀 ~ validateDate ~ reportDate:", reportDate);

    //console.log("todays date is", today);
    //console.log("report date is", reportDate);

    if (report.date && reportDate !== today) {
      setDateMismatch(true);
      return false;
    }

    setDateMismatch(false);
    return true;
  };

  const validateForm = () => {
    let atLeastOneProductComplete = false;

    for (const productKey in report.products) {
      const product = report.products[productKey];
      const dippingTanksAdded =
        product.dippingTanks && product.dippingTanks.length > 0;
      const pumpsAdded = product.pumps && product.pumps.length > 0;

      if (dippingTanksAdded && !pumpsAdded) {
        setValidationError(
          `Please add Pumps for ${productKey} if DippingTanks is added.`
        );
        return false;
      }

      if (pumpsAdded && !dippingTanksAdded) {
        setValidationError(
          `Please add DippingTanks for ${productKey} if Pumps is added.`
        );
        return false;
      }

      if (dippingTanksAdded || pumpsAdded) {
        for (const type of ["dippingTanks", "pumps"]) {
          const fields = product[type] || [];
          for (const field of fields) {
            if (type === "pumps") {
              for (const nozzle of field.nozzles) {
                if (!nozzle.opening || !nozzle.closing) {
                  setValidationError(
                    "All nozzle fields must have opening and closing values."
                  );
                  return false;
                }
                if (parseFloat(nozzle.opening) > parseFloat(nozzle.closing)) {
                  setValidationError(
                    `For ${productKey}, each nozzle's closing must be greater than its opening.`
                  );
                  return false;
                }
              }
            } else {
              if (!field.opening || !field.closing) {
                setValidationError(
                  "All tank fields must have opening and closing values."
                );
                return false;
              }
              if (parseFloat(field.closing) > parseFloat(field.opening)) {
                setValidationError(
                  `For ${productKey}, the closing value for tanks must be less than the opening value.`
                );
                return false;
              }
            }
          }
        }

        // Validate product rate
        if (!product.rate) {
          setValidationError(`Please enter the rate for ${productKey}.`);
          return false;
        }

        // Validate total sales breakdown (POS, cash, expenses)
        const breakdown = product.totalSalesBreakdown || {};
        if (
          !breakdown.pos ||
          !breakdown.cash ||
          !breakdown.expenses ||
          breakdown.pos === "" ||
          breakdown.cash === "" ||
          breakdown.expenses === ""
        ) {
          setValidationError(
            `Please enter POS, cash, and expenses for ${productKey}.`
          );
          return false;
        }

        atLeastOneProductComplete = true;
      }
    }

    if (!atLeastOneProductComplete) {
      setValidationError("At least one product sales detail is required.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    const formIsValid = validateForm();
    const dateIsValid = validateDate();

    if (formIsValid) {
      if (!dateIsValid) {
        confirmSubmit(
          "The selected date is not today. Do you still want to proceed?"
        );
      } else {
        confirmSubmit(
          "Please confirm that you have entered all your sales data correctly?"
        );
      }
    }
  };

  const calculateActualTotal = (pos, cash, expenses) => {
    const actualTotal =
      parseFloat(pos) + parseFloat(cash) - parseFloat(expenses);
    return isNaN(actualTotal) ? 0 : actualTotal; // Return 0 if NaN
  };

  const getNozzlePlaceholder = (product, pumpIndex, nozzleIndex, field) => {
    const letter = String.fromCharCode(65 + nozzleIndex); // Convert 0 -> A, 1 -> B, etc.
    return `${product} Nozzle ${pumpIndex + 1}${letter} ${field}`;
  };

  const handleCancel = () => {
    navigate("/reports"); // Navigate to dashboard on cancel
  };

  return (
    <div className="add-report">
      <Card cardClass={"card"}>
        <form onSubmit={handleSaveReport}>
          {/* Show store selection for Admin users */}
          {user?.role === "admin" && (
            <>
              <label>
                Select Store: <span className="asterisk">*</span>
              </label>
              <select
                name="storeId"
                value={report.storeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Store</option>
                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {!isEditMode && (
            <>
              <label>
                Date: <span className="asterisk">*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select date"
                  value={report.date ? dayjs(report.date) : null}
                  onChange={(newValue) => {
                    handleInputChange({
                      target: {
                        name: "date",
                        value: newValue ? dayjs(newValue).toISOString() : "",
                      },
                    });
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      InputProps: {
                        style: { color: "black" }, // Set text color to black
                      },
                      InputLabelProps: {
                        style: { color: "black" }, // Set label color to black
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              {/*  <input
                type="date"
                name="date"
                value={report.date || ""}
                onChange={handleInputChange}
                required
              /> */}
              <hr />
            </>
          )}

          {/* Dynamic fields for products */}
          {Object.keys(report.products).map((product) => (
            <div key={product}>
              <h4>{product}</h4>
              {["dippingTanks", "pumps"].map((type) => {
                const fields = report.products[product][type] || [];
                return (
                  <div key={type}>
                    <label>
                      {type.charAt(0).toUpperCase() + type.slice(1)} (
                      {fields.length})
                    </label>
                    {fields.map((field, pumpIndex) => (
                      <div key={field.id}>
                        {type === "pumps" ? (
                          <>
                            <h5>Pump</h5>
                            {field.nozzles?.map((nozzle, nozzleIndex) => (
                              <div key={nozzle.id}>
                                <input
                                  type="text"
                                  placeholder={getNozzlePlaceholder(
                                    product,
                                    pumpIndex,
                                    nozzleIndex,
                                    "Opening"
                                  )}
                                  value={nozzle.opening}
                                  onChange={(e) =>
                                    handleNozzleChange(
                                      product,
                                      field.id,
                                      nozzle.id,
                                      "opening",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder={getNozzlePlaceholder(
                                    product,
                                    pumpIndex,
                                    nozzleIndex,
                                    "Closing"
                                  )}
                                  value={nozzle.closing}
                                  onChange={(e) =>
                                    handleNozzleChange(
                                      product,
                                      field.id,
                                      nozzle.id,
                                      "closing",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  className="remove-nozzle"
                                  onClick={() =>
                                    handleRemoveNozzle(
                                      product,
                                      field.id,
                                      nozzle.id
                                    )
                                  }
                                >
                                  Remove Nozzle
                                </button>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder={`${product} Tank ${
                                pumpIndex + 1
                              } Opening`}
                              value={field.opening}
                              onChange={(e) =>
                                handleFieldChange(
                                  product,
                                  type,
                                  field.id,
                                  "opening",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="text"
                              placeholder={`${product} Tank ${
                                pumpIndex + 1
                              } Closing`}
                              value={field.closing}
                              onChange={(e) =>
                                handleFieldChange(
                                  product,
                                  type,
                                  field.id,
                                  "closing",
                                  e.target.value
                                )
                              }
                            />
                          </>
                        )}
                        <button
                          type="button"
                          className={`remove-${type}`}
                          onClick={() =>
                            handleRemoveField(product, type, field.id)
                          }
                        >
                          Remove {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className={
                        type === "dippingTanks" ? "add-tanks" : "add-pumps"
                      }
                      onClick={() => handleAddField(product, type)}
                    >
                      Add {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  </div>
                );
              })}

              {/* Rate input for the product */}
              <label>Rate for {product}:</label>
              <input
                type="number"
                placeholder={`Enter rate for ${product}`}
                value={report.products[product].rate || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setReport((prevState) => ({
                    ...prevState,
                    products: {
                      ...prevState.products,
                      [product]: {
                        ...prevState.products[product],
                        rate: value,
                      },
                    },
                  }));
                }}
              />

              {/* Total Sales Breakdown for the product */}
              <h5>Total Sales Breakdown</h5>
              <div className="total-sales-breakdown">
                <div className="input-group">
                  <div>
                    <label>POS:</label>
                    <input
                      type="number"
                      placeholder="POS Amount"
                      value={
                        report.products[product].totalSalesBreakdown?.pos || ""
                      }
                      onChange={(e) => {
                        const pos = parseFloat(e.target.value) || 0;
                        const cash =
                          report.products[product].totalSalesBreakdown?.cash ||
                          0;
                        const expenses =
                          report.products[product].totalSalesBreakdown
                            ?.expenses || 0;

                        setReport((prevState) => ({
                          ...prevState,
                          products: {
                            ...prevState.products,
                            [product]: {
                              ...prevState.products[product],
                              totalSalesBreakdown: {
                                ...prevState.products[product]
                                  .totalSalesBreakdown,
                                pos,
                                actualTotal: calculateActualTotal(
                                  pos,
                                  cash,
                                  expenses
                                ),
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label>Cash:</label>
                    <input
                      type="number"
                      placeholder="Cash Amount"
                      value={
                        report.products[product].totalSalesBreakdown?.cash || ""
                      }
                      onChange={(e) => {
                        const cash = parseFloat(e.target.value) || 0;
                        const pos =
                          report.products[product].totalSalesBreakdown?.pos ||
                          0;
                        const expenses =
                          report.products[product].totalSalesBreakdown
                            ?.expenses || 0;

                        setReport((prevState) => ({
                          ...prevState,
                          products: {
                            ...prevState.products,
                            [product]: {
                              ...prevState.products[product],
                              totalSalesBreakdown: {
                                ...prevState.products[product]
                                  .totalSalesBreakdown,
                                cash,
                                actualTotal: calculateActualTotal(
                                  pos,
                                  cash,
                                  expenses
                                ),
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label>Expenses:</label>
                    <input
                      type="number"
                      placeholder="Expenses"
                      value={
                        report.products[product].totalSalesBreakdown
                          ?.expenses || ""
                      }
                      onChange={(e) => {
                        const expenses = parseFloat(e.target.value) || 0;
                        const pos =
                          report.products[product].totalSalesBreakdown?.pos ||
                          0;
                        const cash =
                          report.products[product].totalSalesBreakdown?.cash ||
                          0;

                        setReport((prevState) => ({
                          ...prevState,
                          products: {
                            ...prevState.products,
                            [product]: {
                              ...prevState.products[product],
                              totalSalesBreakdown: {
                                ...prevState.products[product]
                                  .totalSalesBreakdown,
                                expenses,
                                actualTotal: calculateActualTotal(
                                  pos,
                                  cash,
                                  expenses
                                ),
                              },
                            },
                          },
                        }));
                      }}
                    />
                  </div>
                </div>

                <h6>
                  Actual Sale:{" "}
                  {report.products[product].totalSalesBreakdown?.actualTotal ||
                    0}
                </h6>
              </div>

              <hr />
            </div>
          ))}

          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)} // Capture the text change
            rows={10} // You can adjust the number of rows for the textarea
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #e6e6e6",
            }} // Inline styling for customization
          />

          <label>Upload Images:</label>
          <code className="--color-dark">Supported Format: jpg, jpeg, png</code>
          <input type="file" multiple onChange={handleImageChange} />

          {imagePreviews.length > 0 && (
            <div>
              <h4>Image Previews:</h4>
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{ width: "150px", margin: "10px" }}
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={
                      () =>
                        index < (existingImages?.length || 0)
                          ? handleRemoveExistingImage(index) // Remove existing image
                          : handleRemoveNewImage(
                              index - (existingImages?.length || 0)
                            ) // Remove new image
                    }
                  >
                    <FaTimes className="remove-image-icon" /> {/* "X" icon */}
                  </button>
                </div>
              ))}
            </div>
          )}

          {validationError && (
            <div style={{ color: "red", marginBottom: "1rem" }}>
              {validationError}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="text-reg navigation__cta">
              Save Report
            </button>
            <button
              type="button"
              className="text-reg cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReportForm;
