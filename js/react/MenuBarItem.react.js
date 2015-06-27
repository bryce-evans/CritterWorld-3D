var MenuBarItem = React.createClass({
	propTypes : function() {
		return {
			text : React.PropTypes.string.isRequired,
	  };
	},
	getInitialState: function() {
  },
  render: function() {
    return 
      <div class="menu-item">
				{this.props.text}
			</div>;
  }
});
