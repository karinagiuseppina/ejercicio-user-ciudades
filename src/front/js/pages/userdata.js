import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.scss";
import { Link } from "react-router-dom";

export const Userdata = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>HelloUser</h1>
			<div className="alert alert-info">{localStorage.getItem("user")}</div>
			<Link to="/">Go Home </Link>
		</div>
	);
};
