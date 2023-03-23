"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "monitor",
	version: 1,
	dependencies: ["v1.weather"],
	events: {
		"weather.say"(ctx) {
			const temp = ctx.params.temp;
			const tempFormatted = this.getTemperatureFormatting(temp);
			if(tempFormatted){
				this.logger.info(`Temp ${ctx.params.name}: ${tempFormatted}`);
			} else {
				this.logger.info("Wrong temp:", temp);
			}
		},
	},
	methods: {
		getTemperatureFormatting(temp){

			if(typeof temp !== "number") {
				if(!temp) {
					return null;
				}

				temp = Number(temp);

				if(isNaN(temp)) {
					return null;
				}
			}

			if(temp < 10) {
				return "Cold";
			}

			if(temp > 30) {
				return "Hot";
			}

			if(10 <= temp && temp <= 30) {
				return "Good";
			}
		}
	},	
};
