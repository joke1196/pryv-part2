const cuid = require('cuid');
const moment = require('moment');

module.exports = class Resource {
    constructor(id, data) {
        if (!id) {
            id = cuid();
        }
        this.id = id;
        this.data = data;
        this.created = moment().unix();
        this.modified = moment().unix();
    }

    static deletion(resource) {
        delete resource.data;
        resource.modified = moment().unix();
        resource.deleted = moment().unix()
        return resource;
    }

    static update(originalResource, updatedBody) {
        originalResource.data = updatedBody;
        originalResource.modified = moment.unix();
        return originalResource;
    }
}