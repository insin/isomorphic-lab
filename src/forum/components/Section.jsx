'use strict';

var React = require('react')
var {Link} = require('react-router')

var SectionForum = require('./SectionForum')

var Section = React.createClass({
  render() {
    var {id, name, description, forums} = this.props
    return <table className="Section">
      <caption>
        <h2 className="Section__name"><Link to={`/forums/section/${id}`}>{name}</Link></h2>
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
