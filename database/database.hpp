#pragma once

#ifndef DATABASE_H
#define DATABASE_H

#include <iostream>
#include <cstdio>
#include <fstream>
#include <cstring>
#include <utility>
//#include <cmath>
using namespace std;

//typedef unsigned long long uintmax_t
//typedef long long _int64_t
//typedef unsigned long long _uint64_t;
typedef int int32_t;
#pragma region class exception

class errors {
protected:
	const string variant = "";
	string detail = "";
public:
	errors() {}
	errors(const errors &ec) : variant(ec.variant), detail(ec.detail) {}
	virtual string what() {
		return variant + " " + detail;
	}
};

class file_error : public errors { };
//class index_out : public errors { };
class repetition : public errors { };
class not_exist : public errors { };
class out_of_bound : public errors { };
class node_full : public errors { };
#pragma endregion

// if use template<char const * file>have to define file like:
// the whole program:: extern char const s[] = "filename"

#define bits 1024*4 // bits with one block
//#define fileNameSize 100

inline constexpr int32_t half(const int32_t &pos) noexcept {// with ceil()
	if (pos % 2 == 0) return pos / 2;
	else return pos / 2 + 1;
}

template<class T>
inline constexpr int32_t figure_size() noexcept {
	int32_t size1 = sizeof(int32_t) * 3 + sizeof(int32_t) * 2 + sizeof(bool);
	int32_t left = bits - size1;
	return left / (sizeof(T) + sizeof(int32_t));
}



template<class Key, class V, class Compare = std::less<Key>> 
class database {
private:

	class idxNode;
	class dataNode;

public:

	class iterator;

private:
	// tellp --- tellg
	// putp  --- kutg
	// put in file --- get from file
	// write --- read
	fstream idx;
	fstream data;
	
	
	Compare cmp;// cmp(k, key[ss]), k < key[ss] then s.t.
	const char *idxfile;//const char idxfile[fileNameSize];
	const char *datafile;//const char datafile[fileNameSize];
	const int32_t dataSize;
	const int32_t idxSize;
	const int32_t hdataSize;
	const int32_t hidxSize;

	// it is about nodeBlock with many small (key,v)s
	// real last pos = _last_data;
	// eg.
	// no data:_last_data = 0;
	// 2 datas:_last_data = 2;
	// like if we put first dataNode in file
	// node.pos = 1, and _last_data++;
	// but the ios::end is at ((_last_data+1)*bits,ios::beg))
	// because the fisrt block is filled by others
	int32_t _last_idx = 1;// in datafile, pos in 0
	int32_t _last_data = 0;// in datafile, pos in 1*sizeof(int32_t)
	int32_t allsize = 0;//in datafile, pos = 2*sizeof(int32_t), datapair<k, v> size
	dataNode tail;//pos == 0, only need left, which stored in 3*sizeof(int32_t) in datafile

	idxNode root;//pos == 1, in idxfile

	int32_t _tmpPosinNode;//no need to init
	int32_t _tmpPosinTree;//no need to init

private:

	// key   1 2 3 4 5
	// son  0 1 2 3 4 5
	// each part of son[k], s.t. son[k]'s all key >= key[k]
	//pos == 0 means it is point at the end, or invalid 
	class idxNode {
	public:

		// size means the size of son
		// size init with 0, key[] start at 1, son start at 0
		int32_t size = 1;
		int32_t pos = 0;

		Key key[figure_size<Key>()];
		int32_t son[figure_size<Key>()] = { 0 };

		// can be optimized
		// type == 1 last level; type == 0, not last level
		int32_t type = 1;

	public:
		idxNode() { }
		idxNode(const int32_t pos, const int32_t size, const int32_t type) { }
		idxNode(int status)  {
			if (status == 0) {
				//init root
				//root pos at 1, no father
				pos = 1;
				type = 1;//means it is the last level
				size = 1;
			}
		}
		~idxNode() = default;
		idxNode &operator=(const idxNode &other) {
			pos = other.pos;
			type = other.type;
			size = other.size;
			for (int32_t i = 0; i < other.size; ++i) {
				key[i] = other.key[i];
				son[i] = other.son[i];
			}
			return *this;
		}

	};

	// key  0 1 2 3 4 5
	// son  0 1 2 3 4 5
	//pos == 0 means it is point at the end, or invalid 
	class dataNode {
	public:

		int32_t pos = 0;// using pos == 0 to tag it haven't write in file
		int32_t size = 0;	

		int32_t left = 0, right = 0;

		Key key[figure_size<V>()];
		V data[figure_size<V>()];

	public:

		dataNode() { };

