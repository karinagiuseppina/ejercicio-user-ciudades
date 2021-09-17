"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Country, City
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }

    return jsonify(response_body), 200

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Query your database for username and password
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        # the user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401
    
    # create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id, "name": user.name, "city": user.city.name, "country": user.city.country_id, "email": user.email})

@api.route("/signup", methods=["POST"])
def create_user():
    name = request.json.get("name", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    country = request.json.get("country", None)
    city = request.json.get("city", None)
    is_active = request.json.get("is_active", None)

    # Query your database for username and password
    if email is None or password is None:
        return jsonify({"msg": "Bad username or password"}), 401
    
    user = User(email=email, name=name, password = password, is_active= is_active)

    new_city = City.query.filter_by(name=city).first()
    new_country = Country.query.filter_by(name=country).first()
    print(new_city, new_country)
    if new_city is None:
        new_city = City(name = city) 
        print(new_city, new_country)
        if new_country is None:
            new_country = Country(name = country)
        new_country.cities.append(new_city)
        print(new_city, new_country)

    print(new_city, new_country)
    new_city.users.append(user)   
    db.session.add(new_city)
    db.session.add(new_country)
    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 200


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=current_user_id).first()
    
    return jsonify({"id": user.id, "name": user.name,"email": user.email,"city": user.city_id, "country": user.country_id }), 200

@api.route('/countries', methods=['GET'])
def get_countries():
    countries = Country.query.all()
    countries = list(map (lambda country: country.serialize(), countries))
    
    return jsonify(countries), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users = list(map (lambda user: user.serialize(), users))
    
    return jsonify(users), 200

@api.route('/cities', methods=['GET'])
def get_cities():
    cities = City.query.all()
    cities = list(map (lambda city: city.serialize(), cities))
    
    return jsonify(cities), 200

@api.route('/countries/<country_id>', methods=['GET'])
def get_country(country_id):
    country = Country.query.filter_by(id=country_id).first()

    return jsonify(country.serialize()), 200

@api.route('/countries/<country_name>/cities', methods=['GET'])
def get_country_cities(country_name):
    country = Country.query.filter_by(name=country_name).first()

    cities = country.cities
    cities = list(map (lambda city: city.serialize(), cities))

    return jsonify(cities), 200

@api.route('/cities/<city_id>', methods=['GET'])
def get_city(city_id):
    city = City.query.filter_by(id=city_id).first()
    
    return jsonify(city.serialize()), 200