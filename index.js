const express = require("express");
const session = require("express-session");
const cors = require("cors");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");
const mongoose = require("mongoose");
const postRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");

const {
	MONGO_USER,
	MONGO_PASSWORD,
	MONGO_IP,
	MONGO_PORT,
	REDIS_URL,
	REDIS_PORT,
	SESSION_SECRET,
	REDIS_PASSWORD,
} = require("./config/config");

const port = process.env.PORT || 3000;

// creating redis client
const redisClient = redis.createClient({
	legacyMode: true,
	socket: {
		port: REDIS_PORT,
		host: REDIS_URL,
		password: REDIS_PASSWORD,
	},
});

redisClient.connect().catch(console.error);

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
	mongoose
		.connect(mongoURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log("MongoDb connected successfully"))
		.catch((e) => {
			console.log(e);
			setTimeout(connectWithRetry, 5000);
		});
};

connectWithRetry();
app.enable("trust proxy");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: SESSION_SECRET,
		saveUninitialized: true,
		resave: false,
		cookie: {
			secure: false,
			resave: false,
			saveUninitialized: false,
			httpOnly: true,
			maxAge: 300000,
		},
	}),
);

// Routes

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", authRouter);

app.get("/api/v1/", (req, res) => {
	res.send("<h1>Hello World!!!</h1>");
	console.log("I ran");
});

///
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
