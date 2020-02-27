


exports.db = (clientDB) => {
    return {

        set: async (userId, user) => {
            result = clientDB.collection("users").updateOne({ username: userId }, { $set: user }, { upsert: true })
            if (result.upsertedCount > 0) {
                console.log(`One document was inserted with the id ${result.upsertedId._id}`);
            } else {
                console.log(`${result.modifiedCount} document(s) was/were updated.`);
            }
        },

        connect: () => clientDB.connect()

    }
}