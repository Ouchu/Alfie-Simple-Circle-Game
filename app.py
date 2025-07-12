from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Route to serve the main HTML file
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve static files (CSS, JavaScript)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    # IMPORTANT: Use 127.0.0.1 now for the server's host.
    print("Flask server starting...")
    print("Open your phone's browser and go to: http://localhost:8000")
    print("Press Ctrl+C in Termux to stop the server.")
    app.run(host='127.0.0.1', port=8000, debug=True)
