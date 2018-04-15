function handleError(requestName, databaseConnection, error, response) {
    console.log("[" + requestName + "]: " + error);
    if(databaseConnection) {
        databaseConnection.close();
        console.log("[" + requestName + "]: Connection closed with the db.");
    }
    response.status(500).end();
}

module.exports = {
    handleError: handleError
}