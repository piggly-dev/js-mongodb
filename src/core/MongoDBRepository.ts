import { MongoError, Db } from 'mongodb';
import debug from 'debug';

import type { MongoDBDriver } from '@/core/MongoDBDriver';

import { MongoDBErrorEvent } from '@/core/events/MongoDBErrorEvent';
import { MongoDBError } from '@/core/errors/MongoDBError';

/**
 * @file MongoDB repository class.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MongoDBRepository {
	/**
	 * The MongoDB driver.
	 *
	 * @private
	 * @type {MongoDBDriver}
	 * @memberof MongoDBRepository
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _driver: MongoDBDriver;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {MongoDBDriver} driver - The MongoDB driver.
	 * @memberof MongoDBRepository
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(driver: MongoDBDriver) {
		this._driver = driver;
	}

	/**
	 * Get the MongoDB driver.
	 *
	 * @returns {MongoDBDriver}
	 * @public
	 * @memberof MongoDBRepository
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get driver(): MongoDBDriver {
		return this._driver;
	}

	/**
	 * Read from the database.
	 *
	 * @param {function} context - The context.
	 * @param {string} [database] - The database name. If not provided, the default database will be used.
	 * @returns {Promise<undefined | T>}
	 * @public
	 * @throws {MongoDBError} If the query fails.
	 * @memberof MongoDBRepository
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async read<T>(
		context: (database: Db) => Promise<T>,
		database?: string,
	): Promise<undefined | T> {
		return this.raw(context, database);
	}

	/**
	 * Write to the database.
	 *
	 * @param {function} context - The context.
	 * @param {string} [database] - The database name. If not provided, the default database will be used.
	 * @returns {Promise<undefined | T>}
	 * @public
	 * @throws {MongoDBError} If the query fails.
	 * @memberof MongoDBRepository
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async write<T>(
		context: (database: Db) => Promise<T>,
		database?: string,
	): Promise<undefined | T> {
		return this.raw(context, database);
	}

	/**
	 * Execute the raw query.
	 *
	 * @param {function} context - The context.
	 * @param {string} [database] - The database name. If not provided, the default database will be used.
	 * @returns {Promise<undefined | T>}
	 * @private
	 * @throws {MongoDBError} If the query fails.
	 * @memberof MongoDBRepository
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private async raw<T>(
		context: (database: Db) => Promise<T>,
		database?: string,
	): Promise<undefined | T> {
		try {
			return await context(
				this._driver.getClient().db(database ?? this._driver.databaseName),
			);
		} catch (error: any) {
			debug('app:mongodb:error')('Query', error);

			if (error instanceof MongoError) {
				MongoDBErrorEvent.publish(error);
			}

			throw new MongoDBError(error);
		}
	}
}
