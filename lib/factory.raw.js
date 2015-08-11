'use strict';

// MODULES //

var isPositiveInteger = require( 'validate.io-positive-integer' ),
	isFunction = require( 'validate.io-function' ),
	ctors = require( 'compute-array-constructors' ),
	validate = require( './validate.js' ),
	create = require( './create.js' );


// FACTORY //

/**
* FUNCTION: factory( [fcn,] num[, options] )
*	Returns a function for applying a function to each typed array element.
*
* @param {Function} [fcn] - function to apply
* @param {Number} num - number of array arguments
* @param {Object} [options] - function options
* @param {String} [options.dtype="float64"] - output data type
* @returns {Function} apply function
*/
function factory() {
	var opts = {},
		arrayFcn,
		options,
		vFLG,
		ctor,
		num,
		fcn,
		err,
		flg,
		dt;

	// Parse the input arguments (polymorphic interface)...
	if ( arguments.length === 1 ) {
		num = arguments[ 0 ];
		vFLG = 2; // arg #s
	}
	else if ( arguments.length === 2 ) {
		if ( isFunction( arguments[ 0 ] ) ) {
			fcn = arguments[ 0 ];
			num = arguments[ 1 ];
			vFLG = 12; // arg #s
		} else {
			num = arguments[ 0 ];
			options = arguments[ 1 ];
			vFLG = 23; // arg #s
		}
	}
	else {
		fcn = arguments[ 0 ];
		num = arguments[ 1 ];
		options = arguments[ 2 ];
		vFLG = 123; // arg #s
	}
	if ( !isPositiveInteger( num ) ) {
		throw new TypeError( 'invalid input argument. Argument specifying number of input arrays must be a positive integer. Value: `' + num + '`.' );
	}
	// If an apply function has been provided, validate...
	if ( vFLG === 123 ) {
		if ( !isFunction( fcn ) ) {
			throw new TypeError( 'invalid input argument. Apply function must be a function. Value: `' + fcn + '`.' );
		}
	}
	// If an `options` argument has been provided, validate...
	if ( vFLG === 23 || vFLG === 123 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	dt = opts.dtype || 'float64';
	ctor = ctors( dt );
	if ( ctor === null ) {
		throw new Error( 'invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
	}
	flg = !fcn;
	if ( flg ) {
		arrayFcn = create( num+1 );
		num += 1;
	} else {
		arrayFcn = create( fcn, num+1 );
	}
	/**
	* FUNCTION: apply( [fcn,]...array )
	*	Applies a function to each array element.
	*
	* @private
	* @param {Function} [fcn] - function to apply
	* @param {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} array - input arrays
	* @returns {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
	*/
	return function apply() {
		/* jshint newcap:false */
		var nargs = arguments.length,
			args = new Array( nargs ),
			out,
			i;

		for ( i = 0; i < nargs; i++ ) {
			args[ i ] = arguments[ i ];
		}
		if ( nargs !== num ) {
			throw new Error( 'invalid input arguments. Must provide ' + num + ' arguments.' );
		}
		out = new ctor( args[ num-1 ].length );
		if ( flg ) {
			// Make sure that the output array comes after the function to apply...
			args.unshift( null );
			args[ 0 ] = args[ 1 ];
			args[ 1 ] = out;
		} else {
			args.unshift( out );
		}
		return arrayFcn.apply( null, args );
	};
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
