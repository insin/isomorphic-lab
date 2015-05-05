'use strict';

var React = require('react')
var {Link} = require('@insin/react-router')

var SectionForum = React.createClass({
  render() {
    var {id, name, subforums, description, topics, replies} = this.props
    return <tr className="SectionForum">
      <td>
        <h3 className="SectionForum__name">
          <Link to="forum" params={{id}}>{name}</Link>
        </h3>
        {subforums.length !== 0 && <ol className="SectionForum__subforums">
          {subforums.map(forum => <li>
            <Link to="forum" params={{id: forum.id}}>{forum.name}</Link>
          </li>)}
        </ol>}
        {description && <p className="SectionForum__description">
          {description}
        </p>}
      </td>
      <td className="SectionForum__stats">
        <strong>{topics}</strong> topics<br/>
        <strong>{replies}</strong> replies
      </td>
    </tr>
  }
})

module.exports = SectionForum