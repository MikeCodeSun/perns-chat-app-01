import React from "react";
import { Navigate } from "react-router-dom";
import { useGlobleContext } from "../context/context";

export default function DynamicRoute({ children }) {
  const { user } = useGlobleContext();
  // console.log(children);
  if (!user && children.props.auth) {
    return <Navigate to="/login" />;
  } else if (user && children.props.guest) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}
