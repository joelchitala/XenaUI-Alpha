export const compareDict = (dict_1 = {}, dict_2 = {}) =>{
    let results = false;
    const keys_1 = Object.keys(dict_1);

    for (let i = 0; i < keys_1.length; i++) {
        const key = keys_1[i];
        const value1 = dict_1[key]
        const value2 = dict_2[key]

        if(value2 == undefined){
            continue;
        }

        if (value1 == value2) {
            results = true;
        }else{
            if(results){
                results = false;
                break;
            }
        }

    }

    return results;
}

export const generateUUID = (max = 10000) => {
    let uuid = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 16; i++) {
        let randomValue = crypto.getRandomValues(new Uint8Array(1))[0] % chars.length;
        uuid += chars[randomValue];
    }
  
    return uuid + '-' + Math.floor(Math.random() * max).toString();
}

