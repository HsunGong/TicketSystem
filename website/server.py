from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route("/")
def to_home():
    return home_page();

@app.route('/home')
def home_page():
    return render_template('home.html', page="home");

@app.route('/search', methods = ['get'])
def search_page():
    return render_template('search.html', page="search");

@app.route('/login', methods = ['get'])
def user_page():
    return render_template('user.html', page="login");

@app.route("/search", methods = ['post'])
def search():
    if request.form['flag'] == '1':
        return jsonify([]);
    return jsonify([
        {'kind': 'D', 'name': 'D1234', 'kind_tag': 'D-动车', 
         'dep': '上海虹桥', 'dep_time': '08:00', 
         'des': '余姚北', 'des_time': '09:30', 
         'seat_name': ['无座', '二等座', '一等座', '商务/特等', '动卧', '软座', '硬座', '软卧', '硬卧'], 
         'price': [124, 124, 233, '--', '--', '--', '--', '--', '--'], 
         'remain': [2000, 3, 15, -1, -1, -1, -1, -1, -1], 
         'station': ['上海虹桥', '嘉善南', '嘉兴南', '桐乡', '杭州东', '绍兴北', '余姚北', '宁波', '临海', '深圳北'], 
         'arr_time': ['08:46', '09:14', '09:31', '09:45', '10:09', '10:33', '10:54', '11:18', '12:11', '00:39'], 
         'stan_time': ['发车', '9分', '3分', '9分', '5分', '2分', '2分', '7分', '2分', '到达'], 
         }, 
        {'kind': 'D', 'name': 'D1234', 'kind_tag': 'D-动车', 
         'dep': '上海虹桥', 'dep_time': '10:00', 
         'des': '余姚北', 'des_time': '11:40', 
         'seat_name': ['无座', '二等座', '一等座', '商务/特等', '动卧', '软座', '硬座', '软卧', '硬卧'], 
         'price': [124, 124, 233, '--', '--', '--', '--', '--', '--'], 
         'remain': [2000, 3, 15, -1, -1, -1, -1, -1, -1], 
         'station': ['上海虹桥', '嘉善南', '嘉兴南', '桐乡', '杭州东', '绍兴北', '余姚北', '宁波', '临海', '深圳北'], 
         'arr_time': ['08:46', '09:14', '09:31', '09:45', '10:09', '10:33', '10:54', '11:18', '12:11', '00:39'], 
         'stan_time': ['发车', '9分', '3分', '9分', '5分', '2分', '2分', '7分', '2分', '到达'], 
         }, 
        {'kind': 'G', 'name': 'G1234', 'kind_tag': 'G-高铁', 
         'dep': '上海虹桥', 'dep_time': '12:00', 
         'des': '余姚北', 'des_time': '13:14', 
         'seat_name': ['无座', '二等座', '一等座', '商务/特等', '动卧', '软座', '硬座', '软卧', '硬卧'], 
         'price': [224, 224, 233, '--', '--', '--', '--', '--', '--'], 
         'remain': [2000, 3, 15, -1, -1, -1, -1, -1, -1], 
         'station': ['上海虹桥', '嘉善南', '嘉兴南', '桐乡', '杭州东', '绍兴北', '余姚北', '宁波', '临海', '深圳北'], 
         'arr_time': ['08:46', '09:14', '09:31', '09:45', '10:09', '10:33', '10:54', '11:18', '12:11', '00:39'], 
         'stan_time': ['发车', '9分', '3分', '9分', '5分', '2分', '2分', '7分', '2分', '到达'], 
         } 
        ]);

@app.route('/login', methods = ['POST'])
def login():
    if request.form['name'] == "clq" and request.form['password'] == "1234":
        return jsonify({'result': 1, 'message': '冯思远'})
    else:
        return jsonify({'result': 0, 'message': '用户不存在或密码错误'})

if (__name__ == '__main__'):
    app.run(host='0.0.0.0')
