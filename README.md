# angularjs_indexedDB
angularjs_indexedDB

This is my note to work with indexedDB

I used lib from here:

https://github.com/bramski/angular-indexedDB

# AngularJS IndexedDB Cheatset

## Declare App

```js
var app = angular.module('myApp', ['indexedDB']);
```

## Create Database

`db.createObjectStore(storeName, options);`

> Declare a database

`store.createIndex(indexName, keyPath, options);`

> Declare index for search able fields

```js
app.config(function ($indexedDBProvider) {
$indexedDBProvider
  .connection('myIndexedDB')
  .upgradeDatabase(1, function(event, db, tx){	
	var objStore = db.createObjectStore('people', {keyPath: 'id',autoIncrement: true});
	//Primary is id
	//primary is autoIncrement
	
	//store.createIndex(indexName, keyPath, options);
	objStore.createIndex('name_idx', 'name', {unique: false});
	objStore.createIndex('country_idx', 'country', {unique: false});
  });
});
```

## Insert

### Insert single record

```js
$indexedDB.openStore('people', function(store){
	store.insert({"name": "John Doe2", "country": "Norway"}).then(function(e){
		console.log('Da insert');
	});
});
```

### Insert an array

```js
$indexedDB.openStore('people', function(store){
	var names = [
		{name:'Jani',country:'Norway'},
		{name:'Carl',country:'Sweden'},
		{name:'Margareth',country:'England'},
		{name:'Hege',country:'Norway'},
		{name:'Joe',country:'Denmark'},
		{name:'Gustav',country:'Sweden'},
		{name:'Birgit',country:'Denmark'},
		{name:'Mary',country:'England'},
		{name:'Kai',country:'Norway'}
	];
	
	store.insert(names).then(function(e){
		// do something
	});
});
```

## Select all records

```js
$indexedDB.openStore('people', function(store){
	store.getAll().then(function(peoples) {
		// Assign vaiable to scope
		$scope.objects = peoples;
	});
});
```

## Get all key

```js
$indexedDB.openStore('people', function(store){
	store.getAllKeys().then(function(e){
		$scope.primaryKeys = e;
	});
});
```

## Delete

### Delete all

```js
$indexedDB.openStore('people', function(store){
	store.clear().then(function(){
		// do something
	});
});
```

### Delete a record

```js
$indexedDB.openStore('people', function(store){
	//delete obj id=2
	store.delete(2).then(function(){
		// do something
	});
});
```

## Count records

```js
$indexedDB.openStore('people', function(peoples){
	peoples.count().then(function(e){
		console.log(e);
	});
});
```

# Search - Find

## Search item where id=9

```js
$indexedDB.openStore('people', function(peoples){
	peoples.find(9).then(function(e){
		console.log(e);
	});
});	
```

## Build a query

* $lt(value) - less than
* $gt(value) - greater than
* $lte(value) - less than or equal
* $gte(value) - greater than or equal
* $eq(value) - equal
* $between(lower, upper, doNotIncludeLowerBound? true/false, doNotIncludeUpperBound true/false) - between two bounds
* $desc(unique) - descending order
* $asc(unique) - ascending order
* $index(value) - name of index

> Find all records with country = "Norway"

```js
$indexedDB.openStore('people', function(peoples){
	var find = peoples.query();
	//find=find.$eq(5);
	//find=find.$lt(3);
	//console.log(find);		
	//find = find.$index("name_idx");
	
	//Find in country, key = Norway
	find=find.$index("country_idx");
	find=find.$eq("Norway");
	
	//update scope
	peoples.eachWhere(find).then(function(e){
		console.log(e);
		$scope.people = e;
	});
});
```

That's all, hope it useful for you^^

(But I'm still finding a way to help search text like `.. like "%blabla%"` @@)



---

https://itnext.io/indexeddb-your-second-step-towards-progressive-web-apps-pwa-dcbcd6cc2076

https://github.com/bramski/angular-indexedDB


https://gist.github.com/inexorabletash/a279f03ab5610817c0540c83857e4295