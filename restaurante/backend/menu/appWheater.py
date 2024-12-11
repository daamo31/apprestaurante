from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Permite solicitudes desde React

API_KEY = '8d81edcbd30b4760843130613242911'  # Reemplaza con tu API Key de WeatherAPI
CITY = 'Zaragoza'  # Reemplaza con tu ciudad

@app.after_request
def add_headers(response):
    response.headers['Referrer-Policy'] = 'no-referrer-when-downgrade'
    return response

@app.route('/')
def home():
    return "Weather API is running"  # Ruta principal que devuelve un mensaje indicando que la API está en funcionamiento

@app.route('/weather', methods=['GET'])
def get_weather():
    url = f'http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={CITY}&aqi=no'  # URL de la API de WeatherAPI
    response = requests.get(url)  # Realiza una solicitud GET a la API de WeatherAPI
    data = response.json()  # Convierte la respuesta en formato JSON
    weather = {
        'icon': data['current']['condition']['icon'],  # Extrae el icono del clima actual
        'temperature': data['current']['temp_c']  # Extrae la temperatura actual en grados Celsius
    }
    return jsonify(weather)  # Devuelve los datos del clima en formato JSON

if __name__ == '__main__':
    app.run(debug=True, port=5500)  # Ejecuta la aplicación Flask en modo de depuración en el puerto 5500