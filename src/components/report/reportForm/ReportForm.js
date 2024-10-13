import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ReportForm.scss";
import Card from "../../card/Card";
import { v4 as uuidv4 } from "uuid";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS

const ReportForm = ({
  report,
  notes,
  setNotes,
  handleInputChange,
  handleImageChange,
  saveReport,
  setReport,
  imagePreviews,
  isEditMode,
}) => {
  const [validationError, setValidationError] = useState("");
  const [dateMismatch, setDateMismatch] = useState(false);

  const handleAddField = (product, type) => {
    if (type === "pumps") {
      const newPump = { id: uuidv4(), nozzles: [] };
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
      handleAddNozzle(product, newPump.id);
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

  const validateDate = () => {
    const today = new Date().toISOString().split("T")[0];
    if (report.date && report.date !== today) {
      setDateMismatch(true);
      return false;
    }
    setDateMismatch(false);
    return true;
  };

  const validateForm = () => {
    let atLeastOneProductComplete = false;
    let allProductComplete = true;
    let errors = [];
    let warnings = [];

    for (const productKey in report.products) {
      const product = report.products[productKey];
      const dippingTanksAdded =
        product.dippingTanks && product.dippingTanks.length > 0;
      const pumpsAdded = product.pumps && product.pumps.length > 0;

      // Error: If DippingTanks is added, but Pumps are not added
      if (dippingTanksAdded && !pumpsAdded) {
        errors.push(
          `Please add Pumps for ${productKey} if DippingTanks are added.`
        );
      }

      // Error: If Pumps are added, but DippingTanks are not added
      if (pumpsAdded && !dippingTanksAdded) {
        errors.push(
          `Please add DippingTanks for ${productKey} if Pumps are added.`
        );
      }

      // Error: DippingTanks closing value must be less than opening value
      if (dippingTanksAdded) {
        product.dippingTanks.forEach((tank) => {
          if (parseFloat(tank.closing) > parseFloat(tank.opening)) {
            errors.push(
              `${productKey}: DippingTank closing value must be less than opening value.`
            );
          }
        });
      }

      // Error: Pump Nozzle opening value must be less than closing value
      if (pumpsAdded) {
        product.pumps.forEach((pump) => {
          pump.nozzles?.forEach((nozzle) => {
            if (parseFloat(nozzle.opening) > parseFloat(nozzle.closing)) {
              errors.push(
                `${productKey}: Nozzle opening value must be less than closing value.`
              );
            }
          });
        });
      }

      // **Validate product rate**: Rate must be a positive value
      if (dippingTanksAdded || pumpsAdded) {
        if (!product.rate || product.rate <= 0) {
          errors.push(`Please enter a valid rate for ${productKey}.`);
        }

        // **Validate total sales breakdown (POS, cash, expenses)**
        const breakdown = product.totalSalesBreakdown || {};
        if (
          !breakdown.pos ||
          !breakdown.cash ||
          !breakdown.expenses ||
          breakdown.pos === "" ||
          breakdown.cash === "" ||
          breakdown.expenses === ""
        ) {
          errors.push(
            `POS, Cash, Expenses details are missing or invalid for ${productKey}.`
          );
        }

        // Mark at least one product as complete if all critical data is provided
        if (
          product.rate > 0 &&
          breakdown.pos > 0 &&
          breakdown.cash > 0 &&
          breakdown.expenses >= 0
        ) {
          atLeastOneProductComplete = true;
        } else {
          allProductComplete = false; // If any product is missing complete data
        }
      }
    }

    // Prevent submission if no complete product exists
    if (!atLeastOneProductComplete) {
      errors.push("At least one product sales detail is required.");
    }

    // Return errors if any exist, otherwise return warnings
    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return { isValid: true, warnings, allProductComplete };
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    const validationResult = validateForm();
    const dateIsValid = validateDate();

    if (!validationResult.isValid) {
      // Handle form validation errors: prevent submission
      confirmAlert({
        title: "Form Errors",
        message: validationResult.errors.join("\n"),
        buttons: [
          {
            label: "OK",
          },
        ],
      });
    } else {
      // Show warnings if any, but allow submission
      const warnings = validationResult.warnings;
      const allProductComplete = validationResult.allProductComplete;
      const dateWarning = !dateIsValid
        ? "Warning: The selected date is not today's date.\n"
        : "";

      // If all products are complete and date is valid, confirm submission without warnings
      if (allProductComplete && dateIsValid) {
        confirmFinalSave();
      } else if (warnings.length > 0 || !dateIsValid) {
        // Show warning for incomplete products or incorrect date
        confirmAlert({
          title: "Incomplete Product Data",
          message: `${dateWarning}${warnings.join(
            "\n"
          )}\n\nDo you still want to save the report?`,
          buttons: [
            {
              label: "Yes, Save",
              onClick: () => confirmFinalSave(), // Allow saving despite warnings
            },
            {
              label: "Cancel",
            },
          ],
        });
      } else {
        // Proceed to final confirmation if there's no warning but at least one product is complete
        confirmFinalSave();
      }
    }
  };

  // Final confirmation before saving the report
  const confirmFinalSave = () => {
    confirmAlert({
      title: "Final Confirmation",
      message:
        "Please confirm that you have entered all your sales data correctly.",
      buttons: [
        {
          label: "Yes, Save",
          onClick: () => saveReport(), // Proceed with saving the report
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const calculateActualTotal = (pos, cash, expenses) => {
    const actualTotal =
      parseFloat(pos) + parseFloat(cash) - parseFloat(expenses);
    return isNaN(actualTotal) ? 0 : actualTotal; // Return 0 if the calculation results in NaN
  };

  const getNozzlePlaceholder = (product, pumpIndex, nozzleIndex, field) => {
    const letter = String.fromCharCode(65 + nozzleIndex); // Convert 0 -> A, 1 -> B, etc.
    return `${product} Nozzle ${pumpIndex + 1}${letter} ${field}`;
  };

  return (
    <div className="add-report">
      <Card cardClass={"card"}>
        <form onSubmit={handleSaveReport}>
          {!isEditMode && (
            <>
              <label>
                Date: <span className="asterisk">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={report.date || ""}
                onChange={handleInputChange}
                required
              />
            </>
          )}

          {/* Add dynamic fields for products */}
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
          <ReactQuill
            theme="snow"
            value={notes}
            onChange={setNotes}
            modules={ReportForm.modules}
            formats={ReportForm.formats}
          />
          <label>Upload Images:</label>
          <code className="--color-dark">Supported Format: jpg, jpeg, png</code>
          <input type="file" multiple onChange={handleImageChange} />

          {imagePreviews.length > 0 && (
            <div>
              <h4>Image Previews:</h4>
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "150px", margin: "10px" }}
                />
              ))}
            </div>
          )}

          {validationError && (
            <div style={{ color: "red", marginBottom: "1rem" }}>
              {validationError}
            </div>
          )}

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              Save Report
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

ReportForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ReportForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ReportForm;
