// js/db.js - Database Configuration
const dbName = "MayraDB";
const dbVersion = 1;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("properties")) {
                db.createObjectStore("properties", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject("DB Error: " + e.target.errorCode);
    });
}

// Function to add property to database
async function savePropertyToDB(property) {
    const db = await initDB();
    const tx = db.transaction("properties", "readwrite");
    const store = tx.objectStore("properties");
    store.add(property);
    return tx.complete;
}

// Function to get all properties from database
async function getAllPropertiesFromDB() {
    const db = await initDB();
    return new Promise((resolve) => {
        const tx = db.transaction("properties", "readonly");
        const store = tx.objectStore("properties");
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
    });
}