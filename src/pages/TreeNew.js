import React, { createContext, useReducer, useEffect, useContext } from "react";
import res from "../db";
import _ from "underscore";
import TreeContext from "../Context";
// import Folder from '../components/Folder';
// import File from '../components/File';

const FOLDER_TYPE = "FOLDER";
const FILE_TYPE = "FILE";

const getDeepIndex = (deepIndex, index) => {
  return deepIndex ? `${deepIndex}_${index}` : `${index}`;
};

const getExpandedDeepIndexes = ({ data, deepIndex, path, index }) => {
  return _.reduce(
    data,
    (memo) => {
      const findObj = _.findWhere(data, { name: path[index] });
      const currentIndex = getDeepIndex(deepIndex, _.findIndex(data, findObj));

      if (!_.isEmpty(findObj) && !_.contains(memo, currentIndex)) {
        if (!_.isEmpty(findObj.children)) {
          memo.push(
            getExpandedDeepIndexes({
              data: findObj.children,
              deepIndex: currentIndex,
              index: index + 1,
              path,
            })
          );
        }
        memo.push(currentIndex);
      }
      return _.flatten(memo);
    },
    []
  );
};

const filteredFunc = ({ data, search, path = "/" }) => {
  return _.reduce(
    data,
    (memo, item) => {
      const { name, children, type } = item;

      var childExist;

      if (type === FILE_TYPE && name.includes(search)) {
        console.log(name);
        path = path + name;

        memo.unshift(path);
        return memo.concat(item);
      }

      if (!_.isEmpty(children)) {
        childExist = filteredFunc({
          data: children,
          search,
          path: path + name + "/",
        });
      }

      if (childExist && childExist.length) {
        return memo.concat({ name, children: childExist, type: FOLDER_TYPE });
      }

      return memo;
    },
    []
  );
};

const actions = {
  TOGGLE_DIR: "STATE_TOGGLE_DIR",
  DEFAULT_EXPANDED: "STATE_EXPAND_BY_DEFAULT",
  SEARCH_DATA: "STATE_SEARCH_DATA",
};

const getInitialState = (data = []) => ({
  filtered: [],
  expanded: [],
  data,
  search: "",
});

const reducer = (state, action) => {
  const { type, payload } = action;
  const { expanded, data } = state;

  switch (type) {
    case actions.SEARCH_DATA:
      const filtered = filteredFunc({ data, search: payload });
      return { ...state, search: payload, filtered };
    case actions.DEFAULT_EXPANDED:
      return { ...state, expanded: payload };
    case actions.TOGGLE_DIR:
      return {
        ...state,
        expanded: _.contains(expanded, payload)
          ? _.without(expanded, payload)
          : [...state.expanded, payload],
      };
    default:
      throw new Error("Unknown dispatch action");
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(res));

  const value = {
    getState: state,
    searchData: (search) => {
      dispatch({ type: actions.SEARCH_DATA, payload: search });
    },
    defaultExpanded: (items) => {
      dispatch({ type: actions.DEFAULT_EXPANDED, payload: items });
    },
    toggleDir: (items) => {
      dispatch({ type: actions.TOGGLE_DIR, payload: items });
    },
  };

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
};

const expandTreeBranhes = ({ data, paths }) => {
  // const paths = ['/VC/atlmfc', '/SDK'];
  if (paths.length > 0) {
    let result = [];

    _.map(paths, (arr) => {
      let path = arr.split("/");
      path.shift();
      result.push(getExpandedDeepIndexes({ data, index: 0, path }));
    });

    return _.flatten(result);
  }
};

function File({ name }) {
  return <li>{name}</li>;
}

function Folder({ name, children, deepIndex }) {
  const { toggleDir, getState } = useContext(TreeContext);
  const isExpanded = _.contains(getState.expanded, deepIndex);

  return (
    <>
      <li>
        <button onClick={() => toggleDir(deepIndex)}>
          {`${isExpanded ? "-" : "+"} ${name}`}
        </button>
      </li>
      {isExpanded && (
        <li>
          <DrawTree data={children} deepIndex={deepIndex} />
        </li>
      )}
    </>
  );
}

const DrawTree = ({ data, paths, deepIndex }) => {
  const { defaultExpanded, getState } = useContext(TreeContext);

  useEffect(() => {
    if (paths) {
      defaultExpanded(expandTreeBranhes({ data, paths }));
    }
  }, []);

  return (
    <ul>
      {_.map(
        _.isEmpty(getState.search) || deepIndex ? data : getState.filtered,
        ({ name, type, children }, index) => {
          return type === FOLDER_TYPE ? (
            <Folder
              name={name}
              children={children}
              key={name}
              deepIndex={`${getDeepIndex(deepIndex, index)}`}
            />
          ) : (
            <File name={name} key={name} />
          );
        }
      )}
    </ul>
  );
};

const Tree = () => {
  const { searchData } = useContext(TreeContext);
  const paths = ["/VC/atlmfc", "/SDK/Bootstrapper", "/DIA SDK"];

  return (
    <>
      <input
        type="search"
        onChange={(event) => searchData(event.target.value)}
      />
      <DrawTree data={res} paths={paths} />
    </>
  );
};

const TreeNew = () => {
  return (
    <Provider>
      <Tree />
    </Provider>
  );
};

export default TreeNew;
