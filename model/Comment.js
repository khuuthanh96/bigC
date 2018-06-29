const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const commentSchema = mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    content: { type: String },
    requireDate: { type: Date }
});

const CommentModel = mongoose.model('Comment', commentSchema);

class Comment extends CommentModel {

};

module.exports = Comment;