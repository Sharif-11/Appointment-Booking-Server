"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log('Database connected successfully!!!');
            app_1.default.listen(config_1.default.port, () => {
                console.log('Server listning on port ', config_1.default.port);
            });
        }
        catch (error) {
            console.log('database not connected   ', error.message);
        }
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    });
}
const redisClient = (0, redis_1.createClient)();
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () { return yield redisClient.connect(); });
connectRedis();
exports.default = redisClient;
main().catch(err => console.log(err));
