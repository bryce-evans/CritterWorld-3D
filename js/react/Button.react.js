var Button = React.createClass({
	getDefaultProps: function() {
    return {
      onClick : function(){}, 
    };
  }
	propTypes : function() {
		return {
			text : React.PropTypes.string.isRequired,
			onClick : React.PropTypes.function,
	  };
	}
	getInitialState: function() {
  },
  handleClick : function() {
  	this.props.onClick();  	
  },
  render: function() {
    return 
      <div class="menu_tile lightbackground" onClick={this.handleClick}>
				<p>
					{this.props.text}
				</p>
			</div>;
  }
});
