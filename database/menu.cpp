#include "database.hpp"
#include <ctime>
#include <fstream>
#include <iostream>

using db = database<int, long long>;
using iter = database<int, long long>::iterator;

struct cmp {
	template<class Key>
	bool operator ()(const Key &a, const Key &b)const { return a.x > b.x; }
};
int main() {
	srand(0);
	size_t i, j, k;
	const char a[] = "idxfile";
	const char b[] = "datafile";
	db mydb(a, b);

	ofstream out("testfile");
	out.close();
	fstream file("testfile");

	for (size_t i = 0; i < 200; ++i) {
		k = rand() % 200;
		mydb.insert(k, i);
		cout << k << ' ' << i << '\n';
		file << k << ' ' << i << '\n';
	}
	file << endl;
	for (size_t i = 0; i < 200; ++i) {
		k = rand() % 200;
		mydb.erase(k);
		cout << k << ' ' << i << '\n';
		file << k << ' ' << i << '\n';
	}
	file << endl;
	for (size_t i = 0; i < 200; ++i) {
		k = rand() % 200;
		mydb.insert(i, k);
		cout << k << ' ' << i << '\n';
		file << k << ' ' << i << '\n';
	}
	file << endl;
	for (size_t i = 0; i < 100; ++i) {
		mydb.modify(i, i);
		cout << i << ' ' << i << '\n';
		file << i << ' ' << i << '\n';
	}
	file << endl;
	for (size_t i = 0; i < 100; ++i) {
		iter tmp = mydb.find(i);
		cout << i << " find  " << *tmp << '\n';
		file << i << ' ' << i << '\n';
	}
	file << endl;
	return 0;
}

