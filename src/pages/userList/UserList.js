import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserList.scss";
import UserStats from "../../components/userStats/UserStats";
import Search from "../../components/search/Search";
import { FaEnvelope, FaTrashAlt } from "react-icons/fa";
import ChangeRole from "../../components/changeRole/ChangeRole";
import ChangeStatus from "../../components/changeStatus/ChangeStatus";
import AdminSetPassword from "../../components/adminSetPassword/AdminSetPassword";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  removeUser,
  resendUerActivationEmailByAdmin,
} from "../../redux/features/auth/authSlice";
import Loader, { SpinnerImg } from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { shortenText } from "../profile/Profile";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
  FILTER_USERS,
  selectUsers,
} from "../../redux/features/auth/userFilterSlice";
import ReactPaginate from "react-paginate";

const UserList = () => {
  useRedirectLoggedOutUser("/login"); //use this at the very top of all pages that require a user to be logged so it doesnt try to fetch data on a loggedOut state
  const dispatch = useDispatch();

  //used for the search field states
  const [search, setSearch] = useState("");

  const { users, isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  //import the filtered users i.e. after search from out filterSlice in auth folder
  const filteredUsers = useSelector(selectUsers);

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(fetchUsers());
  }, [dispatch]);

  // the actual function to delete the user
  const delUser = async (id) => {
    await dispatch(removeUser(id));
    dispatch(fetchUsers());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This User",
      message:
        "Deleting a user account cannot be undone. Are you sure to delete this user?",
      buttons: [
        {
          label: "Delete",
          onClick: () => delUser(id),
        },
        {
          label: "Cancel",
          //onClick: () => alert('Click No')
        },
      ],
    });
  };

  const handleResendActivationEmail = async (email) => {
    try {
      //console.log(email);

      await dispatch(resendUerActivationEmailByAdmin({ email }));
      //alert("Activation link sent!");
    } catch (error) {
      alert("Failed to resend activation email");
    }
  };

  useEffect(() => {
    dispatch(FILTER_USERS({ users, search }));
  }, [dispatch, users, search]);

  // Begin Pagination
  const itemsPerPage = 5;
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  // End Pagination

  return (
    <section className="full-width-container">
      {isLoading && <Loader />}
      <UserStats />

      <div className="user-list">
        {isLoading && <SpinnerImg />}
        <div className="table">
          <div className="--flex-between">
            <span>
              <h3>All Users</h3>
            </span>
            <span className="search-and-add">
              <Search
                value={search}
                placeholder="Search user"
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* Add User Button */}
              <Link to="/add-user" className="add-user-link">
                <button className="--btn --btn-primary">Add User</button>
              </Link>
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Change Role</th>
                <th>Status</th>
                <th>Change Status</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                currentItems.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{shortenText(user.name, 20)}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <ChangeRole _id={user._id} email={user.email} />
                    </td>
                    <td>{user.status}</td>
                    <td>
                      <ChangeStatus _id={user._id} email={user.email} />
                    </td>
                    <td>
                      <AdminSetPassword _id={user._id} email={user.email} />
                    </td>
                    <td>
                      <span title="Delete User">
                        <FaTrashAlt
                          size={20}
                          color="red"
                          onClick={() => confirmDelete(user._id)}
                        />
                      </span>
                      {/* Show envelope icon if the user is inactive */}
                      {user.status === "inactive" && (
                        <span
                          title="Resend Activation Email"
                          onClick={() =>
                            handleResendActivationEmail(user.email)
                          }
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        >
                          <FaEnvelope size={20} color="green" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <hr />
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </section>
  );
};

export default UserList;
