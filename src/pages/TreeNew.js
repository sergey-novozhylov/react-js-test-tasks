import React, { useEffect, useContext } from "react";
import res from "../db";
import _ from "underscore";
import { TreeContext, Provider } from "../Context";
import { FILE_TYPE, FOLDER_TYPE } from "../const";
// import Folder from '../components/Folder';
// import File from '../components/File';

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
        style={{ margin: "10px" }}
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
