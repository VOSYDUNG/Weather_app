from flask import Flask, render_template
from flask_mqtt import Mqtt
from flask_pymongo import PyMongo

app = Flask(__name__)

# Cấu hình MongoDB
app.config['MONGO_URI'] = 'mongodb+srv://Tem_humi_rain:0395510527@dungsy.oge7irn.mongodb.net/DungSY?retryWrites=true&w=majority'

# Kết nối đến MongoDB
mongodb_client = PyMongo(app)

# Kiểm tra kết nối thành công đến MongoDB
if mongodb_client.cx is not None:
    print("Kết nối thành công đến MongoDB")
else:
    print("Kết nối không thành công đến MongoDB")

# Lấy đối tượng cơ sở dữ liệu
db = mongodb_client.db
print("DB:",db)

# MQTT
app.config['MQTT_BROKER_URL'] = 'mqtt.flespi.io'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = 'tpNlLOXdmw82KQlcAeNrHeLiQfMnQavap8j0K73XrZPZF0133DiAFRGlXjxDjSBx'
app.config['MQTT_PASSWORD'] = None
app.config['MQTT_CLIENT_ID'] = 'Dung sy'
app.config['MQTT_REFRESH_TIME'] = 1.0  # refresh time in seconds
mqtt = Mqtt(app)
print("MQTT")

@app.route('/', methods=('GET', 'POST'))
def index():
    return render_template('index.html')

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker")
    mqtt.subscribe('Weather')

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    print('Received MQTT message:', data)

    # Lưu dữ liệu vào MongoDB
    collection = db['Weather']
    collection.insert_one(data)

if __name__ == '__main__':
    app.run(debug=True)