		// default dont write in the file
		dataNode(const Key &k, const V &val, int32_t _pos):pos(_pos), size(1) {
			key[0] = k;
			data[0] = val;
		}
		~dataNode() = default;
		dataNode &operator=(const dataNode &other) {
			size = other.size;
			pos = other.pos;
			left = other.left;
			right = other.right;
			for (int32_t i = 0; i < other.size; ++i) {
				key[i] = other.key[i];
				data[i] = other.data[i];
			}
			return *this;
		}

	};

private:

	// in the faNode, but not add in the file
	// have to judge all things outside
	// and suppose no repetition
	void add(idxNode &x, const Key &k, const int32_t son_pos) {
		if (x.size == idxSize) throw node_full();

		int32_t i;
		for (i = 1; i < x.size; ++i)
			if (cmp(k, x.key[i])) break;
		//if (i == size) i = 1;

		for (int32_t j = x.size; j > i; --j) {
			x.key[j] = x.key[j - 1];
			x.son[j] = x.son[j - 1];
		}
		x.key[i] = k;
		x.son[i] = son_pos;

		++x.size;
		return;
	}

	//no writing
	//no judging merge or adopt
	void del(idxNode &x, const Key &k, const int32_t num) {
		if (x.size == 0) throw not_exist();

		//way
		int32_t i;
		for (i = 1; i < x.size; ++i)
			if (!cmp(k, x.key[i]) && !cmp(x.key[i], k)) break;

		--x.size;
		for (int32_t j = i; j < x.size; ++j) 	x.key[j] = x.key[j + 1];
		for (i = num; i < x.size; ++i) x.son[i] = x.son[i + 1];
		return;
	}

	// in the faNode, but not add in the file
	int32_t add(dataNode &x, const Key &k, const V &val) {

		if (x.size == dataSize) throw node_full();

		//way 2
		int32_t i;
		for (i = 0; i < x.size; ++i)
			if (cmp(k, x.key[i])) 	break;//??

		if (i > 0 && !cmp(k, x.key[i - 1]) && !cmp(x.key[i - 1], k)) throw repetition();

		for (int32_t j = x.size; j > i; --j) {
			x.key[j] = x.key[j - 1];
			x.data[j] = x.data[j - 1];
		}
		x.key[i] = k;
		x.data[i] = val;
		++x.size;

		return i;//insert pos
	}

	//no file writing
	//no merge adopt
	int32_t del(dataNode &x, int32_t _deletepos) {
		if (x.size == 0) throw not_exist();

		--x.size;
		for (int32_t i = _deletepos; i < x.size; ++i) {
			x.key[i] = x.key[i + 1];
			x.data[i] = x.data[i + 1];
		}

		//if (size == 0) valid = 0;
		return _deletepos;
	}

public:

	//just for datafile
	class iterator {
	private:

		int32_t cur;//in the dataNode
		dataNode now;
		database *mine;

	public:

		friend class database;// necessary?

		iterator()
			: cur(0), mine(nullptr), now(dataNode()) { }
		iterator(database *p, const dataNode &x, const int32_t &cur = 0)
			: now(x), cur(cur), mine(p) { }
		iterator(database *p, const int32_t &_posintree, const int32_t &_posinnode)
			: cur(_posinnode), mine(p) {
			(*mine).read(_posintree, now);
		}
		iterator(const iterator &other)
			: cur(other.cur), mine(other.mine), now(other.now) { }
		~iterator() { }
		iterator &operator=(const iterator &other) {
			cur = other.cur;
			mine = other.mine;
			now = other.now;
			return *this;
		}

		iterator &operator++() {

			if (now.pos == 0) throw out_of_bound();
			if (now.size > cur + 1) {
				++cur;
				return *this;
			}
			if (now.right == 0) {
				now = (*mine).tail;
				cur = 0;
				return *this;
			}
			(*mine).read(now.right, now);
			cur = 0;
			return *this;
		}
		iterator operator++(int) {
			iterator tmp = *this;
			++(*this);
			return tmp;
		}
		Key &findkey() {
			return now.key[cur];
		}
		iterator &operator--() {
			if (cur > 0) {
				--cur;
				return *this;
			}
			if (now.left == 0) throw out_of_bound();
			(*mine).read(now.left, now);//now.pos == 0 //tail also ok
			cur = now.size - 1;
			return *this;
		}
		iterator operator--(int) {
			iterator tmp = *this;
			--(*this);
			return tmp;
		}

		V &operator*() { 
			if (now.pos == 0) throw out_of_bound();
			return now.data[cur];
		}
		V *operator->() const noexcept { return &(now.data[cur]); }
		void write(){ (*mine).write(now); }

