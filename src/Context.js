import React, { createContext, useReducer } from "react";
import { FILE_TYPE, FOLDER_TYPE } from "./const";
import res from "./db";
import _ from "underscore";
import { expandTreeBranhes } from "./pages/TreeNew";

export const TreeContext = createContext();

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

const filteredFunc = ({ data, search, path = "/" }) => {
  return _.reduce(
    data,
    ({ memo, paths }, item) => {
      const { name, children, type } = item;

      if (type === FILE_TYPE && name.includes(search)) {
        path = path + name;
        return { memo: memo.concat(item), paths: paths.concat(path) };
      }

      if (!_.isEmpty(children)) {
        const childExist = filteredFunc({
          data: children,
          search,
          path: path + name + "/",
        });

        if (childExist && childExist.memo.length) {
          return {
            memo: memo.concat({
              name,
              children: childExist.memo,
              type: FOLDER_TYPE,
            }),
            paths: paths.concat(childExist.paths),
          };
        }
      }

      return { memo, paths };
    },
    { memo: [], paths: [] }
  );
};

const reducer = (state, action) => {
  const { type, payload } = action;
  const { expanded, data } = state;

  switch (type) {
    case actions.SEARCH_DATA:
      const { memo, paths } = filteredFunc({ data, search: payload });

      return {
        ...state,
        search: payload,
        filtered: memo,
        expanded: expandTreeBranhes({ data: memo, paths }),
      };
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

export const Provider = ({ children }) => {
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
