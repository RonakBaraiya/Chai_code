from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import psycopg2

app = Flask(__name__)
# Standard CORS for HTTP routes (Login/Register)
CORS(app)

# 1. Initialize SocketIO with CORS allowed for your React app
# This allows bidirectional communication for the "Global Center"
socketio = SocketIO(app, cors_allowed_origins="*")

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="Chai_code",
        user="postgres",
        password="ronak_13",
        port="5432"
    )
    return conn

@app.route('/')
def home():
    return "Flask-SocketIO server is running! Ready for chat."

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        conn.commit()
        return jsonify({"message": "Registration successful!"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if user:
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# --- NEW: Real-Time Chat Logic ---
@socketio.on('send_message')
def handle_message(data):
    """
    Listen for 'send_message' from any client and broadcast it to EVERYONE.
    broadcast=True ensures the sender also receives the confirmation of their message.
    """
    print(f"User {data.get('sender')} says: {data.get('text')}")
    emit('receive_message', data, broadcast=True)

if __name__ == '__main__':
    # CRITICAL: Use socketio.run instead of app.run to enable WebSocket support
    socketio.run(app, debug=True, port=5000)
