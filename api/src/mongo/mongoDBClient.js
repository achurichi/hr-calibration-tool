import { MongoClient } from 'mongodb'
import { logErrorAndThrow } from '../utils/logging.js'

class MongoDBClient {
	static instance = null

	constructor() {
		if (MongoDBClient.instance) {
			throw new Error(
				'Use MongoDBClient.getInstance() to get the single instance of this class.'
			)
		}

		this.instance = new MongoClient(process.env.DB_URL, {
			auth: {
				username: process.env.DB_USER,
				password: process.env.DB_PASS,
			},
		})

		MongoDBClient.instance = this
	}

	async connect() {
		await this.instance.connect()
		return this.instance.db(process.env.DB_NAME)
	}

	async getDB() {
		return await this.connect()
	}

	async getCollection(
		collectionName,
		throwMessageOnError = 'Error accessing database'
	) {
		let db
		try {
			db = await this.getDB()
		} catch (err) {
			logErrorAndThrow(
				`Error occurred while getting database: ${err.message}`,
				throwMessageOnError
			)
		}

		try {
			return db.collection(collectionName)
		} catch (err) {
			logErrorAndThrow(
				`Error occurred while getting collection ${collectionName}: ${err.message}`,
				throwMessageOnError
			)
		}
	}

	static getInstance() {
		if (!MongoDBClient.instance) {
			new MongoDBClient()
		}
		return MongoDBClient.instance
	}
}

export default MongoDBClient.getInstance()
