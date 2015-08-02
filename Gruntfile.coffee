'use strict'
module.exports = (grunt) ->

	grunt.initConfig {
		pkg: grunt.file.readJSON 'package.json'
		shopify:
			options:
				api_key: 'a22c4366bc6f9b2145f07199cf738f6e'
				password: '8b80d1569ae71caa2ff7461870b63f9c'
				url: 'showroom-store.myshopify.com'
				base: '.'
		coffee:
			compile:
				options:
					join: true
				files:
					'scripts/app.js': [
						'src/*.coffee'
						'src/services/*.coffee'
						'src/controllers/*.coffee'
						'src/directives/*.coffee'
						'src/filters/*.coffee'
					]
		uglify:
			options:
				mangle:
					except: ['jQuery', 'Backbone', 'angular']
			my_target:
				files:
					'assets/app.min.js.liquid': ['scripts/app.js']
		watch:
			shopify:
				files: [
					'layout/**'
					'templates/**'
					'snippets/**'
					'assets/**'
				]
				tasks: ["shopify"]
			coffee:
				files: [
					'src/*.coffee'
					'src/services/*.coffee'
					'src/controllers/*.coffee'
					'src/filters/*.coffee'
					'src/directives/*.coffee'
				]
				tasks: ['coffee', 'uglify']
	}

	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-shopify'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-uglify'

	grunt.registerTask 'default', ['watch']
