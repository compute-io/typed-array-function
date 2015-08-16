/* jshint evil:true */
'use strict';

// MODULES //

var isPositiveInteger = require( 'validate.io-positive-integer' ),
	isFunction = require( 'validate.io-function' );


// CREATE //

/**
* FUNCTION: create( [fcn,] num )
*	Returns a function for applying a function to each typed array element.
*
* @param {Function} [fcn] - function to apply. If not provided, a function must be provided at runtime.
* @param {Number} num - number of array arguments
* @returns {Function} apply function
*/
function create() {
	var nargs = arguments.length,
		flg,
		num,
		fcn,
		n,
		f,
		i;

	if ( nargs === 1 ) {
		num = arguments[ 0 ];
		flg = true;
	}
	else if ( isFunction( arguments[ 0 ] ) ) {
		fcn = arguments[ 0 ];
		num = arguments[ 1 ];
		flg = false;
	}
	else {
		throw new TypeError( 'invalid input arguments. Must provide a function to apply and the number of array arguments. Values: `' + arguments + '`.' );
	}
	if ( !isPositiveInteger( num ) ) {
		throw new TypeError( 'invalid input arguments. Parameter specifying the number of array arguments must be a positive integer. Value: `' + num + '`.' );
	}
	// Update the number of input arguments to include the output array...
	n = num;
	num += 1;

	// Code generation. Start with the function definition...
	f = 'return function apply(';

	// Check if a function will be provided at runtime...
	if ( flg ) {
		f += 'fcn,';
	}
	// Create the array arguments...
	// => function apply( [fcn,] o, a1, a2,...) {
	f += 'o,';
	for ( i = 1; i < num; i++ ) {
		f += 'a' + i;
		if ( i < n ) {
			f += ',';
		}
	}
	f += '){';

	// Create the function body...

	// Create internal variables...
	// => var len, i;
	f += 'var len,i;';

	// Perform shape validation (where we assume all input args are arrays)...
	f += 'len=o.length;';
	for ( i = 1; i < num; i++ ) {
		f += 'if(a'+i+'.length!==len){';
		f += 'throw new Error(\'invalid input argument. All arrays must have the same length.\');';
		f += '}';
	}
	/*
		var len,
			i;

		len = o.length;
		if ( a1.length !== len ) {
			throw new Error(...);
		}
		...
	*/

	// Apply the function to each array element...
	f += 'for(i=0;i<len;i++){';
	f += 'o[i]=';
	if ( flg ) {
		f += 'fcn';
	} else {
		f += 'apply._f';
	}
	f += '(';
	for ( i = 1; i < num; i++ ) {
		f += 'a' + i + '[i]';
		if ( i < n ) {
			f += ',';
		}
	}
	f += ');';
	f += '}';
	/*
		for ( i = 0; i < len; i++ ) {
			o[ i ] = fcn( a1[i], a2[i],... );
		}
	*/

	// Return the output array...
	f += 'return o;';

	// Close the function:
	f += '};';

	// Create the function in the global scope...
	f = ( new Function( f ) )();

	// If provided an apply function, bind the apply function to the created function so it may be referenced during invocation...
	if ( flg === false ) {
		f._f = fcn;
	}
	return f;
	/*
		function apply( [fcn,] o, a1, a2,...) {
			var len,
				i;

			len = o.length;
			if ( a1.length !== len ) {
				throw new Error(...);
			}
			...
			for ( i = 0; i < len; i++ ) {
				o[i] = fcn( a1[i], a2[i],...);
			}
			return o;
		}
	*/
} // end FUNCTION create()


// EXPORTS //

module.exports = create;
