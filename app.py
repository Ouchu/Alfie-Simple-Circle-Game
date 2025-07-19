from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

<<<<<<< HEAD
=======
# Route to serve the main HTML file
>>>>>>> 786565a386bed48341474bd1c072db5070e99f1f
@app.route('/')
def index():
    return render_template('index.html')

<<<<<<< HEAD
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
=======
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
>>>>>>> 786565a386bed48341474bd1c072db5070e99f1f
