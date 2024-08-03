


const mongoose=require('mongoose');
const {Schema}=mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    createdAt: { type: Date }

});
    
// Define the Note schema
const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' ,required:true },
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date }
});

// Create models from the schemas
const Category = mongoose.model('Category', categorySchema);
const Note = mongoose.model('Note', noteSchema);
//const CategoryReference = mongoose.model('CategoryReference', categoryReferenceSchema);
  

module.exports = {
    Note,
    Category
   // CategoryReference
  };