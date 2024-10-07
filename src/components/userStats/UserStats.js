import React, { useEffect } from "react";
import InfoBox from "../infoBox/InfoBox";
import { FaUsers } from "react-icons/fa";
import { BiUserCheck, BiUserMinus, BiUserX } from "react-icons/bi";
import { GrUserAdmin, GrUserManager } from "react-icons/gr";
import "./UserStats.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  CALC_ACTIVE_USERS,
  CALC_ADMIN_USERS,
  CALC_INACTIVE_USERS,
  CALC_MANAGER_USERS,
  CALC_SUSPENDED_USERS,
} from "../../redux/features/auth/authSlice";

// Icons
const icon1 = <FaUsers size={40} color="#fff" />;
const icon2 = <BiUserCheck size={40} color="#fff" />;
const icon3 = <BiUserMinus size={40} color="#fff" />;
const icon4 = <BiUserX size={40} color="#fff" />;
const icon5 = <GrUserManager size={40} color="#fff" />;
const icon6 = <GrUserAdmin size={40} color="#fff" />;

const UserStats = () => {
  const dispatch = useDispatch();
  const {
    users,
    activeUsers,
    inactiveUsers,
    suspendedUsers,
    managerUsers,
    adminUsers,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(CALC_ACTIVE_USERS());
    dispatch(CALC_INACTIVE_USERS());
    dispatch(CALC_MANAGER_USERS());
    dispatch(CALC_ADMIN_USERS());
    dispatch(CALC_SUSPENDED_USERS());
  }, [dispatch, users]);

  return (
    <div className="user-summary">
      <h3 className="--mt">User Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={icon1}
          title={"Total Users"}
          count={users.length}
          bgColor={"card1"}
        />
        <InfoBox
          icon={icon2}
          title={"Active Users"}
          count={activeUsers}
          bgColor={"card2"}
        />
        <InfoBox
          icon={icon3}
          title={"Inactive Users"}
          count={inactiveUsers}
          bgColor={"card3"}
        />
        <InfoBox
          icon={icon4}
          title={"Suspended Users"}
          count={suspendedUsers}
          bgColor={"card4"}
        />
        <InfoBox
          icon={icon5}
          title={"Store Managers"}
          count={managerUsers}
          bgColor={"card5"}
        />
        <InfoBox
          icon={icon6}
          title={"Admins"}
          count={adminUsers}
          bgColor={"card6"}
        />
      </div>
    </div>
  );
};

export default UserStats;
