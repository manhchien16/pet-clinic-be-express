const mongoose = require('mongoose');

/**
 * Base Repository class cung cấp các method CRUD cơ bản
 * Tất cả repositories khác sẽ extend từ class này
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Tạo document mới
   * @param {Object} doc - Document data để tạo
   * @param {Object} session - MongoDB session cho transaction
   * @returns {Promise<Object>} - Document đã tạo
   */
  async create(doc, session = null) {
    try {
      const options = session ? { session } : {};
      const createdEntity = new this.model(doc);
      return await createdEntity.save(options);
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /**
   * Tìm document theo ID
   * @param {String} id - Document ID
   * @param {Array} excludedFields - Các field cần loại bỏ
   * @param {Array} populate - Các field cần populate
   * @returns {Promise<Object|null>} - Document hoặc null
   */
  async findById(id, excludedFields = [], populate = []) {
    try {
      const projection = excludedFields.map(field => `-${field}`).join(' ');
      let query = this.model.findById(id);
      
      if (projection) {
        query = query.select(projection);
      }
      
      if (populate.length > 0) {
        populate.forEach(field => {
          query = query.populate(field);
        });
      }
      
      return await query.exec();
    } catch (error) {
      throw new Error(`Error finding document by ID: ${error.message}`);
    }
  }

  /**
   * Tìm một document với filter
   * @param {Object} filterQuery - Query filter
   * @param {Array} excludedFields - Các field cần loại bỏ
   * @param {Array} populate - Các field cần populate
   * @returns {Promise<Object|null>} - Document hoặc null
   */
  async findOne(filterQuery, excludedFields = [], populate = []) {
    try {
      const projection = excludedFields.map(field => `-${field}`).join(' ');
      let query = this.model.findOne(filterQuery);
      
      if (projection) {
        query = query.select(projection);
      }
      
      if (populate.length > 0) {
        populate.forEach(field => {
          query = query.populate(field);
        });
      }
      
      return await query.exec();
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  /**
   * Tìm tất cả documents với pagination
   * @param {Object} filterQuery - Query filter
   * @param {Number} page - Số trang
   * @param {Number} limit - Số lượng items per page
   * @param {Array} excludedFields - Các field cần loại bỏ
   * @param {Array} populate - Các field cần populate
   * @param {String} keyword - Từ khóa search
   * @param {Array} searchFields - Các field để search
   * @param {Object} sortBy - Sort options
   * @returns {Promise<Object>} - Kết quả với pagination
   */
  async findAllWithPagination(
    filterQuery = {},
    page = 1,
    limit = 10,
    excludedFields = [],
    populate = [],
    keyword = '',
    searchFields = [],
    sortBy = { createdAt: -1 }
  ) {
    try {
      const skip = (page - 1) * limit;
      const projection = excludedFields.map(field => `-${field}`).join(' ');
      
      const andConditions = [];

      // Add filter conditions
      if (Object.keys(filterQuery).length > 0) {
        andConditions.push(filterQuery);
      }

      // Add search conditions
      if (keyword && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => ({
          [field]: { $regex: keyword, $options: 'i' }
        }));
        andConditions.push({ $or: searchConditions });
      }

      const finalFilter = andConditions.length > 1 
        ? { $and: andConditions }
        : andConditions[0] || {};

      let query = this.model
        .find(finalFilter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy);

      if (projection) {
        query = query.select(projection);
      }

      if (populate.length > 0) {
        populate.forEach(field => {
          query = query.populate(field);
        });
      }

      const [results, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(finalFilter).exec()
      ]);

      return {
        results,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error finding documents with pagination: ${error.message}`);
    }
  }

  /**
   * Update document
   * @param {Object} filterQuery - Query filter
   * @param {Object} updateQuery - Update data
   * @param {Array} excludedFields - Các field cần loại bỏ khỏi response
   * @param {Array} populate - Các field cần populate
   * @param {Object} session - MongoDB session cho transaction
   * @returns {Promise<Object|null>} - Document đã update
   */
  async update(
    filterQuery,
    updateQuery,
    excludedFields = [],
    populate = [],
    session = null
  ) {
    try {
      const options = { new: true };
      if (session) options.session = session;

      const projection = excludedFields.map(field => `-${field}`).join(' ');
      
      let query = this.model.findOneAndUpdate(filterQuery, updateQuery, options);
      
      if (projection) {
        query = query.select(projection);
      }
      
      if (populate.length > 0) {
        populate.forEach(field => {
          query = query.populate(field);
        });
      }
      
      return await query.exec();
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  /**
   * Delete document
   * @param {Object} filterQuery - Query filter
   * @param {Object} session - MongoDB session cho transaction
   * @returns {Promise<Boolean>} - True nếu delete thành công
   */
  async delete(filterQuery, session = null) {
    try {
      const options = session ? { session } : {};
      const result = await this.model.deleteOne(filterQuery, options).exec();
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  /**
   * Đếm số lượng documents
   * @param {Object} filterQuery - Query filter
   * @returns {Promise<Number>} - Số lượng documents
   */
  async count(filterQuery = {}) {
    try {
      return await this.model.countDocuments(filterQuery).exec();
    } catch (error) {
      throw new Error(`Error counting documents: ${error.message}`);
    }
  }

  /**
   * Kiểm tra document có tồn tại không
   * @param {Object} filterQuery - Query filter
   * @returns {Promise<Boolean>} - True nếu tồn tại
   */
  async exists(filterQuery) {
    try {
      const doc = await this.model.findOne(filterQuery).select('_id').exec();
      return !!doc;
    } catch (error) {
      throw new Error(`Error checking document existence: ${error.message}`);
    }
  }

  /**
   * Bulk create documents
   * @param {Array} docs - Array of documents để tạo
   * @param {Object} session - MongoDB session cho transaction
   * @returns {Promise<Array>} - Array of created documents
   */
  async bulkCreate(docs, session = null) {
    try {
      const options = session ? { session } : {};
      return await this.model.insertMany(docs, options);
    } catch (error) {
      throw new Error(`Error bulk creating documents: ${error.message}`);
    }
  }

  /**
   * Aggregate query
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} - Aggregation result
   */
  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      throw new Error(`Error executing aggregation: ${error.message}`);
    }
  }

  /**
   * Find documents và return raw objects
   * @param {Object} filterQuery - Query filter
   * @param {Object} projection - Fields projection
   * @param {Object} options - Query options (sort, limit, skip)
   * @returns {Promise<Array>} - Array of documents
   */
  async find(filterQuery = {}, projection = '', options = {}) {
    try {
      return await this.model.find(filterQuery, projection, options).exec();
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }
}

module.exports = BaseRepository;