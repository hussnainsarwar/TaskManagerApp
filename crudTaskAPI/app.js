const express= require('express');//look for express in node module and load it
const app=express();
app.use(express.json());


//importing models
const TaskList=require('./database/models/tasklist');
const Task=require('./database/models/task');

app.listen(3000, ()=>{
    console.log("server started at port 3000");
});//check express js was sucessfully installed


const mongoose=require('./database/mongoose.js');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'); //frontend request allow any frontend

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/tasklists', (req,res)=>{
    TaskList.find({})
        // get the tasklist here tasklist at doen is getting all if got
       .then((tasklist) => {    
            
        res.send(tasklist);
       })
       .catch((error) => {console.log(error)});
});

//route for endpoint for creating a task list
app.post('/tasklists', (req,res)=> {
    console.log(req.body);
    const newItem = new TaskList({title:req.body.title});
    newItem.save()
      .then((taskList) => {
        res.status(201);
        res.send(taskList);
        
      })
      .catch((error) => {
        res.status(500).send('Error creating item');
      });
   }
   );


   app.get('/tasklists/:tasklistId', (req,res)=>{
    let tasklistId=req.params.tasklistId;  //here req.params.tasklistId will take parameter passed upward and find it
    TaskList.find({ _id: tasklistId})
        // get the tasklist here tasklist at doen is getting all if got
       .then((tasklist) => {          
        res.status(200);
        res.send(tasklist);
       })
       .catch((error) => {console.log(error)});
});   


//put is full update of object
app.put('/tasklists/:tasklistId', (req,res)=>{
  TaskList.findOneAndUpdate({_id:req.params.tasklistId},{$set:req.body})
    .then((tasklist) => {
        res.status(201);
        res.send(tasklist);
    })
    .catch((error) => {console.log(error)});
});


  //delete by id
  app.delete('/tasklists/:tasklistId', (req,res)=>{
    
   //delete all task within tasklist if task are deleted
   const deleteAllContainingTask=(taskList)=> {
     Task.deleteMany({_taskListId: req.params.tasklistId})
          .then(()=>{
              return taskList
          })
          .catch((error) => {console.log(error)});
   }

    const responseTaskList= TaskList.findByIdAndDelete(req.params.tasklistId)
      .then((taskList) => {
        deleteAllContainingTask(taskList);
      })
      .catch((error) => {console.log(error)});

      res.status(200);
      res.send(responseTaskList);
  });


  
//get all tasks for 1 tasklist  http://localhost:3000/tasklists/:tasklistId/tasks
app.get('/tasklists/:tasklistId/tasks', (req,res)=> {
  Task.find({_taskListId:req.params.tasklistId})
       .then((tasks) => {  //here get all the tasks
           res.status(200);
           res.send(tasks);  //return the task
       })
       .catch((error) => {console.log(error)});
     
});

//create a task inside particular tasklist
app.post('/tasklists/:tasklistId/tasks', (req,res)=> {
  //console.log('i am inside post method');
 // /*console.log(req.body);*/
  let taskObj={'title':req.body.title,'_taskListId':req.params.tasklistId};  //change here how many input feilds to take
  Task(taskObj).save()
     .then((task) => {
         res.status(201);
         res.send(task);
     })
     .catch((error) => {
         console.log(error);
         res.status(500);
     });
 });


 //get 1 tasks inside 1 tasklist  http://localhost:3000/tasklists/:tasklistId/tasks
app.get('/tasklists/:tasklistId/tasks/:taskId', (req,res)=> {
  Task.findOne({_taskListId:req.params.tasklistId,_id:req.params.taskId})
       .then((task) => {  //here get all the tasks
           res.status(200);
           res.send(task);  //return the task
       })
       .catch((error) => {console.log(error)});
     
});


//update 1 task belonging to 1 tasklist 
app.patch('/tasklists/:tasklistId/tasks/:taskId', (req,res)=>{
  Task.findOneAndUpdate({_taskListId:req.params.tasklistId,_id:req.params.taskId},{$set:req.body})
    .then((task) => {
        res.status(201);
        res.send(task);
    })
    .catch((error) => {console.log(error)});
});



//delete 1 task belonging to 1 tasklist 
app.delete('/tasklists/:tasklistId/tasks/:taskId', (req,res)=>{
  Task.findOneAndDelete({_taskListId:req.params.tasklistId,_id:req.params.taskId})
    .then((task) => {
        res.status(201);
        res.send(task);
    })
    .catch((error) => {console.log(error)});
});  




