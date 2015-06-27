var Button = React.createClass({
	getDefaultProps: function() {
    return {
      onClick : function(){}, 
    };
 },
	propTypes : function() {
		return {
			text : React.PropTypes.string.isRequired,
			onClick : React.PropTypes.function,
	  };
	},
	getInitialState: function() {
		return {};
  },
  handleClick : function() {
  	this.props.onClick();  	
  },
  render: function() {
    return   <div className="start_button" onClick={this.handleClick}>
					{this.props.text}
			</div>;
  },
});
