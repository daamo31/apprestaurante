import nltk
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
import numpy as np
import random
import json
import string
from sklearn.naive_bayes import MultinomialNB
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar CORS
from sqlalchemy import create_engine, MetaData, Table, select, func
import os
import re  # Importar re para expresiones regulares

# Descargar recursos necesarios de NLTK
nltk.download('punkt')
nltk.download('wordnet')

# Inicializar el lematizador
lemmatizer = WordNetLemmatizer()

# Obtener la ruta del archivo intents.json
base_dir = os.path.dirname(os.path.abspath(__file__))
intents_path = os.path.join(base_dir, 'intents.json')

# Cargar los datos de entrenamiento
with open(intents_path) as file:
    intents = json.load(file)

# Preprocesar los datos
words = []
classes = []
documents = []
ignore_words = list(string.punctuation)

for intent in intents['intents']:
    for pattern in intent['patterns']:
        # Tokenizar cada palabra
        word_list = word_tokenize(pattern)
        words.extend(word_list)
        # Añadir a documentos
        documents.append((word_list, intent['tag']))
        # Añadir a clases
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# Lematizar y bajar a minúsculas y eliminar duplicados
words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))

# Ordenar clases
classes = sorted(list(set(classes)))

# Crear datos de entrenamiento
training = []
output_empty = [0] * len(classes)

for doc in documents:
    # Inicializar la bolsa de palabras
    bag = []
    # Lista de palabras tokenizadas
    word_patterns = doc[0]
    # Lematizar cada palabra
    word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]
    # Crear bolsa de palabras
    for w in words:
        bag.append(1) if w in word_patterns else bag.append(0)
    
    # Salida es un 0 para cada etiqueta y 1 para la etiqueta actual
    output_row = classes.index(doc[1])
    
    training.append([bag, output_row])

# Convertir la lista de entrenamiento en un array de NumPy
train_x = np.array([i[0] for i in training])
train_y = np.array([i[1] for i in training])

# Crear el modelo
model = MultinomialNB()
model.fit(train_x, train_y)

# Función para limpiar la entrada del usuario
def clean_up_sentence(sentence):
    # Tokenizar la entrada
    sentence_words = word_tokenize(sentence)
    # Lematizar cada palabra
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

# Función para convertir la entrada del usuario en una bolsa de palabras
def bow(sentence, words, show_details=True):
    # Tokenizar la entrada
    sentence_words = clean_up_sentence(sentence)
    # Crear bolsa de palabras
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print(f"found in bag: {w}")
    return np.array(bag)

# Función para predecir la clase
def predict_class(sentence, model):
    # Filtrar predicciones por debajo de un umbral
    p = bow(sentence, words, show_details=False)
    res = model.predict([p])[0]
    return classes[res]

# Función para obtener la respuesta
def get_response(ints, intents_json, message):
    tag = ints
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            if tag == "precio_plato":
                # Usar expresiones regulares para extraer el nombre del plato
                match = re.search(r'precio de (.+)', message, re.IGNORECASE)
                if match:
                    plato = match.group(1).strip()
                    if plato:
                        precio, imagen = obtener_precio_plato(plato)
                        result = f"El precio para {plato} es {precio}. <img src='{imagen}' alt='{plato}' />"
                    else:
                        result = "Por favor, proporciona el nombre del plato."
                else:
                    result = "Por favor, proporciona el nombre del plato."
            elif tag == "listar_platos":
                platos = listar_platos()
                result = f"Estos son los platos disponibles:<ul>{platos}</ul>"
            elif tag == "crear_usuario":
                result = "Para crear un usuario, visita la siguiente página: <a href='http://localhost:3000/user-register'>crear usuario</a>"
            elif tag == "hacer_reserva":
                result = "Para hacer una reserva, primero debes iniciar sesión. Por favor, proporciona tus credenciales."
            else:
                result = random.choice(i['responses'])
            break
    return result

# Función para el chatbot
def chatbot_response(text):
    ints = predict_class(text, model)
    res = get_response(ints, intents, text)
    return res

# Función para obtener el precio de un plato
def obtener_precio_plato(plato):
    productos_table = Table('menu_dish', metadata, autoload_with=engine)
    conn = engine.connect()
    select_stmt = select(productos_table.c.price, productos_table.c.image_url).where(func.lower(productos_table.c.name) == plato.lower())
    result = conn.execute(select_stmt).fetchone()
    conn.close()
    if result:
        return f"{result[0]:.2f} €", result[1]  # Formatear el precio con dos decimales y devolver la URL de la imagen
    else:
        return "no disponible", ""

# Función para listar los platos
def listar_platos():
    productos_table = Table('menu_dish', metadata, autoload_with=engine)
    conn = engine.connect()
    select_stmt = select(productos_table.c.name)
    result = conn.execute(select_stmt)
    platos = "".join([f"<li>{row[0]}</li>" for row in result])  # Formatear cada plato como un elemento de lista
    conn.close()
    return platos

# Crear la aplicación Flask
app = Flask(__name__)
CORS(app)  # Habilitar CORS

# Conectar a la base de datos SQLite
DATABASE_URI = 'sqlite:///db.sqlite3'  
engine = create_engine(DATABASE_URI)
metadata = MetaData()
metadata.reflect(bind=engine)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data['message']
    response = chatbot_response(message)
    return jsonify({'response': response})

@app.route('/dishes', methods=['GET'])
def get_dishes():
    productos_table = Table('menu_dish', metadata, autoload_with=engine)
    conn = engine.connect()
    select_stmt = select(productos_table.c.name, productos_table.c.description, productos_table.c.price)
    result = conn.execute(select_stmt)
    dishes = [dict(zip(result.keys(), row)) for row in result.fetchall()]
    conn.close()
    return jsonify(dishes)

def start_chatbot():
    app.run(port=8888, debug=False)  # Cambia el puerto a 8888

if __name__ == "__main__":
    start_chatbot()