import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.scss";
import { Link } from "react-router-dom";

export const Signup = () => {
	const { store, actions } = useContext(Context);
	const [cities, setCities] = useState([
		<option key="-1" value="-1">
			Choose City
		</option>
	]);
	const [countries, setCountries] = useState([
		<option key="-1" value="-1">
			Choose Country
		</option>
	]);
	const [name, setName] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [city_selector, setCity_selector] = useState("-1");
	const [country_selector, setCountry_selector] = useState("-1");
	const [city, setCity] = useState(null);
	const [country, setCountry] = useState(null);

	const handleCities = event => {
		let country = event.target.value;
		setCountry_selector(country);
		get_cities(country);
	};
	const get_cities = async country => {
		const resp = await fetch(
			`https://3001-yellow-frog-djcrauva.ws-eu16.gitpod.io/api/countries/${country}/cities`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" }
			}
		);
		if (!resp.ok) throw Error("No se pudieron obtener las ciudades");
		const data = await resp.json();
		let dataInHtMl = data.map(function(city) {
			return (
				<option key={city.id} value={city.name}>
					{city.name}
				</option>
			);
		});
		setCities([
			<option key="-1" value="-1">
				Choose City
			</option>,
			dataInHtMl
		]);
	};

	const get_countries = async () => {
		const resp = await fetch(`https://3001-yellow-frog-djcrauva.ws-eu16.gitpod.io/api/countries`, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		});
		if (!resp.ok) throw Error("No se pudieron obtener los países");
		const data = await resp.json();
		console.log(data);
		let dataInHtMl = data.map(function(country) {
			return (
				<option key={country.id} value={country.name}>
					{country.name}
				</option>
			);
		});
		setCountries([
			<option key="-1" value="-1">
				Choose Country
			</option>,
			dataInHtMl
		]);
	};

	useEffect(() => {
		get_countries();
	}, []);

	const handleSignup = () => {
		let city_name = city_selector === "-1" ? city : city_selector;
		let country_name = country_selector === "-1" ? country : country_selector;

		signup(email, name, password, city_name, country_name);
	};
	const signup = async (email, name, password, city, country) => {
		const resp = await fetch(`https://3001-yellow-frog-djcrauva.ws-eu16.gitpod.io/api/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: email,
				name: name,
				city: city,
				country: country,
				password: password,
				is_active: true
			})
		});

		if (!resp.ok) throw Error("There was a problem in the signup request");

		if (resp.status === 401) {
			throw "Invalid credentials";
		} else if (resp.status === 400) {
			throw "Invalid email or password format";
		}
		const data = await resp.json();
		console.log(data);
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
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								type="text"
								className="form-control"
								id="name"
								onChange={e => setName(e.target.value)}
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
						<div className="mb-3">
							<label htmlFor="country" className="form-label">
								Country
							</label>
							<select
								className="form-select"
								aria-label="Default select example"
								id="country_select"
								onChange={handleCities}>
								{countries}
							</select>
							<input
								type="text"
								className="form-control"
								id="country"
								placeholder="Add New Country"
								onChange={e => setCountry(e.target.value)}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="city" className="form-label">
								City
							</label>
							<select
								className="form-select"
								aria-label="Default select example"
								id="city_select"
								onChange={e => setCity_selector(e.target.value)}>
								{cities}
							</select>
							<input
								type="text"
								className="form-control"
								id="city"
								placeholder="Add New City"
								onChange={e => setCity(e.target.value)}
							/>
						</div>

						<button type="submit" className="btn btn-primary" onClick={handleSignup}>
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
