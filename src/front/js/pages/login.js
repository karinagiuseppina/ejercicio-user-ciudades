import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.scss";
import { Link, useHistory } from "react-router-dom";

export const Login = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	let history = useHistory();

	const handleLogin = async () => {
		const resp = await fetch(`https://3001-yellow-frog-djcrauva.ws-eu16.gitpod.io/api/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		if (!resp.ok) throw Error("There was a problem in the login request");

		const data = await resp.json();
		// save your token in the localStorage
		//also you should set your user into the store using the setStore function
		localStorage.setItem("jwt-token", data.token);
		actions.setUserToken(data.token);
		history.push("/userdata");
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<form>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								Email address
							</label>
							<input
								type="email"
								className="form-control"
								id="email"
								onChange={e => setEmail(e.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
						<button type="submit" className="btn btn-primary" onClick={handleLogin}>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