		bool operator==(const iterator &rhs) const {
			if (rhs.mine != mine) return 0; // node != override havent done, so cant use it
			if (!cmp(now.key[cur], rhs.now.key[cur]) && !cmp(rhs.now.key[cur], now.key[cur])) return 1;		
			return 0;
		}
		bool operator!=(const iterator &rhs) const { return !(*this == rhs); }

	};

private:

	void read(int32_t pos, dataNode &x) {
		if (pos == 0) throw not_exist();
		data.seekg(pos*bits);
		data.read(reinterpret_cast<char*>(&x), sizeof(dataNode));
	}
	void read(int32_t pos, idxNode &x) {
		if (pos == 0) throw not_exist();
		idx.seekg(pos*bits);
		idx.read(reinterpret_cast<char*>(&x), sizeof(idxNode));
	}
	void write(dataNode &x) {
		data.seekp(x.pos*bits);
		data.write(reinterpret_cast<char*>(&x), sizeof(dataNode));
	}
	void write(idxNode &x) {
		idx.seekp(x.pos*bits);
		idx.write(reinterpret_cast<char*>(&x), sizeof(idxNode));
	}

	// if cant't find cur key, return the next pair which s.t. key[] >= k
	pair<bool, iterator> pfind(const Key &k, idxNode cur) {
		if (empty()) {
			return pair<bool, iterator>(0, end());
		}

		int32_t i;
		while (true) {
			if (cur.type == 1) {// next is leaf
				for (i = cur.size - 1; i > 0; --i)
					if (!cmp(k, cur.key[i])) break;

				dataNode leaf;
				read(cur.son[i], leaf);
				//way 
				for (i = leaf.size - 1; i >= 0 ; --i)
					if (!cmp(k, leaf.key[i])) 
						return pair<bool, iterator>(1, iterator(this, leaf, i));
				//way can be optimized by binary search

				if(leaf.right) read(leaf.right, leaf);
				else leaf = tail;
				return pair<bool, iterator>(0, iterator(this, leaf, 0));
			}
			//type == 0, not the last level idxnode

			//way
			for (i = cur.size - 1; i > 0; --i)
				if (!cmp(k, cur.key[i])) break;

			read(cur.son[i], cur);
		}

	}

	int32_t pbegin(const int32_t _cur) {
		idxNode cur;
		read(_cur, cur);

		while (true) {
			if (cur.type == 1) {// next is leaf
				int32_t _curpos2 = cur.son[1];
				read(cur.son[0], cur);
				if (cur.size == 0) return _curpos2;
				return cur.son[0];
			}
			int32_t _curpos2 = cur.son[1];
			read(cur.son[0], cur);
			if (cur.size == 1) read(_curpos2, cur);
		}
	}

	//havent write oldnode and newnode
	//key[_breaksize] is the boundary
	void split(const int32_t _breaksize, idxNode &cur, idxNode &_new) {
		int32_t i, j;
		for (i = _breaksize, j = 0; i < cur.size; ++i, ++j) {
			_new.key[j] = cur.key[i];//for j = 0, key[_breaksize] is useless
			_new.son[j] = cur.son[i];
		}

		_new.type = cur.type;
		_new.size = cur.size - _breaksize;
		cur.size = _breaksize;

		++_last_idx;
		_new.pos = _last_idx;

		return;
	}

	//k is the insert key, and insert son pos is son_pos which > key
	pair<Key, int32_t> addIdx(const Key &k, const int32_t son_pos, idxNode &cur) {
		if (cur.size < idxSize) {
			//if (!cur.pos) cur.pos = ++_last_idx;
			add(cur, k, son_pos);
			write(cur);
			
			return pair<Key, int32_t>(cur.key[1], 0);
		}

		//split
		idxNode newNode;// newNode is hte same level of dataNode
		int32_t i;
		for (i = cur.size - 1; i > 0; ++i)
			if (!cmp(k, cur.key[i])) break;

		Key tmp;//tmp is the key between old and newnode
		int32_t mid = hidxSize;
		if (i + 1 <= mid) { //half dont need
			mid = mid - 1;
			tmp = cur.key[mid];
			split(mid, cur, newNode);
			add(cur, k, son_pos);
		}
		else {
			tmp = cur.key[mid];
			split(mid, cur, newNode);
			add(newNode, k, son_pos);
		}
		//newNode always larger than curnode
		write(newNode);
		write(cur);

		return pair<Key, int32_t>(tmp, newNode.pos);
	}

