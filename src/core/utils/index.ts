import { ObjectId } from 'mongodb';

import { ObjectEntityId } from '@/core/entities/ObjectEntityId';

/**
 * Convert an id to an ObjectId.
 *
 * @param {ObjectEntityId | ObjectId | string} id - The id to convert.
 * @returns {ObjectId}
 * @since 0.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const idToObjectId = (id: ObjectEntityId | ObjectId | string): ObjectId => {
	if (id instanceof ObjectEntityId) {
		return id.value;
	}

	if (id instanceof ObjectId) {
		return id;
	}

	if (typeof id !== 'string') {
		throw new Error('Invalid ID data type.');
	}

	if (ObjectId.isValid(id) === false) {
		throw new Error('Invalid ID format.');
	}

	return new ObjectId(id);
};
