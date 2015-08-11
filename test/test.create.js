/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( './fixtures/noop.js' ),
	add1 = require( './fixtures/add1.js' ),
	add = require( './fixtures/add.js' ),
	create = require( './../lib/create.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'create apply', function tests() {

	it( 'should export a function', function test() {
		expect( create ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided the number of input arrays as a positive integer', function test() {
		var values = [
			'5',
			Math.PI,
			-1,
			NaN,
			true,
			null,
			undefined,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				create( value );
			};
		}
	});

	it( 'should throw an error if provided an apply function argument which is not a function', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				create( value, 4 );
			};
		}
	});

	it( 'should return a function', function test() {
		var apply;

		apply = create( 4 );
		expect( apply ).to.be.a( 'function' );

		apply = create( noop, 4 );
		expect( apply ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided incompatible typed-array-like arguments', function test() {
		var values,
			apply1,
			apply2;

		values = [
			new Int8Array( [1,2,3,4] ),
			new Int8Array(),
			new Int8Array( [1,2,3,4,5] )
		];

		apply1 = create( 2 );
		apply2 = create( noop, 2 );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( Error );
			expect( badValue2( values[i] ) ).to.throw( Error );
		}
		function badValue1( value ) {
			return function() {
				apply1( noop, new Int8Array( [1,2,3] ), value );
			};
		}
		function badValue2( value ) {
			return function() {
				apply2( new Int8Array( [1,2,3] ), value );
			};
		}
	});

	it( 'should apply a function to a single typed array', function test() {
		var apply,
			actual,
			arr,
			out;

		arr = new Int8Array( [1,1,1,1] );

		// General apply...
		out = new Array( arr.length );

		apply = create( 2 );
		actual = apply( add1, out, arr );

		assert.strictEqual( actual, out );
		assert.deepEqual( out, [2,2,2,2] );

		// Apply a particular function...
		out = new Array( arr.length );
		apply = create( add1, 2 );

		actual = apply( out, arr );
		assert.deepEqual( out, [2,2,2,2] );
	});

	it( 'should apply a function to multiple typed arrays', function test() {
		var apply,
			actual,
			arr1,
			arr2,
			out;

		arr1 = new Int8Array( [1,1,1,1] );
		arr2 = new Float32Array( [2,2,2,2] );

		// General apply...
		out = new Array( arr1.length );
		apply = create( 3 );

		actual = apply( add, out, arr1, arr2 );
		assert.strictEqual( actual, out );
		assert.deepEqual( out, [3,3,3,3] );

		// Apply a particular function...
		out = new Array( arr1.length );
		apply = create( add, 3 );

		actual = apply( out, arr1, arr2 );
		assert.strictEqual( actual, out );
		assert.deepEqual( out, [3,3,3,3] );
	});

});
