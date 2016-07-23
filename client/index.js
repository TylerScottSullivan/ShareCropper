var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var _ = require('underscore');

var messages = [{name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}, {name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}]
// var messages = []

var App = React.createClass({


  getInitialState: function() {
    return {
      socket: io(),
      sentMessages: [],
      InboxArray: [],
      messages: [{name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}, {name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}],
      newmessage: '',
    }   
  },

  componentDidUpdate: function(nextProps, nextState) {
  		console.log(this.refs, 'this refs')
  		if (this.state.sentMessages.length !== nextState.sentMessages.length) {
		  	var scrolling = ReactDOM.findDOMNode(this.refs.scroll);

	  		if(scrolling) {
				scrolling.scrollTop = scrolling.scrollHeight;
			}
  		}
        return true;
  },
  componentDidMount: function() {

  	// var scrolling = this.refs.scroll.getDOMNode();
  	// scrolling.scrollTop = scrolling.scrollHeight;

    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', function() {
      console.log('connected');
      console.log(ids[0], 'mine');
      console.log(ids[1], 'theirs');
      this.state.socket.emit('Ids', ids);
    }.bind(this));


    this.state.socket.on('loadMessages', function(data) {
    	this.setState({
    		sentMessages: this.state.sentMessages.concat(data.map(function(message, item) {
    			return message
    		}))
    	})
    }.bind(this));

    this.state.socket.on('loadInbox', function(roomArray) {
    	console.log(roomArray);

    	var InboxArray = _.map(roomArray, function(messageArray) {
    		var lastMessage = messageArray[messageArray.length - 1];
    		return [lastMessage.timesent, lastMessage, lastMessage.room];
    	})

    	var timeSortedInboxArray = _.sortBy(InboxArray, function(InboxItem){
    		return -InboxItem[0];
    	})

    	console.log(timeSortedInboxArray, "SORTED TIMME INBOX ARRAY HERE I AM HERE I AM")

    })


    this.state.socket.on('messageSent', function(data) {
    	console.log(data, "data")

		this.setState({
			sentMessages: this.state.sentMessages.concat(data)
		})
		console.log(this.state.sentMessages)
    }.bind(this));






    this.state.socket.on('message', function(message) {
      console.log('got new message', message)
      this.setState({
      	messages: this.state.messages.concat(message)
      })
    }.bind(this));

  },


  onTextInput: function(event) {
  	this.setState({
  		newmessage: event.target.value
  	})
  },

  Send: function(event) {
  	console.log(this.state.newmessage);
  	var messageSending = this.state.newmessage;
  	console.log(messageSending, "message sending")
  	this.state.socket.emit('Send', messageSending);
  	this.setState({
  		newmessage: ''
  	})
  },




  render: function() {
    return (
<div> 

<div className='user-message-body'>
	<div className='message-container'>
		<div className= 'messages-title'>
			Messages
		</div>
		<div className= 'messages-columns-body'>
			<div className='left-user-column-message'>
				<div className='message-box-title'>
					Inbox
				</div>
					{this.state.messages.length>0 ? 
						this.state.messages.map(function(message, item) {
							return 	<MessageBox key={item} name={message.name} time={message.time} body={message.body} />
						}) 
						 :
						 null
						//<div> You have 0 messages </div>
					}

			</div>
			<div className='right-user-column-message'>
				<div className='message-view-panel'>
					<MessageSender/>
					<div className='message-box-below-title'>
						<div className='messages-expanded' ref="scroll">

							<MessageBody sentMessages={this.state.sentMessages}/>

						</div>
						<div className='message-input-box'>
							<textarea type='text' className='message-input-field' onChange={this.onTextInput} value={this.state.newmessage}>
							</textarea>
							<div className='message-input-button-box'>
								<div className='message-input-button send-btn' onClick={this.Send}>
									Send
								</div>
								<div className='message-input-button request-btn'>
									Request
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</div>

    );
  }
});


var MessageBox = React.createClass({
	render: function() {

		return (
				<div className='message-box'>
					<div className='message-header'>
						<div className='message-name'>
							{this.props.name}
						</div>
						<div className='message-preview-time'>
							{this.props.time}
						</div>
					</div>
					<div className='message-preview'>
							{this.props.body}
					</div>
				</div>
		);
	}
});

var MessageSender = React.createClass({
	render: function() {
		 return (
			<div className='message-sender'>
				Steven Lin
			</div>
		 )
	}
});


var MessageBody = React.createClass({
	render: function() {
		return (

				<div className='message-body'>
					{this.props.sentMessages.map(function(message, item) {
						return message.from === ids[0] ? 
							<MessageSent key={item} content={message.messagecontent} time={message.timesent}/>
						:
							 <MessageReceived key={item} content={message.messagecontent} time={message.timesent}/>
						})
					}
				</div>
		)
	}
});


var MessageSent = React.createClass({
	render: function() {
		return (
				<div className='sender-message-object request-btn'>
					<div className='sender-message-content'>
						{this.props.content}
					</div>
					<div className='sender-message-time'>
						{moment(new Date()).format('MM/DD/YY') === moment(this.props.time).format('MM/DD/YY') ?
							moment(this.props.time).format('h:mm A ')
							:
							moment(this.props.time).format('h:mm A M/DD/YY')
						}
					</div>
				</div>
			)
	}
})

var MessageReceived = React.createClass({
	render: function() {
		return (
				<div className='receiver-message-object send-btn'>
					<div className='receiver-message-content'>
						{this.props.content}
					</div>
					<div className='receiver-message-time'>
						{moment(new Date()).format('MM/DD/YY') === moment(this.props.time).format('MM/DD/YY') ?
							moment(this.props.time).format('h:mm A ')
							:
							moment(this.props.time).format('h:mm A M/DD/YY')
						}
					</div>
				</div>
			)
	}
})


ReactDOM.render(<App />, document.getElementById('root'));