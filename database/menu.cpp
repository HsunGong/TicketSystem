#include "database.hpp"
#include <ctime>
#include <cstdlib>
#include <map>

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
	mydb.insert(1,1);
	cout << mydb.empty();
	return 0;
}















