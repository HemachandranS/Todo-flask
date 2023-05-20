# app.py
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://hemachandrans:abcd321@cluster0.qktuw0u.mongodb.net/?retryWrites=true&w=majority'
mongo = PyMongo(app)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = list(mongo.db.todos.find())
    return jsonify(todos), 200

@app.route('/api/todos', methods=['POST'])
def create_todo():
    name = request.json.get('name', '')
    if not name:
        return 'Name is required', 400

    todo = {'name': name}
    result = mongo.db.todos.insert_one(todo)
    todo['_id'] = str(result.inserted_id)
    return jsonify(todo), 200

@app.route('/api/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    name = request.json.get('name', '')
    if not name:
        return 'Name is required', 400

    mongo.db.todos.update_one({'_id': todo_id}, {'$set': {'name': name}})
    todo = mongo.db.todos.find_one({'_id': todo_id})
    return jsonify(todo), 200

@app.route('/api/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    mongo.db.todos.delete_one({'_id': todo_id})
    return '', 204

if __name__ == '__main__':
    app.run()
