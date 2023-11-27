const addParenthesisValues = (query, array) => {
    let newQuery = query;
    for (let i = 0; i < array.length; i += 1) {
        if (i === 0) newQuery += '(';

        if (i !== array.length - 1) {
            newQuery += `${array[i]},`;
        } else newQuery += `${array[i]})`;
    }

    return newQuery;
};

const addParenthesisSet = (query, arrayFields, arrayValues) => {
    let copyQuery = query;
    for (let i = 0; i < arrayFields.length; i += 1) {
        if (i !== arrayFields.length - 1) {
            copyQuery += `${arrayFields[i]} = ${arrayValues[i]},`;
        } else copyQuery += `${arrayFields[i]} = ${arrayValues[i]}`;
    }

    return copyQuery;
};

const formatValuesForSql = (values) => values.map((value) => {
    let copyValue = value;
    if (typeof value === 'string') {
        copyValue = copyValue.replace(/'null'/gi, 'null');
        copyValue = copyValue.replace(/'undefined'/gi, 'null');
        copyValue = copyValue.replace(/undefined/gi, 'null');
        copyValue = copyValue.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            '',
        );

        copyValue = copyValue.replace(/'/gi, '');
    }
    return copyValue;
});

module.exports = {
    addParenthesisValues,
    addParenthesisSet,
    formatValuesForSql,
};
