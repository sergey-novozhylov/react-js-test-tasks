import React from "react";

const ParseInt = () => {
    
    const myParseInt = (str) => {
        var res = 0;    
        var nums = {
            "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
            "6": 6, "7": 7, "8": 8, "9": 9};
        for (var i=0; i<str.length; i++) {
            let char = str.charAt(i);
            let value = nums[char];
            res += value;
            res *= 10;                 
        }

        res /= 10;
        return res;
    }
    
    const result = myParseInt('123') + 2;

    return (
        <div>parseint : {result}</div>
    );
}

export default ParseInt;