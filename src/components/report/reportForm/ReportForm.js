import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ReportForm.scss";
import Card from "../../card/Card";
import { v4 as uuidv4 } from "uuid";

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
  // At the beginning of the component
  //console.log("saveReport prop:", saveReport);

  const [validationError, setValidationError] = useState("");

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

  // Updated validation function to check all required fields
  const validateForm = () => {
    if (!report.date) {
      setValidationError("Please select a date.");
      return false;
    }

    for (const productKey in report.products) {
      const product = report.products[productKey];

      // Validate tanks and pumps fields
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
            }
          } else {
            if (!field.opening || !field.closing) {
              setValidationError(
                "All tank fields must have opening and closing values."
              );
              return false;
            }
          }
        }
      }

      // Validate product rate
      if (
        product.rate === undefined ||
        product.rate === null ||
        product.rate === ""
      ) {
        setValidationError(`Please enter the rate for ${productKey}.`);
        return false;
      }

      // Validate total sales breakdown (POS, cash, expenses)
      const breakdown = product.totalSalesBreakdown || {};
      if (
        breakdown.pos === undefined ||
        breakdown.pos === "" ||
        breakdown.cash === undefined ||
        breakdown.cash === "" ||
        breakdown.expenses === undefined ||
        breakdown.expenses === ""
      ) {
        setValidationError(
          `Please enter POS, cash, and expenses for ${productKey}.`
        );
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  // Modified saveReport function to include validation
  const handleSaveReport = (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveReport(); // Remove the event argument
    }
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
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={report.date || ""}
                onChange={handleInputChange}
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
