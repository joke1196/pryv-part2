
const Resource = require('../models/resource');

module.exports = class ResourceDAO {
    constructor(dataStore) {
        this.db = dataStore;
        this.collection = "resources";
    }

    saveResource = (resource) => {
        return this.db.collection(this.collection).insertOne(resource).then(saved => {
            delete resource._id
            return resource
        });
    }

    fetchResource = (id) => {
        return this.db.collection(this.collection).findOne({ id: id }, { _id: 0 });
    }

    deleteResource = (id) => {
        return this.db.collection(this.collection).deleteOne({ id: id })
    }

    updateResource = (resource) => {
        return this.db.collection(this.collection).findOneAndReplace({ id: resource.id }, resource).then(saved => resource);
    }

}

