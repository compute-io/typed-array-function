'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' ),
	isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	ctors = require( 'compute-array-constructors' ),
	validate = require( './validate.js' );


// APPLY //

/**
* FUNCTION: apply( fcn, ...array[, opts] )
*	Applies a function to each typed array element.
*
* @param {Function} fcn - function to apply
* @param {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} array - input arrays
* @param {Object} [opts] - function options
* @param {String} [opts.dtype="float64"] - output data type
* @param {Boolean} [opts.out=false] - boolean indicating whether an output array has been provided
* @returns {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function apply() {
	/* jshint newcap:false */
	var nargs = arguments.length,
		args = new Array( nargs ),
		opts = {},
		ctor,
		err,
		fcn,
		out,
		arr,
		len,
		dt,
		i, j;

	for ( i = 0; i < nargs; i++ ) {
		args[ i ] = arguments[ i ];
	}
	if ( !isTypedArrayLike( args[ nargs-1 ] ) ) {
		nargs -= 1;
		err = validate( opts, args[ nargs ] );
		if ( err ) {
			throw err;
		}
		args.length = nargs;
	}
	fcn = args.shift();
	nargs -= 1;
	if ( !isFunction( fcn ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a function. Value: `' + fcn + '`.' );
	}
	for ( i = 0; i < nargs; i++ ) {
		if ( !isTypedArrayLike( args[ i ] ) ) {
			if ( !opts.out || i > 0 || !isArrayLike( args[ 0 ] )  ) {
				throw new TypeError( 'invalid input argument. Input data structures must be typed arrays. Value: `' + args[ i ] + '`.' );
			}
		}
		if ( i === 0 ) {
			len = args[ i ].length;
		}
		else if ( args[ i ].length !== len ) {
			throw new Error( 'invalid input argument. All input arrays must have the same length.' );
		}
	}
	if ( opts.out ) {
		out = args.shift();
		nargs -= 1;
	} else {
		dt = opts.dtype || 'float64';
		ctor = ctors( dt );
		if ( ctor === null ) {
			throw new Error( 'invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
		}
		out = new ctor( len );
	}
	if ( nargs <= 0 ) {
		throw new Error( 'insufficient input arguments. Must provide input arrays.' );
	}
	arr = new Array( nargs );
	for ( i = 0; i < len; i++ ) {
		for ( j = 0; j < nargs; j++ ) {
			arr[ j ] = args[ j ][ i ];
		}
		out[ i ] = fcn.apply( null, arr );
	}
	return out;
} // end FUNCTION apply()


// EXPORTS //

module.exports = apply;
