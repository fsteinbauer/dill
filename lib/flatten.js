/**
 *
 *
 * Input:
 *   {
 *       "user": {
 *           "key_value_map": {
 *               "CreatedDate": "123424",
 *               "Department": {
 *                   "Name": "XYZ"
 *               }
 *           }
 *       }
 *   }
 *
 * Expected output:
 * {
 *    "user.key_value_map.CreatedDate": "123424",
 *   "user.key_value_map.Department.Name": "XYZ"
 * }
 *
 * @param ob object
 */
const flattenObject = (ob) => {
    let toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            const flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};
module.exports = flattenObject;