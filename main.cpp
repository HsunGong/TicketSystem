#include "database.hpp"
#include <cstring>
#include <cstdio>
//just like the clothes
#define xlsize 60
#define lsize 40//large
#define msize 20//middle
#define ssize 10//small
#define xssize 4

bool Record;
bool Debug=false;
bool inserting=false;
//xxxx-xx-xx
//xx:xx
class date{
public:
    int year;
    int month;
    int day;
    int hour;
    int minute;
};
int tcnt = 0;
int sum = 0;
class train{
public:
    char train_id[msize];
    char name[msize];
    char catalog[smize];//?
    //char train_kind[msize];
    int num_station;
    int num_price;//$...

    char ticket_name[xlsize][msize];
    char station_name[xlsize][msize];
    char arriv_time[xlsize][xssize];
    char start_time[xlsize][xssize];
    char stopover_time[xlsize][xssize];
    double price[xlsize][xssize];
    int ticket[xlsize][xssize];
};
class user{
public:
    //int id;
    char name[lsize];// 1 chinese word with 2 char
    char password[msize];
    char email[msize];//255+64+1
    char phone[msize];
    int privilege = 0;// 0--no, 1--re, 2--man

    user(){};
    user(char *_name, char *_password, char *_email, char *_phone, const int &p = 0): privilege(p){
        strcpy(name, _name);
        strcpy(password, _password);
        strcpy(email, _email);
        strcpy(phone, _phone);
    }
};
class train_id{};
class user_id{};
class ticket_key{};
class catalog{};
//database<user_id, user> user_db;
database<int, user> user_db("sbfsy", "dsbfsy");

//database<train_id, train> train_db("sbfsy2", "dsbfsy2");
//database<ticket_key, catalog> ticket_db("sbfsy3", "dsbfsy3");
//database<pair<int, date>, xxx> xxx_db;

int inner_id = 0;// start from 0, id(0) = administrator
using iter_user = database<int, user>::iterator;
int id, id2;
char name[lsize];// 1 chinese word with 2 char
char password[msize];
char email[msize];//255+64+1
char phone[msize];
int privilege;// 0--no, 1--re, 2--admin
char tmp_string[lsize + msize + msize + msize + 4];

bool cmp(char a[], char b[]){
    if(strncmp(a, b, strlen(a)) && strncmp(a, b, strlen(b))) 
        return 1;
    return 0;
}

char *tostring(int x, char *p){
    int len = strlen(p);
    int i = 0;
    while(x){
        p[i++] = x / 10;
    }
    return p;
}
int get_privilege(){
    iter_user it = user_db.find(id);
    if(it.getkey() == id)  return it->privilege;
    return 0;
}

int register(){
    static int flag = 0;
    if(!flag){
        flag = 1;
        init();//--->userprivilege = 1, admin already exists
    }
    ++inner_id;
    user tmp(id, name, password, email, phone, privilege);//id bucun
    user_db.insert(inner_id, tmp);
    //cout << inner_id + 2017 << '\n';
    return inner_id + 2017;
}


bool login(){
    iter_user it = user_db.find(id);
    if(cmp(it->password, password))   return 1;
    return 0;
}

char* query_profile(){
    iter_user it = user_db.find(id);
    if(it.findkey() == id){
        char p[ssize]; 
        strcat(tmp_string, it->name);
        strcat(tmp_string, " ");
        strcat(tmp_string, it->email);
        strcat(tmp_string, " ");
        strcat(tmp_string, it->phone);
        strcat(tmp_string, " ");
        strcat(tmp_string, tostring(it->privilege, p));
        return tmp_string;
    }
    else return "0";
}

bool modify_profile(){
    iter_user it = user_db.find(id);
    if(cmp(it->password, password)){
        if(cmp(password, it->password)){
             user tmp(id, name, password, email, phone, privilege);//id bucun
            user_db.modify(it, tmp);
            return 1;
        }
    }
    return 0;
}

bool modify_privilege(){
    if(get_privilege(id) == 2){
        iter_user it = user_db.find(id2);
        if(it->id == id){
            it->privilege = 2;
            it.wirte();
            return 1;
        }
    }
    return 0;
}
bool clean(){
    try{
        user_db.clear();
        //sss.clear();
        return 0;
    }catch(){
        return 1;
    }
 
}

void start(){
    //~~start
}
void close(){
    //~~close
}
int main(){
    ios::sync_with_stdio(0);
    init();
    char cmd[msize];
    try_start();
    bool flag = 1;
    while(flag){
        cin >> cmd;
        switch(cmd){
        case "register":
            cout << register() << '\n';
            break;
        case "login":
            cin >> id >> password;
            cout << login() << '\n';
            break;
        case "query_profile":
            cin >> id;
            cout << query_profile() << '\n';
            break;
        case "modify_profile":
            cin >> id >> name >> password >> email >> phone;
            cout << modify_profile() << '\n';
            break;
        case "modify_privilege":
            cin >> id >> id2 >> privilege;
            cout << modify_privilege() << '\n';
            break;
        // case "query_ticket":
        //     query_ticket();
        //     break;
        // case "query_transfer":
        //     string loc1,loc2,date,catalog;
        //     cin>>loc1>>loc2>>date>>catalog;
        //     query_transfer(loc1,loc2,date,catalog);
        //     break;
        // case "buy_ticket":
        //     string train_id,loc1,loc2,date,ticket_kind;
        //     int id,num;
        //     cin>>id>>num>>train_id>>loc1>>loc2>>date>>ticket_kind;
        //     cout<<buy_ticket(id,num,train_id,loc1,loc2,date,ticket_kind)<<endl;
        //     break;
        // case "query_order":
        //     int id;
        //     string date,catalog;
        //     cin>>id>>date>>catalog;
        //     query_order(id,date,catalog);
        //     break;
        // case "refund_ticket":
        //     string train_id,loc1,loc2,date,ticket_kind;
        //     int id,num;
        //     cin>>id>>num>>train_id>>loc1>>loc2>>date>>ticket_kind;
        //     cout<<buy_ticket(id,-num,train_id,loc1,loc2,date,ticket_kind)<<endl;
        //     break;
        // case "add_train":
        //     train.read();
        //     cout<<add_train(train)<<endl;
        //     break;
        // case "sale_train":
        //     string trainid;
        //     cin>>trainid;
        //     cout<<sale_train(trainid)<<endl;
        //     break;
        // case "query_train":
        //     string trainid;
        //     cin>>trainid;
        //     query_train(trainid);
        //     break;
        // case "delete_train":
        //     string trainid;
        //     cin>>trainid;
        //     cout<<delete_train(trainid)<<endl;
        //     break;
        // case "modify_train":
        //     train.read();
        //     cout<<modify_train(train)<<endl;
        //     break;
        // case "clean":
        //     cout<<clean()<<endl;
        //     break;
        case "exit":
            try_close();
            cout<<"BYE"<<endl;
            flag = 0;
            break;
        default:
            puts("Wrong Command");
            break;
        }
    }
    database.close();
    return 0;
}