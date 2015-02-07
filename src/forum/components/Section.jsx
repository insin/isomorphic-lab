'use strict';

var React = require('react')

var SectionForum = require('./SectionForum')

var Section = React.createClass({
  render() {
    var {name, description, forums} = this.props
    return <table className="Section">
      <caption>
        <h2 className="Section__name"><a>{name}</a></h2>
        {description && <p className="Section__description">
          {description}
        </p>}
      </caption>
      <tbody>
        {forums.map(forum => <SectionForum {...forum}/>)}
      </tbody>
    </table>
  }
})

module.exports = Section