	//havent write oldnode and newnode
	void split(const int32_t _breaksize, dataNode &cur, dataNode &_new) {
		int32_t i, j;
		for (i = _breaksize, j = 0; i < cur.size; ++i, ++j) {
			_new.key[j] = cur.key[i];
			_new.data[j] = cur.data[i];
		}
		
		_new.size = cur.size - _breaksize;
		cur.size = _breaksize;
		
		++_last_data;
		_new.pos = _last_data;

		if (cur.right) {
			dataNode tmp;
			read(cur.right, tmp);
			_new.right = cur.right;
			tmp.left = _last_data;
			write(tmp);
		}
		else {
			tail.left = _last_data;
			//data.seekp(bits - sizeof(int32_t));
			//data.write(reinterpret_cast<char*>(&tail.left), sizeof(int32_t));
		}

		cur.right = _last_data;//newNode pos
		_new.left = cur.pos;

		return;
	}

	pair<Key, int32_t> addData(const Key &k, const V &val, int32_t _cur) {
		++allsize;
		dataNode cur;
		read(_cur, cur);

		if (cur.size < dataSize) {
			_tmpPosinTree = _cur;
			_tmpPosinNode = add(cur, k, val);
			write(cur);

			return pair<Key, int32_t>(cur.key[0], 0);
		}

		//split
		dataNode newNode;// newNode is hte same level of dataNode

		int32_t i;
		for (i = 0; i < cur.size; ++i)
			if (cmp(k, cur.key[i])) break;// i is the pos of <key, val> which will be replace by the insert pair

		// 1 2 3 ----- hidxSize    hidxSize+1 ---- size
		// 0 1 2 ---- hidxSize-1    hidxSize+2 ----- size-1
		//   ^k, then 
		// start from 0 to hidxSize-1 is oldnode
		int32_t mid = hdataSize;
		if (i + 1 <= mid) { //half dont need
			mid = mid - 1;
			split(mid, cur, newNode);
			_tmpPosinTree = _cur;
			_tmpPosinNode = add(cur, k, val);
		}
		else {
			split(mid, cur, newNode);
			_tmpPosinTree = newNode.pos;
			_tmpPosinNode = add(newNode, k, val);
		}
		//newNode always larger than curnode
		write(newNode);
		write(cur);
		return pair<Key, int32_t>(newNode.key[0], newNode.pos);
	}

	//key always return the min key between(oldnode, newnode) for usage
	pair<Key, int32_t> pinsert(const Key &k, const V &val, int32_t _cur) {
		idxNode cur;
		read(_cur, cur);

		int32_t i;
		for (i = cur.size - 1; i > 0; --i)
			if (!cmp(k, cur.key[i])) break;

		pair<Key, int32_t> p;
		if (cur.type == 1) {
			if (cur.size == 1) {//default is has node, but dont has son
				///maybe never happen???
				cur.pos = _cur = ++_last_idx;
				dataNode tmp(k, val, ++_last_data);
				dataNode tmp2;
				tmp2.pos = ++_last_data;
				cur.son[0] = tmp2.pos;
				cur.son[1] = tmp.pos;
				cur.key[1] = k;
				p.first = k;
				p.second = 0;

				write(tmp);
				write(tmp2);
				write(cur);
				return p;
			}
			else p = addData(k, val, cur.son[i]);
		}
		else 	p = pinsert(k, val, cur.son[i]);

		if (p.second) p = addIdx(p.first, p.second, cur);// once p.second == 0, all of the recursive functions.second == 0
		//write(cur);

		return p;

	}

	//the right side node always remains,which means dont care about tail if merge
	void merge(dataNode &_del, dataNode &_left) {
		int32_t i, j;/// int32_t --- always >= 0
		for (i = _left.size - 1, j = _del.size + _left.size - 1; i >= 0; --i, --j) {
			_left.key[j] = _left.key[i];
			_left.data[j] = _left.data[i];
		}

		for (i = 0; i < _del.size; ++i) {
			_left.key[i] = _del.key[i];
			_left.data[i] = _del.data[i];
		}

		_left.left = _del.left;
		if (_del.left) {
			dataNode tmp;
			read(_del.left, tmp);
			tmp.right = _left.pos;
			write(tmp);
		}


		_left.size += _del.size;
		return;
	}

