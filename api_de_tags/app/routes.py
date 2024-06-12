from flask import request, jsonify
from app import app
from utils.text_processing import extract_nouns

@app.route('/generate_tags', methods=['POST'])
def generate_tags():
    data = request.get_json()
    text = data.get('texto', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    tags = extract_nouns(text)

    return jsonify({'tags': tags})
