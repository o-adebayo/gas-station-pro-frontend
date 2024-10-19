import React, { useEffect, useState } from "react";
import "./StoreList.scss";
import ChangeStoreManager from "../../components/changeStoreManager/ChangeStoreManager";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoreLocations,
  selectStores,
  selectIsLoading,
  deleteStoreLocation,
  importStores,
} from "../../redux/features/storeLocation/storeLocationSlice";
import {
  fetchUsers,
  selectUser,
  selectIsLoggedIn,
  selectUsers,
} from "../../redux/features/auth/authSlice";
import Loader, { SpinnerImg } from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

const StoreList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [csvFile, setCsvFile] = useState(null); // New state to store the file

  // Fetch user and store data from Redux
  const user = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.storeLocation);
  const storesData = useSelector(selectStores);
  const stores = storesData?.stores || [];

  // Fetch users and stores data
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user && user.companyCode) {
      dispatch(fetchStoreLocations());
    }
  }, [dispatch, user]);

  const delStore = async (id) => {
    await dispatch(deleteStoreLocation(id));
    dispatch(fetchStoreLocations());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This Store",
      message:
        "Deleting a store cannot be undone. Are you sure you want to delete this store?",
      buttons: [
        {
          label: "Delete",
          onClick: () => delStore(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  const getManagerName = (managerId) => {
    if (!managerId) {
      return "Not Assigned";
    }
    const manager = users.find(
      (user) => String(user._id) === String(managerId)
    );
    return manager ? manager.name : "Not Assigned";
  };

  const handleCSVUpload = (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("csvFile", file);

      dispatch(importStores(formData))
        .unwrap()
        .then((response) => {
          const { count, existingStores, invalidRows } = response;

          // Notify user of successful imports
          toast.success(`${count} stores imported successfully.`);

          // Check if any stores were skipped
          if (existingStores && existingStores.length > 0) {
            const skippedStoreNames = existingStores
              .map((store) => `${store.name} (${store.location})`)
              .join(", ");
            toast.info(
              `Skipped ${existingStores.length} existing stores: ${skippedStoreNames}`
            );
          }

          // Check if any invalid rows were found
          if (invalidRows && invalidRows.length > 0) {
            const invalidRowMessages = invalidRows
              .map((row) => `Row ${row.row}: ${row.message}`)
              .join("; ");
            toast.warn(
              `${invalidRows.length} invalid rows skipped: ${invalidRowMessages}`
            );
          }

          // Refresh store data
          dispatch(fetchStoreLocations()); // Re-fetch stores
        })
        .catch((error) => {
          toast.error(`Failed to import stores: ${error.message}`);
        });
    }
  };

  return (
    <section className="store-list-container">
      <div className="container">
        {isLoading && <SpinnerImg />}
        <div className="store-list">
          <div className="--flex-between">
            <h3>All Stores</h3>
            {user?.role === "admin" && (
              <div className="store-actions">
                <Link to="/add-StoreLocation" className="add-store-link">
                  <button className="--btn --btn-primary">Add Store</button>
                </Link>
                <button
                  className="--btn --btn-primary"
                  onClick={() =>
                    document.getElementById("import-stores-input").click()
                  }
                >
                  Import Stores
                </button>
                <input
                  id="import-stores-input"
                  type="file"
                  accept=".csv"
                  style={{ display: "none" }}
                  onChange={(e) => handleCSVUpload(e.target.files[0])}
                />
              </div>
            )}
          </div>

          {!stores || stores.length === 0 ? (
            <h3>No stores found. Please try again later.</h3>
          ) : (
            <div className="store-cards">
              {stores.map((store, index) => (
                <div key={store._id} className="store-card">
                  <div className="store-info">
                    <h4>{store.name || store.storeName}</h4>
                    <p>
                      <strong>Location:</strong>{" "}
                      {store.location || store.storeLocation}
                    </p>
                    <p>
                      <strong>Pumps:</strong> {store.pumps}
                    </p>
                    <p>
                      <strong>Nozzles:</strong> {store.nozzles}
                    </p>
                    <p>
                      <strong>Tanks:</strong> {store.tanks}
                    </p>
                    <p>
                      <strong>Manager:</strong>{" "}
                      {getManagerName(store.managerId)}
                    </p>
                  </div>
                  <div className="store-actions">
                    {user?.role === "admin" && (
                      <>
                        <ChangeStoreManager storeId={store._id} />
                        <button
                          className="--btn --btn-delete"
                          onClick={() => confirmDelete(store._id)}
                        >
                          Delete Store
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StoreList;
