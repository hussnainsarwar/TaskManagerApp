const mongoose=require('mongoose');


const TaskSchema=new mongoose.Schema({
  title:{
    type:String,
    trim:true,
    minlength:3
  },
  _taskListId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  completed:{
    type:Boolean,
    default:false,
  }

});

//model building for schema
const Task=mongoose.model('Task',TaskSchema);//here TaskList inside bracket is database name collection and TaskListSchema is the schema for it

module.exports=Task; //export it so we can import it somewhere else