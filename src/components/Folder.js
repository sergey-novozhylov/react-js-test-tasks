import React, { useState, useEffect, useContext } from 'react';
import Context from '../Context';

const Folder = ({item,onClick,level, parentKey}) => {
    const { expandedDirectory, dispatch } = useContext(Context);
    // const isOpen = _.contains(expandedDirectory, parentKey);
    const isOpen=false;
    level++;
    const [child, setChild] = useState(null);

    const toggleFolder = () => {
        if (!child) { 
            setChild(onClick(item.children,level, parentKey));
        } else {
            setChild(null);
        }
    }

    return (
        <>
            {/* <div onClick={toggleFolder}> */}
            <div onClick={()=> dispatch( "store:folder:toggle", { parentKey } ) }>
                {child ? '-' : '+'}  {item.type}: {item.name}
                {/* {isOpen ? '-': '+'} {item.type}: {item.name} */}
            </div>
            {isOpen && (<div>{child}</div>)}
        </>
    );
}

export default Folder;