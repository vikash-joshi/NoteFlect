const { Note, Category } = require("../models/Notes");
const mongoose = require('mongoose');
const SaveCategory = async (_category) => {
  try {
    let op = "add";
    let FindCategoryExits = await Category.find({
      name: _category.name,
      user: _category.user
    });
    console.log("catname", _category.name);
    console.log("findcat", FindCategoryExits);
    if (FindCategoryExits && FindCategoryExits.length > 0) {
      _category._id = FindCategoryExits[0]._id;
      _category.user = _category.userId;
      op = "update";
    }
    let _newCategory = new Category(_category);
    if (op == "add") {
      Result = await _newCategory.save();
      console.log("save", Result);
      return {
        message: "1:Category Saved Success",
        Data: Result._id
      };
   
    } else {
      Result = await Category.updateOne(
        {
          _id: _category._id
        },
        {
          $set: {
            name: _category.name
          }
        }
      );
      console.log('saveres',Result);
      return {message: Result  && Result.modifiedCount>0 ?"1:Category Update Success":"1:Category Update Failed", Data: _category._id };

    }
  } catch (ex) {
    return {
      message: "0:" + ex.message,
      Data: null
    };
  }
};

const SaveNote = async (NoteModel, userId) => {
  try {
    let Result = await SaveCategory({name:NoteModel.category,user: userId});
    console.log('result',Result);
    if (Result && Result.message.includes("1:")) {
      let _Note=[], DuplicateRecord ={};
      if(NoteModel && NoteModel._id && NoteModel._id!='') {
        _Note = await Note.find({ user: userId ,_id:NoteModel._id });
        _ExistingNote=_Note[0];
      } 
      else{
        _Note = await Note.find({ user: userId});
        console.log('_Note',_Note)
        DuplicateRecord = _Note && _Note.length > 0 ? _Note.find((x) => x.title == NoteModel.title && x.category == Result.Data  )  : undefined;
        _ExistingNote = DuplicateRecord  ? DuplicateRecord : undefined;
        console.log('_ExistingNote',_ExistingNote)
        if(_ExistingNote)
          {
            return {message:'0:Duplicate Record',Data:null};
          }
      }

       if (_ExistingNote) {
        let UpdateNote = await Note.updateOne(
          {
            _id: _ExistingNote._id.toString()
          },
          {
            $set: {
              title: NoteModel.title,
              content: NoteModel.content,
              category: Result.Data,
              modifiedAt: Date.now()
            }
          }
        );
        console.log(UpdateNote)
        if (UpdateNote && UpdateNote.modifiedCount>0) {
          return {
            message: "1:Updated Successfully",
            Data: {
              id: _ExistingNote.id
            }
          };
        } else {
          return {
            message: "0:Updated Failed",
            Data: null
          };
        }
        /*.then(
          (res) => {
            //console.log(res);
            return {
              message: "1:",
              Data: {
                id: _ExistingNote.id
              }
            };
          },
          (error) => {
            console.log(error);
            return {
              message: "0:" + error.message,
              Data: null
            };
          }
        );*/
      } else {
        console.log(userId);
        let _Note = new Note({
          title: NoteModel.title,
          content: NoteModel.content,
          category: Result.Data,
          user: userId,
          createdAt: Date.now()
        });
        let NoteResult = await _Note.save();
        if (NoteResult) {
          return {
            message: "1:Save Success"
          };
        } else {
          return {
            message: "0:Error Saving",
            Data: null
          };
        }
      }
    } else {
      return { message: Result.message };
    }
  } catch (ex) {
    return { message: "0:" + ex.message };
  }
};


const RemoveNote=async (note,userId)=>{
  try{
    console.log('Remove')
    console.log({_id:new mongoose.Types.ObjectId(note),user:new mongoose.Types.ObjectId(userId)})
  let result = await Note.deleteOne({_id:new mongoose.Types.ObjectId(note),user:new mongoose.Types.ObjectId(userId)})
  
  if(result.deletedCount === 1)
  {
    return { message: "1:Note Deleted Success" }
  }
  else{
    return { message: "0:Note Failed To Remove" };
  }
  }
  catch(ex)
  {
    return { message: "0:" + ex.message };
  }
}

const GetAllCategory=async(userId)=>{

  try{
console.log(userId);
  let Categories = await Category.aggregate([
    {
        $lookup: {
            from: "notes",
            localField: "_id",
            foreignField: "category",
            as: "notes"
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            noteCount: { $size: "$notes" }
        }
    },
    {
        $sort: { name: 1 }
    }
]);
  console.log(Categories);
  return Categories;
  }
  catch(ex)
  {
    return { message: "0:" + ex.message };
  }
};

const GetAllNotesByCategory=async(userId,category)=>{
  try{
  console.log(new mongoose.Types.ObjectId(userId),new mongoose.Types.ObjectId(category))
    let NotesByCategory = await Note.find({user:new mongoose.Types.ObjectId(userId),category:new mongoose.Types.ObjectId(category)}).populate('category', 'name');
    console.log(NotesByCategory);
    return NotesByCategory.map(note => ({
      _id: note._id,
      title: note.title,
      content: note.content,
      category: note.category.name, // Replace category object with category name
      user: note.user,
      createdAt:note.createdAt
  }));
  }
  catch(ex)
  {
    return { message: "0:" + ex.message };
  }
};
const getCategoryNoteCounts =async()=> {
  try {
      const result = await Category.aggregate([
          {
              $lookup: {
                  from: "notes",
                  localField: "_id",
                  foreignField: "category",
                  as: "notes"
              }
          },
          {
              $project: {
                  _id: 1,
                  name: 1,
                  noteCount: { $size: "$notes" }
              }
          },
          {
              $sort: { name: 1 }
          }
      ]);

      console.log(result);
  } catch (err) {
      console.error(err);
  }
}

  const GetAllNotesByUser=async(userId,category,page)=>{
    try{
      page=page && page>0 ? page:1;
      const _skip = (page - 1) * 2;

      let NewPage=await Note.aggregate([
        { $match: { user:new mongoose.Types.ObjectId(userId) } }, // Match the user ID
        { $facet: {
            data: [
                { $skip: _skip },
                { $limit: 4 },
                { $lookup: {
                    from: 'categories', // The name of the category collection
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }},
                { $unwind: '$category' },
                { $addFields: { 'category': '$category.name' } } // Only keep the category name
            ],
            totalCount: [
                { $count: 'count' }
            ]
        }}
    ]);
      console.log(NewPage[0].data[0]);
      let Pagination = await Note.find({user:new mongoose.Types.ObjectId(userId)}).skip(_skip)
      .limit(2)
      .populate('category', 'name')
      .exec();
      let Categories = await Category.aggregate([
        {
            $lookup: {
                from: "notes",
                localField: "_id",
                foreignField: "category",
                as: "notes"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                noteCount: { $size: "$notes" }
            }
        },
        {
            $sort: { name: 1 }
        }
    ]);

    
      return {Notes: NewPage[0].data.map(note => ({
        _id: note._id,
        title: note.title,
        content: note.content,
        category: note.category, // Replace category object with category name
        user: note.user,
        createdAt:note.createdAt
    })),Category:Categories,TotalCount:NewPage[0].totalCount[0]?.count}
;
}
catch(ex)
{
  return { message: "0:" + ex.message };
}
    };

module.exports = {
  SaveNote,SaveCategory,GetAllCategory,GetAllNotesByCategory,GetAllNotesByUser,RemoveNote
};
