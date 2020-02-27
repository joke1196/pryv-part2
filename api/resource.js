const { validationResult } = require('express-validator');
const Resource = require('../models/resource');

exports.create = (resourceDAO) => {
    return (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const resource = new Resource(req.body.id, req.body.data);
        resourceDAO.saveResource(resource).then(savedResource => {

            return res.status(201).json({ data: resource })
        });

    };
};

exports.get = (resourceDAO) => {
    return (req, res) => {
        resourceDAO.fetchResource(req.params.id).then(resource => {
            if (resource) {
                return res.status(200).json({ data: resource });
            }
            return res.status(404).json({ error: "Resource not found" });
        })
    }
}

exports.delete = (resourceDAO) => {
    return (req, res) => {
        resourceDAO.fetchResource(req.params.id).then(resource => {
            if (resource) {
                return resourceDAO.deleteResource(req.params.id).then(deletion => {
                    return res.status(200).json({ data: Resource.deletion(resource) });
                });
            }
            return res.status(404).json({ error: "Resource not found" });
        })
    }
}


exports.update = (resourceDAO) => {
    return (req, res) => {
        resourceDAO.fetchResource(req.params.id).then(resource => {
            if (resource) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() });
                }
                const updatedResource = Resource.update(resource, req.body.data);
                return resourceDAO.updateResource(updatedResource).then(update => {
                    return res.status(200).json({ data: updatedResource });
                });
            }
            return res.status(404).json({ error: "Resource not found" });
        })
    }
}

exports.schema = () => {
    return {
        id: {
            optional: { nullable: true },
            isAlphanumeric: true,
            in: ['body']
        },
        data: {
            isArray: false,
            isString: false,
            custom: {
                options: (value) => {
                    if (Object.keys(value).length <= 10) {
                        for (let v of Object.values(value)) {
                            if (!(Number.isInteger(v) || (typeof v === 'string' && (v.length <= 512)))) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            in: ['body']
        },
    }
}