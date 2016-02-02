Messages = new Mongo.Collection('messages');

Router.route('/', function() {
	this.render('guestBook');
	this.layout('layout');
});

Router.route('/about', function() {
	this.render('about');
	this.layout('layout');
});

Router.route('/messages/:_id', function() {
	this.render('message', {
		data: function() {
			return Messages.findOne({_id: this.params._id});
		}
	});
	this.layout('layout');
},
{
	name: 'message.show'
}
);

if (Meteor.isClient) {
	//subscribe to get the Messages collection.
	Meteor.subscribe("messages");
	
	
	Template.guestBook.helpers({
		"messages": function() {
			//return all message objects, or an empty object if DB
			//is invalid. sort with most recent entries first.
			return Messages.find({}, {sort: {createdOn: -1}}) || {};
		}
	});
	
	//event listeners for the guestBook template
  Template.guestBook.events({
		//when the form is submitted, execute this block of code.
		"submit form": function(event) {
			//prevent the default behavior, which would submit the
			//form back to this page.
			event.preventDefault();
			
			//one way to get the messagebox from the form.
			//var messageBox = document.getElementById("example");
			
			//save the messageBox as an object into a variable.
			var messageBox =
						$(event.target).find('textarea[name=guestBookMessage]');
			
			//save the text from the messageBox object into a variable.
			var messageText = messageBox.val();
			
			//save the name as an object into a variable.
			var nameBox =
						$(event.target).find('input[name=guestName]');
			
			//save the text from the name object into a variable.
			var nameText = nameBox.val();
			
			//if name and message have data,
			//enter it into the messages collection.
			if (nameText.length > 0 &&
					messageText.length > 0) {
			
				//insert an entry into the messages collection
				Messages.insert({
					"name": nameText,
					"message": messageText,
					"createdOn": Date.now()
				});
			
				//clear the inputs after an entry is added.
				nameBox.val("");
				messageBox.val("");
			}
			//display an error when one of the boxes is empty.
			else {
				alert("The name and message cannot be empty!");
			}
		}
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
	
	//publish the messages collection.
	Meteor.publish("messages", function () {
		return Messages.find();
	});
}
