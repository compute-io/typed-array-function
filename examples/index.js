'use strict';

var arrayfun = require( './../lib' );

var arr1,
	arr2,
	out,
	i;

arr1 = new Float32Array( 25 );
for ( i = 0; i < arr1.length; i++ ) {
	arr1[ i ] = i;
}

arr2 = new Uint8Array( 25 );
for ( i = 0; i < arr2.length; i++ ) {
	arr2[ i ] = 5;
}

function add( x, y ) {
	return x + y;
}

out = arrayfun( add, arr1, arr2 );
console.log( out );
