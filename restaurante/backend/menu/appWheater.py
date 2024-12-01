from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Permite solicitudes desde React
 # Habilitar CORS para todas las rutas por defecto

API_KEY = '8d81edcbd30b4760843130613242911'  # Reemplaza con tu API Key de WeatherAPI
CITY = 'Madrid'  # Reemplaza con tu ciudad

@app.after_request
def add_headers(response):
    response.headers['Referrer-Policy'] = 'no-referrer-when-downgrade'
    return response


@app.route('/')
def home():
    return "Weather API is running"

@app.route('/weather', methods=['GET'])
def get_weather():
    url = f'http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={CITY}&aqi=no'
    response = requests.get(url)
    data = response.json()
    weather = {
        'description': data['current']['condition']['text'],
        'temperature': data['current']['temp_c']
    }
    return jsonify(weather)

if __name__ == '__main__':
    app.run(debug=True,port =5500)
