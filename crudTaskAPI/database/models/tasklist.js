const mongoose=require('mongoose');


const TaskListSchema=new mongoose.Schema({
  title:{
    type:String,
    trim:true,
    minlength:3
  }

});

const TaskList=mongoose.model('TaskList',TaskListSchema);//here TaskList inside bracket is database name collection and TaskListSchema is the schema for it
module.exports=TaskList; //export it so we can import it somewhere else