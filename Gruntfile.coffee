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
						'src/config/*.coffee'
						'src/directives/*.coffee'
						'src/filters/*.coffee'
						'src/services/*.coffee'
						'src/controllers/*.coffee'
					]
					
		uglify:
			options:
				mangle:
					except: ['jQuery', 'Backbone', 'angular']
			js:
				files:
					'assets/app.min.js.liquid': ['scripts/app.js']
		compass:
			dist:
				options:
					require: ['./scss_cus_funcs.rb']
					sassDir: ['scss']
					cssDir: ['styles']
					#outputStyle: 'compressed'
					#environment: 'production'
		copy:
			styles:
				src: 'styles/app.css'
				dest: 'assets/app.min.css.liquid'
		watch:
			dev:
				files: [
					'dev/sass/**'
				]
				tasks: ['compass']
			compass:
				files: [
					'scss/**'
				]
				tasks: ['compass', 'copy:styles']
			shopify:
				files: [
					'layout/**'
					'templates/**'
					'config/**'
					'snippets/**'
					'assets/**'
				]
				tasks: ["shopify"]
			coffee:
				files: [
					'src/*.coffee'
					'src/config/*.coffee'
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
	grunt.loadNpmTasks 'grunt-contrib-compass'
	grunt.loadNpmTasks 'grunt-contrib-copy'

	grunt.registerTask 'default', ['watch']
