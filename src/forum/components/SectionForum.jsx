'use strict';

var React = require('react')
var {Link} = require('react-router')

var pluralise = require('../../utils/pluralise')

var SectionForum = React.createClass({
  render() {
    var {id, name, subforums, description, topics, replies} = this.props
    return <tr className="SectionForum">
      <td>
        <h3 className="SectionForum__name">
          <Link to={`/forums/forum/${id}`}>{name}</Link>
        </h3>
        {subforums.length !== 0 && <ol className="SectionForum__subforums">
          {subforums.map(forum => <li>
            <Link to={`/forums/forum/${forum.id}`}>{forum.name}</Link>
          </li>)}
        </ol>}
        {description && <p className="SectionForum__description">
          {description}
        </p>}
      </td>
      <td className="SectionForum__stats">
        <strong>{topics}</strong> topic{pluralise(topics)}<br/>
        <strong>{replies}</strong> repl{pluralise(replies, 'y,ies')}
      </td>
    </tr>
  }
})

module.exports = SectionForum