	pair<Key, int32_t> delData(const Key &k, const int32_t &_neighborpos, const int32_t &_cur, const bool &left) {
		--allsize;
		dataNode cur;

		read(_cur, cur);

		int32_t i;
		for (i = 0; i < cur.size; ++i)
			if (!cmp(k, cur.key[i]) && !cmp(cur.key[i], k)) break;
		if (i == cur.size) throw not_exist();

		_tmpPosinTree = cur.pos;
		_tmpPosinNode = del(cur, i);

		if (cur.size >= hdataSize) {
			write(cur);
			return pair<Key, int32_t>(cur.key[0], 0);
		}
		dataNode neighbor;
		read(_neighborpos, neighbor);
		if (left) {
			if (neighbor.size > hdataSize) {
				add(cur, neighbor.key[neighbor.size - 1], neighbor.data[neighbor.size - 1]);
				--neighbor.size;
				write(cur);
				write(neighbor);
				return pair<Key, int32_t>(cur.key[0], 1);
			}

			merge(neighbor, cur);
			write(cur);

			return pair<Key, int32_t>(cur.key[0], 2);
		}
		else {// right, and dont have left sibling
			if (neighbor.size > hdataSize) {
				add(cur, neighbor.key[0], neighbor.data[0]);
				del(neighbor, 0);

				write(cur);
				write(neighbor);
				return pair<Key, int32_t>(neighbor.key[0], 3);
			}

			merge(cur, neighbor);
			write(neighbor);

			return pair<Key, int32_t>(neighbor.key[0], 4);
		}
	}
	//del always be left!

	void merge(idxNode &_del, idxNode &_left, const Key &k) {
		//dataNode tmp;
		//read(pbegin(_left.son[0]), tmp);
		//Key k = tmp.key[0];
		int32_t i, j;
		for (i = _left.size - 1, j = _del.size + _left.size - 1; j >= _del.size; --i, --j) {
			_left.key[j] = _left.key[i];
			_left.son[j] = _left.son[i];
		}		
		for (i = 0; i < _del.size; ++i) {
			_left.key[i] = _del.key[i];
			_left.son[i] = _del.son[i];
		}
		_left.key[_del.size] = k;
		
		_left.size += _del.size;
		
		return;
	}

	//perase dont care about return key??
	//tmpk is the key between neighbor and cur, which inherit from father
	pair<Key, int32_t> perase(const Key &k, int32_t _neighbor, int32_t _cur, bool left, const Key &tmpk) {
		idxNode cur;
		read(_cur, cur);

		int32_t i;
		for (i = cur.size - 1; i >= 0; --i)
			if (!cmp(k, cur.key[i])) break;

		pair<Key, int32_t> p;
		if (cur.type == 1) {
			//if inavailable for siblings, pos = 0;
			if (i > 0) p = delData(k, cur.son[i - 1], cur.son[i], 1);// must left
			else  p = delData(k, cur.son[i + 1], cur.son[i], 0);//must right
		}
		else {//root type = 0
			if (i > 0) p = perase(k, cur.son[i - 1], cur.son[i], 1, cur.key[i]);// must left
			else  p = perase(k, cur.son[i + 1], cur.son[i], 0, cur.key[i + 1]);//must right
		}

		//change1:
		// 1, 3, 4 after changing , directingly delete
		// dont delete, but merge first,
		switch (p.second) {
		case 1:
			cur.key[i] = p.first;
			break;
		case 2:
			del(cur, cur.key[i], i - 1);// have to divide 2 things
			break;
		case 3:
			cur.key[i + 1] = p.first;
			break;
		case 4:
			del(cur, cur.key[i + 1], i);// have to divide 2 things
			break;
		default:
			//if (p.second == 0 || p.second == 1 || p.second == 3)
			//write(cur);
			return pair<Key, int32_t>(cur.key[1], 0);// dont have to change key value
		}

		// pirated of delnode, just like it,,,, delidx
		if (cur.size >= hidxSize) return pair<Key, int32_t>(cur.key[1], 0);

		idxNode neighbor;
		read(_neighbor, neighbor);
		if (left) {
			if (neighbor.size > hidxSize) {
				//dataNode tmp;
				//read(pbegin(cur.son[0]), tmp);

				//cur.add(neighbor.key[neighbor.size - 1], neighbor....);
				//add overwrite
				//all move backaward 1 step
				//for (int32_t j = cur.size; j > 0; --j) {
				//	cur.key[j] = cur.key[j - 1];
				//	cur.son[j] = cur.son[j - 1];
				//}
				//cur.key[1] = tmpk;
				//cur.son[0] = neighbor.son[neighbor.size - 1];
				//++cur.size;
				add(cur, tmpk, neighbor.son[neighbor.size - 1]);
				//Key _tmpk = neighbor.key[neighbor.size - 1];
				
				--neighbor.size;

				write(cur);
				write(neighbor);
				return pair<Key, int32_t>(neighbor.key[neighbor.size], 1);
			}

			merge(neighbor, cur, tmpk);
			write(cur);

			//dataNode tmp;
			//read(pbegin(cur.son[0]), tmp);
			//return pair<Key, int32_t>(tmp.key[0], 2);
			return pair<Key, int32_t>(neighbor.key[1], 2);//useless
		}
		else {// right, and dont have left sibling
			if (neighbor.size > hidxSize) {
				//dataNode tmp;
				//read(pbegin(neighbor.son[0]), tmp);

				//all move forward 1 step
				cur.key[cur.size] = tmpk;
				cur.son[cur.size] = neighbor.son[neighbor.size - 1];
				++cur.size;
				Key _tmpk = neighbor.key[1];
				del(neighbor, neighbor.key[1], 0);

				write(cur);
				write(neighbor);
				return pair<Key, int32_t>(_tmpk, 3);
			}

			merge(cur, neighbor, tmpk);
			write(neighbor);

			return pair<Key, int32_t>(neighbor.key[1], 4);
		}
	}

public:
	//first block is nothing, node start from second block
	//	means root.pos = 1, read root : seekg(1 * bits, ios::beg);

