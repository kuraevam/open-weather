"use strict";

const Cron = require("@r2d2bzh/moleculer-cron");
const axios = require("axios");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('@r2d2bzh/moleculer-cron').Cron} Cron
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "weather",
	version: 1,
	mixins: [Cron],
	crons: [   
		{
			cronTime: process.env.CRON_WEATHER,
			onTick() {
				this.call("v1.weather.say");
			},
		},
	],
	actions: {
		say: {
			async handler(ctx) {
				try {
					const units = "metric";
					const latLondon = 51.507351;
					const lonLondon = -0.127696;

					const weather = await this.getWeather(latLondon, lonLondon, units);
					if(weather && weather.temp) {
						ctx.broadcast("weather.say", {name: weather.name, temp: weather.temp, units });
					} else {
						this.logger.warn("Temp is null: ", `Lat: ${latLondon}`, `Lon: ${lonLondon}`, `Units: ${units}`);
					}	
				} catch(err) {
					this.logger.error(err);
				}
			}
		},
	},
	methods: {
		async getWeather(lat, lon, units) {
			const host = this.getHostWeatherService();
			const appId = this.getAppIdWeatherService();
		
			const url = `${host}/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${appId}&units=${units}`;
			const res = await axios.get(url);

			const data = res && res.data;
			const temp = data && data.main && data.main.temp;
			const name = data && data.name;

			return { temp, name };
		},
		getHostWeatherService() {
			return process.env.SERVICE_WEATHER_HOST || "";
		},
		getAppIdWeatherService() {
			return process.env.SERVICE_WEATHER_APPID || "";
		},
	},
};
