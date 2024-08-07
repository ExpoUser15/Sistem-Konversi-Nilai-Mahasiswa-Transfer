class Queries {
    constructor(model) {
        this.model = model;
    }

    // Create
    async create(data) {
        try {
            const result = await this.model.create(data);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Read
    async findAll(conditions = {}, options = {}) {
        try {
            const data = await this.model.findAll({
                where: conditions,
                ...options
            });

            const results = data.map(item => item.dataValues);
            return results;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async findOne(conditions = {}, options = {}) {
        try {
            const result = await this.model.findOne({
                where: conditions,
                ...options
            });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Update
    async update(data, conditions) {
        try {
            const result = await this.model.update(data, {
                where: conditions
            });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Delete
    async delete(conditions) {
        try {
            const result = await this.model.destroy({
                where: conditions
            });
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Join
    async findWithJoin(conditions = {}, includes = [], options = {}) {
        try {
            const results = await this.model.findAll({
                where: conditions,
                include: includes,
                ...options
            });
            return results;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Limit
    async findWithLimit(conditions = {}, limit = 10, options = {}) {
        try {
            const results = await this.model.findAll({
                where: conditions,
                limit: limit,
                ...options
            });
            return results;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = Queries;
