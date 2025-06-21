// eslint-disable-next-line
require("dotenv").config();

// We installed dotenv package because with Jest we are not using NextJS (with which we can access the enviroment variables through process.env) and in this file we connect the env file with jest (also in jest config file we put it in the setupFiles array).
