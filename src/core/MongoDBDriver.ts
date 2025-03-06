import { ServiceProvider } from '@piggly/ddd-toolkit';
import { MongoClient } from 'mongodb';
import debug from 'debug';

import type { MongoDBRegisterOptions } from '@/core/types';

import { MongoDBErrorEvent } from '@/core/events/MongoDBErrorEvent';

/**
 * @file MongoDB driver class.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MongoDBDriver {
	/**
	 * The MongoDB client.
	 *
	 * @protected
	 * @type {MongoClient}
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _client: MongoClient;

	/**
	 * The MongoDB database name.
	 *
	 * @protected
	 * @type {string}
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _database: string;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {MongoClient} client - The MongoDB client.
	 * @param {string} database - The MongoDB database name.
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(client: MongoClient, database: string) {
		this._client = client;
		this._database = database;
	}

	/**
	 * Get the main database name.
	 *
	 * @returns {string}
	 * @public
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get databaseName(): string {
		return this._database;
	}

	/**
	 * Close the MongoDB connection.
	 *
	 * @returns {Promise<void>}
	 * @public
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async close(): Promise<void> {
		await this._client.close();
	}

	/**
	 * Get the MongoDB client.
	 *
	 * @returns {MongoClient}
	 * @public
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getClient(): MongoClient {
		return this._client;
	}

	/**
	 * Ping the MongoDB connection.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async ping(): Promise<boolean> {
		try {
			await this._client.db(this._database).command({ ping: 1 });
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Cleanup the MongoDB connection.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @static
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static async cleanup(): Promise<boolean> {
		const connection = ServiceProvider.get<MongoDBDriver>('MongoDBDriver');

		if (connection) {
			await connection.close();
		}

		return Promise.resolve(true);
	}

	/**
	 * Register the MongoDB driver.
	 *
	 * @param {MongoDBRegisterOptions} options - The MongoDB register options.
	 * @returns {() => Promise<boolean>}
	 * @public
	 * @static
	 * @memberof MongoDBDriver
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(options: MongoDBRegisterOptions): () => Promise<boolean> {
		return async (): Promise<boolean> => {
			const service = new MongoDBDriver(
				new MongoClient(options.url, {
					connectTimeoutMS: 5000,
					maxPoolSize: options.max_poll,
					minPoolSize: options.min_poll,
					socketTimeoutMS: 10000,
				}),
				options.database,
			);

			try {
				const ping = await service.ping();

				if (!ping) {
					throw new Error('MongoDB cannot be reached.');
				}

				debug('mongodb')('✅ MongoDB is available.');
				ServiceProvider.register('MongoDBDriver', service);
				return true;
			} catch (err: any) {
				debug('mongodb')(`❌ MongoDB is unavailable. See: ${err.message}.`);
				MongoDBErrorEvent.publish(err);
				return false;
			}
		};
	}
}
