import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import spacetime from 'spacetime';
import * as chrono from 'chrono-node';
import { applyAllPatterns, COMMIT, PROMISE } from '../data/patterns';
import '../styles/omnibar.scss';
import Emoji from './Emoji';

export default function Omnibar() {
  const [suggestions, setSuggestion] = useState([]);
  const [value, setValue] = useState('');

  // getSuggestion = text => {

  // }

  const renderSuggestion = suggestion => (
    <div className="suggestion">
      {suggestion.type === COMMIT && (
        <div className="tag tag-commit">
          <Emoji symbol="✅" />
          Commit
        </div>
      )}
      {suggestion.type === PROMISE && (
        <div className="tag tag-promise">
          <Emoji symbol="🔮" />
          Promise
        </div>
      )}
      {suggestion.start && (
        <div className="tag tag-time">
          <Emoji symbol="⌚" />
          {formatDate(suggestion)}
        </div>
      )}
      {/* {suggestion.start && } */}
      <p className="description">{suggestion.description}</p>
    </div>
  );

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = data => {
    setSuggestion(applyAllPatterns(data.value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestion([]);
  };

  const formatDate = data => {
    const start = spacetime(data.start);
    const end = spacetime(data.end);
    if (data.start) {
      const startFormat = start.isBetween(
        spacetime(chrono.parseDate('last week')),
        spacetime(chrono.parseDate('next week')),
      )
        ? `{day} the {date-ordinal} {time}`
        : `{day-short}. {month} {date} {time}`;

      const endFormat = `{time}`;
      return `${start.format(startFormat)}${
        data.end !== undefined ? ` to ${end.format(endFormat)}` : ''
      }`;
    }
    throw new Error('Start date undefined!');
  };

  return (
    <div className="omnibar-container">
      {/* <input
        className="omnibar"
        placeholder="What's happening?"
        onChange={event => {
          setSuggestion(applyAllPatterns(event.target.value));
        }}
      /> */}
      <Autosuggest
        suggestions={suggestions}
        getSuggestionValue={suggestion => suggestion.name}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "What's happening?",
          value,
          onChange: (event, { newValue }) => setValue(newValue),
        }}
      />
    </div>
  );
}
