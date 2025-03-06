import { ObjectId } from 'mongodb';
import { z } from 'zod';

/**
 * @file MongoDB schemas.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const ObjectIdSchema = z
	.string()
	.refine(val => ObjectId.isValid(val), {
		message: 'The object id is invalid.',
	})
	.transform(val => new ObjectId(val));

export type ObjectIdSchemaType = z.infer<typeof ObjectIdSchema>;
