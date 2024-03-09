import mongoose from 'mongoose';

export const connectDB = (uri: string) => {
	mongoose.connect(uri, {
		dbName: 'mern-ecom-project',
	})
		.then((c) => console.log(`DB connected to ${c.connection.host}`))
		.catch((e) => console.log(e));
};
