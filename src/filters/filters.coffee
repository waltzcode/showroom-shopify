angular.module 'showroomFilters'
.filter 'jsonParse', ->
	(input) ->
		if angular.isObject(input) then input else JSON.parse input

.filter 'productLink', ->
	(link) ->
		if link.indexOf('showroom-store.myshopify.com') == -1 and link.indexOf('amazon.com') == -1 and link.indexOf('store.showroomapp.tv') == -1 
			'/pages/ext-product?url=' + link
		else link

.filter 'productTarget', ->
	(link) ->
		if link.indexOf('amazon') == -1 then '_self' else '_blank'

.filter 'excerptTitle', ->
	(input, length, excerpt_more) ->
		if input.length > length
			input = input.substring 0, length
			#input = input.substring 0, input.lastIndexOf(' ') + 1
			input += excerpt_more
		input
.filter 'asset_url', [
	'SHOWROOM_CONSTANTS',
	(SHOWROOM_CONSTANTS) ->
		(input) ->
			SHOWROOM_CONSTANTS.showroomCDN + input
]

.filter 'user_avatar_url', [
	'SHOWROOM_CONSTANTS',
	(SHOWROOM_CONSTANTS) ->
		(input) ->
			if input then SHOWROOM_CONSTANTS.showroomCDN + input else "{{ 'no-avatar.png' | asset_url }}"
]