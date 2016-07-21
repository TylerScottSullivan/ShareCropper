var React = require('react');
var ReactDOM = require('react-dom');

var messages = [{name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}, {name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}]
// var messages = []

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
})


var MessageBody = React.createClass({
	render: function() {
		return (

				<div className='message-body'>
					<div className='sender-message-object send-btn'>
						<div className='sender-message-content'>
							Tyler what are you doing tonight?
						</div>
						<div className='sender-message-time'>
							9:30 PM 7/19/16
						</div>
					</div>
					<div className='receiver-message-object request-btn'>
						<div className='receiver-message-content'>
							Idk man I am just chilling out at Ihouse. You wanna do something?
						</div>
						<div className='receiver-message-time'>
							9:31 PM 7/19/16
						</div>
					</div>
				</div>
		)
	}
})



var App = React.createClass({


  getInitialState: function() {
    return {
      socket: io(),
      messages: [{name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}, {name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}]
    }   
  },
  componentDidMount: function() {

    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', function() {
      console.log('connected');
      // YOUR CODE HERE (2)
      this.state.socket.emit('room', this.state.roomName);
    }.bind(this));

    this.state.socket.on('message', function(message) {
      console.log('got new message', message)
      this.setState({
      	messages: this.state.messages.concat(message)
      })
    }.bind(this));

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
					<div className='messages-expanded'>

						<MessageSender/>
						<MessageBody/>

					</div>
					<div className='message-input-box'>
						<textarea type='text' className='message-input-field'>
						</textarea>
						<div className='message-input-button-box'>
							<div className='message-input-button send-btn'>
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

    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));