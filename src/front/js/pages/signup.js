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

	const handleCities = event => {
		let country = event.target.value;
		get_cities(country);
	};
	const get_cities = async country => {
		const resp = await fetch(
			`https://3001-emerald-scorpion-rieiq70j.ws-eu16.gitpod.io/api/countries/${country}/cities`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" }
			}
		);
		if (!resp.ok) throw Error("No se pudieron obtener las ciudades");
		const data = await resp.json();
		let dataInHtMl = data.map(function(city) {
			return (
				<option key={city.id} value={city.id}>
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
		const resp = await fetch(`https://3001-emerald-scorpion-rieiq70j.ws-eu16.gitpod.io/api/countries`, {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		});
		if (!resp.ok) throw Error("No se pudieron obtener los países");
		const data = await resp.json();
		console.log(data);
		let dataInHtMl = data.map(function(country) {
			return (
				<option key={country.id} value={country.id}>
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
		let email = document.getElementById("email").value;
		let name = document.getElementById("name").value;
		let password = document.getElementById("password").value;
		let city_selector = document.getElementById("city_select").value;
		let city_text = document.getElementById("city").value;
		let city = city_selector === "-1" ? city_text : city_selector;
		let country_selector = document.getElementById("country_select").value;
		let country_text = document.getElementById("country").value;
		let country = country_selector === "-1" ? country_text : country_selector;

		signup(email, name, password, city, country);
	};
	const signup = async (email, name, password, city, country) => {
		const resp = await fetch(`https://3001-emerald-scorpion-rieiq70j.ws-eu16.gitpod.io/api/signup`, {
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
				<form>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email address
						</label>
						<input type="email" className="form-control" id="email" />
					</div>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input type="text" className="form-control" id="name" />
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input type="password" className="form-control" id="password" />
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
						<input type="text" className="form-control" id="country" placeholder="Add New Country" />
					</div>

					<div className="mb-3">
						<label htmlFor="city" className="form-label">
							City
						</label>
						<select className="form-select" aria-label="Default select example" id="city_select">
							{cities}
						</select>
						<input type="text" className="form-control" id="city" placeholder="Add New City" />
					</div>

					<button type="submit" className="btn btn-primary" onClick={handleSignup}>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};