    database(const char *a, const char *b): idxfile(a), datafile(b),
		idxSize(figure_size<Key>()), dataSize(figure_size<V>())
		, hdataSize(half(dataSize)), hidxSize(half(idxSize)){

        ifstream in(idxfile);//read
		if (!in) {
			ofstream out(datafile, ios::binary | ios::out);		
			if (!out) throw file_error();
			out.close();

			out.open(idxfile);
			if (!out) throw file_error();
			root = idxNode(0);
			write(root);
			out.close();

			//root
			_last_data = 0;// init with data has no nodes
			_last_idx = 1;// init with data has 1 node(root)
			allsize = 0;
			tail.left = 0;

			idx.open(idxfile, ios::binary | ios::in | ios::out);
			data.open(datafile, ios::binary | ios::in | ios::out);
		}
		else {
			in.close();

			idx.open(idxfile, ios::binary | ios::in | ios::out);
			if (!idx) throw file_error();
			data.open(datafile, ios::binary | ios::in | ios::out);
			if (!data) throw file_error();

			data.seekg(0);
			data.read(reinterpret_cast<char*>(&_last_idx), sizeof(int32_t));
			data.read(reinterpret_cast<char*>(&_last_data), sizeof(int32_t));
			data.read(reinterpret_cast<char*>(&allsize), sizeof(int32_t));
			data.read(reinterpret_cast<char*>(&tail.left), sizeof(int32_t));			

			read(1, root);
		}
    }

    ~database(){
		write(root);

		data.seekp(0);
		data.write(reinterpret_cast<char*>(&_last_idx), sizeof(int32_t));
		data.write(reinterpret_cast<char*>(&_last_data), sizeof(int32_t));
		data.write(reinterpret_cast<char*>(&allsize), sizeof(int32_t));
		data.write(reinterpret_cast<char*>(&tail.left), sizeof(int32_t));

		data.close();
		idx.close();
	}

	void clear() {
		idx.close();
		data.close();
		ofstream out(idxfile);
		if (!out) throw file_error();
		out.close();		
		out.open(datafile);
		if (!out) throw file_error();
		out.close();

		idx.open(idxfile, ios::binary | ios::in | ios::out);
		data.open(datafile, ios::binary | ios::in | ios::out);

		root = idxNode(0);
		write(root);
		_last_data = 0;
		_last_idx = 1;
		allsize = 0;
		tail.left = 0;
	}

	bool empty() {
		if (allsize) return 0;
		return 1;
	}

	int32_t size(){
		return allsize;
	}
	
	//pair<bool, iterator> find(const Key &k) {
	//	read(1, root);
	//	return pfind(k, root);
	//}
	iterator find(const Key &k) {
		read(1, root);
		return pair<bool, iterator>(pfind(k, root)).second;
	}

	iterator begin() {
		/*if (empty()) throw not_exist();
		return iterator(this, head, 0);*/
		if (empty()) return end();
		
		int32_t cur = pbegin(1);
		return iterator(this, cur, 0);
	}

	iterator end() {
		return iterator(this, tail, 0);
	}

	// while split node, new node always inherit the larger part
	// while merge node, old (the one left)node always inherit the smaller part
	iterator insert(const Key &k, const V &val) {

		if (empty()) {
			++root.size;
			++allsize;
			root.key[1] = k;
			root.son[1] = ++_last_data;
			dataNode tmp(k, val, _last_data);
			root.son[0] = ++_last_data;
			dataNode tmp2;
			tmp2.pos = _last_data;
			tmp2.right = tmp.pos;
			tmp.left = tmp2.right;

			tail.left = tmp.pos;
			write(tmp2);
			write(tmp);
			write(root);
			return iterator(this, tmp, 0);
		}

		pair<Key, int32_t> p = pinsert(k, val, 1);

		//split a new node with root level
		if (p.second) {//return newnode pos
			read(1, root);// may change the values
			idxNode _newroot(0, 2, 1);
			++_last_idx;// which may be the pos of old root

			_newroot.son[0] = root.pos = _last_idx;
			_newroot.key[1] = p.first;
			_newroot.son[1] = p.second;

			write(_newroot);
			write(root);

			root = _newroot;
		}

		return iterator(this, _tmpPosinTree, _tmpPosinNode);
	}
	iterator insert(const std::pair<Key, V> &value) { return insert(value.first, value.second); }

