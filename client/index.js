var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  render: function() {
    return (
      // {{> navbar}}

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
				<div className='message-box'>
					<div className='message-header'>
						<div className='message-name'>
							Austin Hawkins
						</div>
						<div className='message-preview-time'>
							10:39 PM
						</div>
					</div>
					<div className='message-preview'>
						Hey Tyler I would like to...
					</div>
				</div>
				<div className='message-box'>
					<div className='message-name'>
						Steven Lin
					</div>
					<div className='message-preview'>
						Yo buddy
					</div>
				</div>
				<div className='message-box'>
					<div className='message-name'>
						Sam Lee
					</div>
					<div className='message-preview'>
						Tyler why do you think...
					</div>
				</div>
				<div className='message-box'>
					<div className='message-name'>
						Tom Eng
					</div>
					<div className='message-preview'>
						Hey Tyler you're right I...
					</div>
				</div>
			</div>
			<div className='right-user-column-message'>
				<div className='message-view-panel'>
					<div className='messages-expanded'>
						<div className='message-sender'>
							Steven Lin
						</div>
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
									Idk man I'm just chilling out at Ihouse. You wanna do something?
								</div>
								<div className='receiver-message-time'>
									9:31 PM 7/19/16
								</div>
							</div>
						</div>
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


    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));