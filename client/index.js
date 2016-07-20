var React = require('react');
var ReactDOM = require('react-dom');

// var messages = [{name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}, {name: 'Austin Hawkins', time: '10:39 PM', body: "hey whats up"}]
var messages = []

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





var App = React.createClass({
  render: function() {
    return (
<div> 
<div className='navbarr'>
	<div className='flex-ctrrr'>
		<div className='land-btn logo'> SHARECROPPER </div>
	</div>
	<div className='in-line flex-end'>
		<div className='flex-ctrrr'>
			<input className='quer' type='text' placeholder='Search for locally grown produce...'/>
			<button type="button" className="flex-ctrrr icon">
  				<span className="glyphicon glyphicon-search" aria-hidden="true"></span>
			</button>
		</div>
		<div className='flex-ctr'> 
			<div className='land-btn' id='profile-btn'> Profile </div>
		</div>
		<div className='flex-ctr'> 
			<div className='land-btn' id='home-btn'> Home </div>
		</div>
		<div className='flex-ctr'> 
			<div className='land-btn' id='home-btn'> <a href='/messages'> Messages </a> </div>
		</div>
		<div> 
			<button className='flex-ctr' data-toggle='collapse' data-target='#seebelow'>
				<div className='land-btn flex-ctr drop' id='settings-btn'> Settings </div>
			</button>
			<div className='collapse' id='seebelow'>
					<div className='flex-ctr dropp'> Garden </div>
					<div className='flex-ctr dropp'> Sell </div>
					<div className='flex-ctr dropp'> Log Out </div>
			</div>
		</div>
	</div> 
</div>

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
					{messages.length>0 ? 
					messages.map(function(message, item) {
						return 	<MessageBox key={item} name={message.name} time={message.time} body={message.body} />
					}):
						<div> You have no messages </div>
					}








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
</div>

    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));