import { EventPayload, EventBus } from '@piggly/event-bus';
import { MongoError } from 'mongodb';

/**
 * @file MongoDB error event class.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MongoDBErrorEvent extends EventPayload<MongoError> {
	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {MongoError} error - The error to be wrapped.
	 * @memberof MongoDBErrorEvent
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(error: MongoError) {
		super('MONGODB_DATABASE_ERROR_EVENT', error);
	}

	/**
	 * Publish the error event.
	 *
	 * @param {MongoError} error - The error to be wrapped.
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof MongoDBErrorEvent
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static publish(error: MongoError): void {
		// @note Send the error event to the event bus.
		EventBus.instance
			.publish(new MongoDBErrorEvent(error))
			.then(() => {})
			.catch(() => {});
	}
}
