import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * replacement for LocalStorageData class
 */
export default class AsyncStorageData {

    constructor(){
        console.log("Constructed an AsyncStorageData()");
    }

    getString(key) {
        return AsyncStorage.getItem(key);
    }

    setString(string, data) {
        return AsyncStorage.setItem(string, data)
            .then(result => {
                return true;
            });
    }

    getObject(key) {
        return AsyncStorage.getItem(key)
            .then(result => {
                return JSON.parse(result);
            });
    }

    setObject(key, data) {
        return AsyncStorage.setItem(key, JSON.stringify(data))
            .then(result => {
                return true;
            });
    }

    remove(key){
        return AsyncStorage.removeItem(key);
    }

}