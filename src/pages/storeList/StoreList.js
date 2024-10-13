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

const StoreList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  // Fetch user and store data from Redux
  const user = useSelector(selectUser);
  const users = useSelector(selectUsers);

  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="store-list-container">
      <div className="container">
        {isLoading && <SpinnerImg />}
        <div className="store-list">
          <div className="--flex-between">
            <h3>All Stores</h3>
            {/* Ensure the Add Store button is always displayed */}
            {user?.role === "admin" && (
              <Link to="/add-StoreLocation" className="add-store-link">
                <button className="--btn --btn-primary">Add Store</button>
              </Link>
            )}
          </div>

          {/* Render message if no stores are available */}
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

/*  if (!stores || stores.length === 0) {
    return (
      <div className="container">
        <div className="store-list">
          <h3>No stores found. Please try again later.</h3>
        </div>
      </div>
    );
  }

  return (
    <section className="store-list-container">
      <div className="container">
        {isLoading && <SpinnerImg />}
        <div className="store-list">
          <div className="--flex-between">
            <h3>All Stores</h3>
            <div className="search-and-add">
              {user?.role === "admin" && (
                <Link to="/add-StoreLocation" className="add-store-link">
                  <button className="--btn --btn-primary">Add Store</button>
                </Link>
              )}
            </div>
          </div>

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
                    <strong>Manager:</strong> {getManagerName(store.managerId)}
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
        </div>
      </div>
    </section>
  );
};

export default StoreList;
 */
