import React, { useState } from 'react';

const File = ({item}) => {

    return (
        <>
            <div>{item.type}: {item.name}</div>
        </>
    );
}

export default File;