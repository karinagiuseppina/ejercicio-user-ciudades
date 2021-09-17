from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'),
        nullable=False)

    def __repr__(self):
        return '<User %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "city": self.city_id
            # do not serialize the password, its a security breach
        }

class Country(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    cities = db.relationship('City', backref='country', lazy=True)

    def __repr__(self):
        return '<Country %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            # do not serialize the password, its a security breach
        }

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    users = db.relationship('User', backref='city', lazy=True)
    country_id = db.Column(db.Integer, db.ForeignKey('country.id'),
        nullable=False)

    def __repr__(self):
        return '<City %r>' % self.id 

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            # do not serialize the password, its a security breach
        }