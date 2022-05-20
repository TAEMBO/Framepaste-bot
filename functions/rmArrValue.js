module.exports = (array, value) => {
        for(let i = 0; i < array.length; i++){
            if(array[i].includes(value)){
                array.splice(i, 1)
                break;
            }
        }
        return array;
}