import pymongo 
from flask import Flask, render_template,jsonify
from flask_mqtt import Mqtt
from pymongo import MongoClient
import json
app = Flask(__name__)

# Cấu hình MongoDB

DungSY= MongoClient("mongodb+srv://Tem_humi_rain:0395510527@dungsy.oge7irn.mongodb.net/DungSY?retryWrites=true&w=majority")

db = DungSY["Weather"]
print("DB:",db)
collection = db["Temhumirain"]
print("COLLECTION:",collection)
documents = collection.find()
print("DOCUMENTS:",documents)
for doc in documents:
    print(doc)
# MQTT
app.config['MQTT_BROKER_URL'] = 'mqtt.flespi.io'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = 'tpNlLOXdmw82KQlcAeNrHeLiQfMnQavap8j0K73XrZPZF0133DiAFRGlXjxDjSBx'
app.config['MQTT_PASSWORD'] = None
app.config['MQTT_CLIENT_ID'] = 'Dung sy'
app.config['MQTT_REFRESH_TIME'] = 1.0 # refresh time in seconds
mqtt = Mqtt(app)
print("MQTT")
@app.route('/',methods=('GET','POST'))
def index():
 return render_template('index.html')
@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print ( " Connected to MQTT broker")
    mqtt.subscribe('Weather')
@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
    topic=message.topic,
    payload=message.payload.decode()
    )
    payload = message.payload.decode()
    data1 = json.loads(payload)
    temperature = data1["tem"]
    humidity = data1["humi"]
    Time = data1["time"]
    print(temperature,humidity,Time)
    print('Received MQTT message:', data1)
    # Lưu dữ liệu vào MongoDB   
    #collection.insert_one(data)
if __name__ == '__main__':
 app.run(debug=True)