	iterator erase(const Key &k) {
		if (empty()) throw not_exist();

		read(1, root);
		if (root.type && root.size == 2) {
			dataNode tmp;
			if (cmp(k, root.key[1])) read(root.son[0], tmp);
			else read(root.son[1], tmp);
			int32_t i;
			for (i = 0; i < tmp.size; ++i)
				if (!cmp(k, tmp.key[i]) && !cmp(tmp.key[i], k)) break;
			if (tmp.size == i) throw not_exist();
			_tmpPosinTree = tmp.pos;
			_tmpPosinNode = del(tmp, i);
			write(tmp);
			return iterator(this, _tmpPosinTree, _tmpPosinNode);
		}
		//way
		int32_t i;
		for (i = root.size - 1; i > 0; --i)
			if (!cmp(k, root.key[i])) break;

		pair<Key, int32_t> p;
		if (root.type == 1) {//if inavailable for siblings, pos = 0;		
			if (i > 0) p = delData(k, root.son[i - 1], root.son[i], 1);// must left
			else  p = delData(k, root.son[i + 1], root.son[i], 0);//must right
		}
		else {//root type = 0
			if (i > 0) p = perase(k, root.son[i - 1], root.son[i], 1, root.key[i]);// must left
			else  p = perase(k, root.son[i + 1], root.son[i], 0, root.key[i + 1]);//must right
		}

		//for p.first == 1, 3; adopt son then the key may be change,so for secure, must change the key; only for 0, dont need
		switch (p.second) {
		case 1:
			root.key[i] = p.first;
			break;
		case 2:// i is the key between i - 1 and i		
			del(root, root.key[i], i - 1);// have to divide 2 things
			break;

		//i == 0
		case 3:
			root.key[i + 1] = p.first;
			break;
		case 4:
			del(root, root.key[i + 1], i);// have to divide 2 things
			break;
		}

		if (root.type == 0 && root.size == 1) {
			read(root.son[1], root);// for some rule, the right son will always remain
			root.pos = 1;
		}

		write(root);
		return iterator(this, _tmpPosinTree, _tmpPosinNode);
	}
	iterator erase(const Key &k, const V &val) {
		iterator tmp = find(k);
		if (*tmp != val) throw not_exist();

		return erase(k);
	}
	iterator erase(const std::pair<Key, V> &value) { return erase(value.first, value.second); }
	iterator erase(const iterator &iter) {
		if (iter.pos == 0) throw out_of_bound();
		return erase(iter.now.key[iter.cur]);
	}

	//can only change the value
	// will writen in file
	iterator modify(const Key &k, const V &val) {
		iterator iter = find(k);
		*(iter) = val;
		write(iter.now);
		return iter;
	}
	iterator modify(const std::pair<Key, V> &value) { return modify(value.first, value.second); }
	iterator modify(iterator &iter, const V &val) {
		if (iter.now.pos == 0) throw not_exist();
		*(iter) = val;
		write(iter.now);
		return iter;
	}

};

#endif

//278 char file[fileNameSize] = '\0';
//279 fstream data;///?, conflict??


//void pbegin() {
//	if (empty()) throw not_exist();
//	idxNode cur = root;

//	while (true) {
//		if (cur.type == 1) {// next is leaf
//			data.seekg(cur.son[0] * bits);
//			data.read(reinterpret_cast<char*>(&head), sizeof(dataNode));
//			if (head.size == 0) cerr << "return head error\n";
//			_min_key = head.key[0];
//			return;
//		}
//	
//		//type == 0, not the last level idxnode
//		idx.seekg(cur.son[0] * bits);
//		idx.read(reinterpret_cast<char*>(&cur), sizeof(idxNode));
//	}
//}



