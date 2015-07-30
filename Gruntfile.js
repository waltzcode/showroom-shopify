'use strict';
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-shopify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		shopify: {
			options: {
				api_key: "a22c4366bc6f9b2145f07199cf738f6e",
				password: "8b80d1569ae71caa2ff7461870b63f9c",
				url: "showroom-store.myshopify.com",
				base: '.'
			}
		},
		watch: {
			shopify: {
				files: ['layout/**', 'templates/**', 'snippets/**', 'assets/**'],
				tasks: ["shopify"]
			}
		}
	});
	
	grunt.registerTask('default', ['watch:shopify']);
	
};
