"use strict";

const _ = require("underscore");
const React = require("react");
const { useReducer, useEffect, useState } = React;
const PropTypes = require("prop-types");

const DIR_TYPE = "dir";

const getInitialState = (data = []) => ({
  filtered: [],
  expanded: [],
  data,
  search: ""
});

function filtedFunc({ data, search }) {
  return _.reduce(
    data,
    (memo, item) => {
      const { name, children } = item;

      if (name.includes(search) || filtedFunc({ data: children, search })) {
        memo.push(item);
      }

      return memo;
    },
    []
  );
}

function reducer(state, action) {
  const { type, payload } = action;
  const { expanded, data } = state;

  console.log({ data, payload });

  switch (type) {
    case "store:serch":
      const filtered = filtedFunc({ data, search: payload });

      return { ...state, search: payload, filtered };
    case "state:expand-by-default":
      return { ...state, expanded: payload };
    case "state:dir:toggle":
      return { ...state, expanded: _.contains(expanded, payload) ? _.without(expanded, payload) : [...expanded, payload] };
    default:
      throw new Error("Unknown dispatch action");
  }
}


function getExpandedDir({ data, path }) {
  const keys = path.split("/");

  return _.reduce(
    data,
    (memo, { name, children }) => {
      if (_.contains(keys, name)) {
        memo.push(name);
      }

      if (children) {
        return [...memo, ...getExpandedDir({ data: children, path })];
      }

      return memo;
    },
    []
  );
}

function File({ name }) {
  return <li>{name}</li>;
}

function Folder({ name, children, ...parameters }) {
  const { state, dispatch } = parameters;

  const isExpanded = _.contains(state.expanded, name);
  const hasChildren = !_.isEmpty(children);

  return (
    <>
      <li>
        <button onClick={() => dispatch({ type: "state:dir:toggle", payload: name })} disabled={!hasChildren}>{`${
          isExpanded ? "-" : "+"
        } ${name}`}</button>
      </li>
      {isExpanded && (
        <li>
          <Tree data={children} {...parameters} />
        </li>
      )}
    </>
  );
}

function Tree({ data, path, ...parameters }) {
  const { state, dispatch } = parameters;
  const { search, filtered } = state;

  useEffect(() => {
    if (path) {
      dispatch({ type: "state:expand-by-default", payload: getExpandedDir({ data, path }) });
    }
  }, [data, dispatch, path]);

  return (
    <ul>
      {_.map(_.isEmpty(search) ? data : filtered, ({ name, type, children }) => {
        return type === DIR_TYPE ? <Folder name={name} children={children} key={name} {...parameters} /> : <File name={name} key={name} />;
      })}
    </ul>
  );
}

const Wrapper = () => {
  const [path, updatePath] = useState("Dir 2/Dir 1 in Dir 2");
  const [state, dispatch] = useReducer(reducer, getInitialState(DAAT));

  return (
    <>
      {/* <button onClick={() => updatePath("Dir 1/Dir 1 in Dir 2")}>Open File 3 in Dir 1</button>
      <button onClick={() => updatePath("Dir 2/Dir 1 in Dir 2")}>Open File 3 in Dir 1</button> */}
      <input type="seatch" onChange={event => dispatch({ type: "store:serch", payload: event.target.value })} />

      <Tree data={DAAT} state={state} dispatch={dispatch} path={path} />
    </>
  );
};

Wrapper.displayName = "Page size filter";

Wrapper.propTypes = {};

Wrapper.defaultProps = {};

module.exports = React.memo(Wrapper, (prevProps, { actions }) => {
  return _.isEqual(prevProps.actions, actions);
});