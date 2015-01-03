var GameObject = require('./gameObject');

module.exports = {
	_messages: [],
	_savedGameObjects: {},
	hasMessages: function() {
		return this._messages.length > 0;
	},
	add: function(message) {
		var message = message.toString();
		this._messages.push(message);
		this._parse(message);
	},
	clear: function() {
		this._messages = [];
	},
	getMessages: function() {
		var messages = this._messages.join('\n');
		this.clear();
		return messages;
	},
	getSavedComponentsMessages: function(isImmediatelyOwned) {
		var messages = '';
		for (var id in this._savedGameObjects) {
			var gameObject = this._savedGameObjects[id];
			var components = gameObject.components;
			for (var id in components) {
				var updateComponentMessage = components[id];
				if (isImmediatelyOwned) {
					updateComponentMessage = 'o' + updateComponentMessage.slice(1);
				}
				messages += updateComponentMessage + '\n';
			}
		}
		return messages;
	},
	_parse: function(message) {
		var self = this;
		message.split('\n').forEach(function(line) {
			var command = line[0];
			switch (command) {
				case 's': self._save(line);   break;
				case 'd': self._delete(line); break;
			}
		});
	},
	_save: function(line) {
		var gameObject = new GameObject(line);
		var id = gameObject.id;
		if (id in this._savedGameObjects) {
			this._savedGameObjects[id].merge(gameObject.components);
		} else {
			this._savedGameObjects[id] = gameObject;
		}
	},
	_delete: function(line) {
		var args = line.split('\t');
		var gameObjectId = args[1];
		delete this._savedGameObjects[gameObjectId];
	}
};
