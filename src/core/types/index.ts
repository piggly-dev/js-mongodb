/**
 * @file MongoDB register options type.
 * @since 0.1.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type MongoDBRegisterOptions = {
	database: string;
	max_poll: number;
	min_poll: number;
	url: string;
};