/*
dataNode addData(dataNode &cur, const Key &k, const V &val, int32_t &cur_in_data) {
if (cur->size < dataSize) {  //dont split dataNode ,also dont split idxNode
cur_in_data = _node.add(k, v);
data.seekp(cur->pos*bits);
data.write(reinterpret_cast<char*>(&*cur), sizeof(dataNode));

return cur;
}
else if(cur.size != dataSize) cerr << "addDataNode Error\n";

++_last_data;

int32_t i;
int32_t hidxSize = cur.size / 2;
dataNode newNode, tmp;
newNode.size = cur.size;
for (i = hidxSize; i < newNode.size; ++i) {
newNode.key[i - hidxSize] = cur.key[i];
newNode.data[i - hidxSize] = cur.data[i];
--cur.size;
}
newNode.fa = cur.fa;
newNode.size = newNode.size - cur.size;
newNode.pos = _last_data;

if (!cmp(k, newNode.key[0])) newNode.add(k, val);
else cur.add(k, val);

data.seekg(cur.right*bits);
data.read(reinterpret_cast<char*>(&tmp), sizeof(dataNode));
newNode.right = cur.right;
tmp.left = _last_data;
data.seekp(tmp.pos*bits);
data.write(reinterpret_cast<char*>(&tmp), sizeof(dataNode));

cur.right = _last_data;//newNode pos
newNode.left = cur.pos;
data.seekp(cur.pos*bits);
data.write(reinterpret_cast<char*>(&cur), sizeof(dataNode));

data.seekp(newNode.pos*bits);
data.write(reinterpret_cast<char*>(&newNode), sizeof(dataNode));

return newNode;
}
*/

// if dont split return cur as pefore
// else split cur
// return new idxNode's pos, and representative key!!??
//dont care fa
//int32_t addIdx(Key &_newKey, idxNode &cur, const Key &son_k, const int32_t &son_pos) {
//	if (cur.size < idxSize) {
//		cur.add(son_k, son_pos);
//		idx.seekp(cur.pos*bits);// or cur_fa.pos*bits
//		idx.write(reinterpret_cast<chra*>(&cur), sizeof(idxNode));
//		return cur.pos;
//	}
//	else if (cur.size != idxSize) cerr << "addidxNode Error\n";

//	++_last_idx;

//	int32_t i;
//	int32_t hidxSize = cur.size / 2;
//	idxNode newNode, tmp;
//	newNode.size = cur.size;

//	for (i = hidxSize; i < newNode.size; ++i) {
//		newNode.key[i - hidxSize] = cur.key[i];
//		newNode.son[i - hidxSize] = cur.son[i];
//		--cur.size;
//	}

//	newNode.fa = cur.fa;
//	newNode.size = newNode.size - cur.size;// key disappear 1 
//	newNode.pos = _last_idx;
//	newNode.type = cur.type;

//	if (!cmp(son_k, newNode.key[0])) newNode.add(son_k, val);
//	else cur.add(son_k, val);
//	
//	//idx.seekg(cur.right*bits);
//	//idx.read(reinterpret_cast<char*>(&tmp), sizeof(idxNode));
//	//newNode.right = cur.right;
//	//tmp.left = _last_data;
//	//idx.seekp(tmp.pos*bits);
//	//idx.write(reinterpret_cast<char*>(&tmp), sizeof(idxNode));

//	//cur.right = _last_data;//newNode pos
//	//newNode.left = cur.pos;
//	idx.seekp(cur.pos*bits);
//	idx.write(reinterpret_cast<char*>(&cur), sizeof(idxNode));

//	idx.seekp(newNode.pos*bits);
//	idx.write(reinterpret_cast<char*>(&newNode), sizeof(idxNode));
//	
//	
//	_new_key = newNode.key[0];
//	return newNode.pos;
//}



//if  can't find a key there we return bool = 0
//may be pair iter, bool find
//// if cant't find cur key, return the next key
//pair<bool, iterator> pfind(const Key &k, idxNode cur) {
//	if (empty()) {
//		dataNode leaf;
//		return pair<bool, iterator>(0, iterator());
//	}
//
//	int32_t i;
//	while (true) {
//		if (cur.type == 1) {// next is leaf
//			for (i = cur.size - 1; i > 0; --i)
//				if (!cmp(k, cur.key[i])) break;
//
//			dataNode leaf;
//			read(cur.son[i], leaf);
//			//way 
//			for (i = 0; i < leaf.size; ++i)
//				if (!cmp(k, leaf.key[i]) && !cmp(leaf.key[i], k)) {
//					return pair<bool, iterator>(1, iterator(this, leaf, i));
//				}
//			//way can be optimized by binary search
//
//			return pair<bool, iterator>(0, iterator());
//		}
//		//type == 0, not the last level idxnode
//
//		//way
//		for (i = cur.size - 1; i > 0; --i)
//			if (!cmp(k, cur.key[i])) break;
//
//		read(cur.son[i], cur);
//	}
//
//}