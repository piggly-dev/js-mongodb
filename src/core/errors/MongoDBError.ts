import { RuntimeError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file MongoDB error class.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MongoDBError extends RuntimeError {
	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {Error} error - The error to be wrapped.
	 * @memberof MongoDBError
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(error: Error) {
		super(
			'DatabaseError',
			crc32('DatabaseError'),
			'Database error.',
			503,
			'An error occurred while processing your database request.',
			error,
		);
	}
}
