from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route("/")
def to_home():
    return home_page();

@app.route('/home')
def home_page():
    return render_template('home.html', page="home");

@app.route('/search')
def search_page():
    return render_template('search.html', page="search");

@app.route('/login', methods = ['POST'])
def login():
    print(request.form['password'])
    if request.form['name'] == "clq" and request.form['password'] == "1234":
        return jsonify({'result': 1, 'message': '冯思远'})
    else:
        return jsonify({'result': 0, 'message': '用户不存在或密码错误'})

if (__name__ == '__main__'):
    app.run(host='0.0.0.0')
