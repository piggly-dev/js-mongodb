import { EntityID } from '@piggly/ddd-toolkit';
import { ObjectId } from 'mongodb';

/**
 * @file ObjectEntityId class.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class ObjectEntityId extends EntityID<ObjectId> {
	/**
	 * Generate a random ObjectId.
	 *
	 * @returns {ObjectId}
	 * @public
	 * @memberof ObjectEntityId
	 * @since 0.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateRandom(): ObjectId {
		return new ObjectId();
	}
}
