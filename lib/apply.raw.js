'use strict';

// MODULES //

var isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	ctors = require( 'compute-array-constructors' );


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
		opts,
		ctor,
		fcn,
		out,
		arr,
		len,
		dt,
		idx, end, // start/end indices
		i, j, k;

	for ( i = 0; i < nargs; i++ ) {
		args[ i ] = arguments[ i ];
	}
	nargs -= 1;
	if ( !isTypedArrayLike( args[ nargs ] ) ) {
		opts = args[ nargs ];
		nargs -= 1;
	} else {
		opts = {};
	}
	end = nargs;
	fcn = args[ 0 ];
	len = args[ 1 ].length;
	if ( opts.out ) {
		out = args[ 1 ];
		idx = 2;
		nargs -= 1;
	} else {
		dt = opts.dtype || 'float64';
		ctor = ctors( dt );
		if ( ctor === null ) {
			throw new Error( 'invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
		}
		out = new ctor( len );
		idx = 1;
	}
	arr = new Array( nargs );
	for ( i = 0; i < len; i++ ) {
		for ( k = 0, j = idx; j <= end; k++, j++ ) {
			arr[ k ] = args[ j ][ i ];
		}
		out[ i ] = fcn.apply( null, arr );
	}
	return out;
} // end FUNCTION apply()


// EXPORTS //

module.exports = apply;
